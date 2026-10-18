"""
Módulo de Simulación y Transmisión de Señales ECG para Atención Prehospitalaria (APH).

Consume directamente registros clínicos de la base de datos PhysioNet (MIT-BIH Arrhythmia Database)
utilizando el paquete `wfdb` en la nube (sin descarga masiva a disco).
Formatea la telemetría en arreglos estructurados (JSON y NumPy) para monitores prehospitalarios.
"""

from __future__ import annotations

import argparse
import json
import logging
import math
import sys
import time
from typing import Any, Dict, Generator, List, Optional, Tuple

import numpy as np

try:
    import wfdb
    WFDB_AVAILABLE = True
except ImportError:
    WFDB_AVAILABLE = False

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ecg_streamer")

# Catálogo de registros representativos de arritmias en MIT-BIH PhysioNet
MIT_BIH_COMMON_RECORDS: Dict[str, str] = {
    "100": "Ritmo sinusal normal con ectopia ventricular aislada (MLII, V5)",
    "101": "Bloqueo de rama derecha del haz de His (BRDHH)",
    "106": "Contracciones ventriculares prematuras frecuentes (PVCs)",
    "119": "Bigeminismo ventricular y taquicardia ventricular corta",
    "200": "Taquicardia ventricular sostenida y polimórfica",
    "205": "Fibrilación auricular con respuesta ventricular variable",
    "208": "Paroxismos de taquicardia ventricular y extrasístoles multifocales",
}


def read_ecg_from_cloud(
    record_name: str = "100",
    database: str = "mitdb",
    sampfrom: int = 0,
    sampto: int = 1800,
    channels: Optional[List[int]] = None,
) -> Tuple[np.ndarray, Dict[str, Any]]:
    """
    Lee un segmento de señal ECG directamente desde PhysioNet usando wfdb.rdrecord.

    Parámetros:
        record_name: Nombre del registro (ej. '100', '106', '200').
        database: Nombre de la base de datos en PhysioNet (default 'mitdb').
        sampfrom: Muestra inicial (0-indexed).
        sampto: Muestra final (no inclusiva).
        channels: Lista de índices de canales a leer (ej. [0, 1]).

    Retorna:
        Tuple[np.ndarray, Dict[str, Any]]: Arreglo NumPy con las señales (muestras x canales)
        y diccionario de metadatos clínicos del registro.
    """
    if not WFDB_AVAILABLE:
        raise RuntimeError("wfdb no está instalado en el entorno. Ejecute 'pip install wfdb'.")

    logger.info(
        f"Conectando a PhysioNet ({database}/{record_name}) muestras {sampfrom} -> {sampto}..."
    )

    try:
        record = wfdb.rdrecord(
            record_name=record_name,
            pn_dir=database,
            sampfrom=sampfrom,
            sampto=sampto,
            channels=channels,
        )

        p_signal: np.ndarray = record.p_signal
        fs: int = record.fs
        sig_names: List[str] = record.sig_name if record.sig_name else [f"CH_{i}" for i in range(p_signal.shape[1])]
        units: List[str] = record.units if record.units else ["mV"] * p_signal.shape[1]

        metadata: Dict[str, Any] = {
            "record_name": record.record_name,
            "database": database,
            "sampling_rate_hz": fs,
            "channels": sig_names,
            "units": units,
            "sampfrom": sampfrom,
            "sampto": sampto,
            "total_samples": int(p_signal.shape[0]),
            "duration_seconds": round(float(p_signal.shape[0]) / fs, 4),
            "description": MIT_BIH_COMMON_RECORDS.get(record_name, f"Registro PhysioNet {record_name}"),
            "source": "PhysioNet MIT-BIH Cloud (wfdb)",
        }

        return p_signal, metadata

    except Exception as exc:
        logger.warning(f"Error al consultar PhysioNet en la nube: {exc}. Usando generador fisiológico de rescate.")
        return generate_synthetic_ecg(
            duration_seconds=round((sampto - sampfrom) / 360.0, 2),
            sampling_rate_hz=360,
            heart_rate_bpm=72,
        )


def format_to_structured_json(
    signals: np.ndarray,
    metadata: Dict[str, Any],
    include_lead_arrays: bool = True,
    include_point_stream: bool = True,
) -> Dict[str, Any]:
    """
    Convierte el arreglo NumPy y metadatos en un diccionario estructurado listo para serializar a JSON
    y consumirse por la interfaz gráfica o monitores de telemetría de la ambulancia.
    """
    channels: List[str] = metadata["channels"]
    fs: int = metadata["sampling_rate_hz"]
    total_samples = signals.shape[0]

    output: Dict[str, Any] = {
        "status": "success",
        "metadata": metadata,
    }

    if include_lead_arrays:
        lead_signals: Dict[str, List[float]] = {}
        for ch_idx, ch_name in enumerate(channels):
            # Convertir a flotantes estándar de Python con redondeo a 4 decimales
            lead_signals[ch_name] = [round(float(val), 4) for val in signals[:, ch_idx]]
        output["lead_signals"] = lead_signals

    if include_point_stream:
        points: List[Dict[str, Any]] = []
        sampfrom = metadata.get("sampfrom", 0)
        for i in range(total_samples):
            current_sample = sampfrom + i
            time_s = round(float(current_sample) / fs, 4)
            point_data: Dict[str, Any] = {
                "sample": current_sample,
                "time_s": time_s,
            }
            for ch_idx, ch_name in enumerate(channels):
                point_data[ch_name] = round(float(signals[i, ch_idx]), 4)
            points.append(point_data)
        output["points"] = points

    return output


def stream_telemetry_chunks(
    record_name: str = "100",
    database: str = "mitdb",
    chunk_samples: int = 72,  # 72 muestras a 360 Hz = ~200 ms por paquete de telemetría
    max_chunks: int = 10,
    realtime_delay: bool = False,
) -> Generator[Dict[str, Any], None, None]:
    """
    Generador que emula el flujo continuo de telemetría desde la ambulancia hacia la central médica.
    Transmite paquetes secuenciales de señales ECG estructuradas.
    """
    for chunk_idx in range(max_chunks):
        start_sample = chunk_idx * chunk_samples
        end_sample = start_sample + chunk_samples

        signals, meta = read_ecg_from_cloud(
            record_name=record_name,
            database=database,
            sampfrom=start_sample,
            sampto=end_sample,
        )

        chunk_data = format_to_structured_json(
            signals=signals,
            metadata=meta,
            include_lead_arrays=False,
            include_point_stream=True,
        )

        chunk_data["chunk_index"] = chunk_idx
        chunk_data["is_last_chunk"] = chunk_idx == (max_chunks - 1)

        yield chunk_data

        if realtime_delay:
            # Demora fisiológica equivalente a la duración del chunk
            chunk_duration = float(chunk_samples) / meta["sampling_rate_hz"]
            time.sleep(chunk_duration)


def generate_synthetic_ecg(
    duration_seconds: float = 5.0,
    sampling_rate_hz: int = 360,
    heart_rate_bpm: int = 72,
) -> Tuple[np.ndarray, Dict[str, Any]]:
    """
    Genera un trazado ECG sintético de alta fidelidad basado en el modelo fisiológico P-Q-R-S-T
    para respaldo offline en caso de cortes de conexión hacia PhysioNet.
    """
    total_samples = int(duration_seconds * sampling_rate_hz)
    t = np.linspace(0, duration_seconds, total_samples, endpoint=False)
    rr_interval = 60.0 / heart_rate_bpm

    signal_mlii = np.zeros(total_samples)

    # Componentes de la onda cardíaca (amplitud, duración relativa, desplazamiento en ciclo)
    # Onda P (despolarización auricular)
    # Complejo QRS (despolarización ventricular)
    # Onda T (repolarización ventricular)
    for sample_idx, current_time in enumerate(t):
        phase = (current_time % rr_interval) / rr_interval

        # P wave (fase ~0.15)
        p_wave = 0.18 * math.exp(-(((phase - 0.15) * 20.0) ** 2))
        # Q dip (fase ~0.28)
        q_dip = -0.15 * math.exp(-(((phase - 0.28) * 60.0) ** 2))
        # R peak (fase ~0.31)
        r_peak = 1.35 * math.exp(-(((phase - 0.31) * 75.0) ** 2))
        # S dip (fase ~0.34)
        s_dip = -0.35 * math.exp(-(((phase - 0.34) * 60.0) ** 2))
        # T wave (fase ~0.55)
        t_wave = 0.35 * math.exp(-(((phase - 0.55) * 12.0) ** 2))

        # Ruido de línea de base respiratorio suave
        baseline = 0.02 * math.sin(2.0 * math.pi * 0.25 * current_time)

        signal_mlii[sample_idx] = p_wave + q_dip + r_peak + s_dip + t_wave + baseline

    # Generar derivación V5 derivada con morfología precordial
    signal_v5 = signal_mlii * 0.75 + 0.05 * np.sin(2 * np.pi * 1.2 * t)

    p_signal = np.column_stack([signal_mlii, signal_v5])

    metadata: Dict[str, Any] = {
        "record_name": "SYNTH_APH_72",
        "database": "synthetic_aph",
        "sampling_rate_hz": sampling_rate_hz,
        "channels": ["MLII", "V5"],
        "units": ["mV", "mV"],
        "sampfrom": 0,
        "sampto": total_samples,
        "total_samples": total_samples,
        "duration_seconds": duration_seconds,
        "description": f"Trazado sinusal APH simulado ({heart_rate_bpm} lpm)",
        "source": "Generador Fisiológico APH",
    }

    return p_signal, metadata


def main() -> None:
    """CLI para interactuar con el ecg_streamer directamente desde la terminal."""
    parser = argparse.ArgumentParser(
        description="Streamer de Señales ECG PhysioNet para Monitores Prehospitalarios (APH)"
    )
    parser.add_argument("--record", default="100", help="ID del registro MIT-BIH (ej: 100, 106, 200)")
    parser.add_argument("--database", default="mitdb", help="Base de datos PhysioNet (default: mitdb)")
    parser.add_argument("--start", type=int, default=0, help="Muestra de inicio")
    parser.add_argument("--length", type=int, default=720, help="Cantidad de muestras a leer (default: 720 = 2 seg)")
    parser.add_argument("--format", choices=["json", "summary", "stream"], default="summary")
    parser.add_argument("--out", type=str, default=None, help="Ruta de archivo para guardar el JSON de salida")

    args = parser.parse_args()

    if args.format == "stream":
        logger.info(f"Iniciando flujo continuo para registro {args.record}...")
        for chunk in stream_telemetry_chunks(record_name=args.record, database=args.database, max_chunks=5):
            print(f"[CHUNK #{chunk['chunk_index']}] Puntos: {len(chunk['points'])} | Tiempo: {chunk['points'][0]['time_s']}s -> {chunk['points'][-1]['time_s']}s")
        return

    signals, meta = read_ecg_from_cloud(
        record_name=args.record,
        database=args.database,
        sampfrom=args.start,
        sampto=args.start + args.length,
    )

    result = format_to_structured_json(signals, meta)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)
        logger.info(f"Resultado guardado en {args.out}")

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        print("\n" + "=" * 60)
        print(" MONITOR ECG - TELEMETRÍA PREHOSPITALARIA (APH)")
        print("=" * 60)
        print(f"Registro:         {meta['record_name']} ({meta['database']})")
        print(f"Diagnóstico:      {meta['description']}")
        print(f"Frecuencia (Fs):  {meta['sampling_rate_hz']} Hz")
        print(f"Canales/Derivs:   {', '.join(meta['channels'])}")
        print(f"Muestras:         {meta['sampfrom']} a {meta['sampto']} ({meta['total_samples']} puntos)")
        print(f"Duración:         {meta['duration_seconds']} segundos")
        print(f"Rango de voltaje: Min {np.min(signals):.3f} mV / Max {np.max(signals):.3f} mV")
        print("=" * 60)
        print("Ejemplo de primeras 5 muestras estructuradas:")
        for pt in result["points"][:5]:
            print(f"  t={pt['time_s']:.4f}s | " + " | ".join(f"{ch}: {pt[ch]:+.3f} mV" for ch in meta['channels']))
        print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
