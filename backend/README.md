# MediQuest - Módulo de Telemetría ECG (APH)

Módulo en Python diseñado para simular y procesar el flujo de señales de electrocardiograma (ECG) para atención prehospitalaria (APH), consumiendo registros clínicos de arritmias directamente desde la nube de **PhysioNet** (MIT-BIH Arrhythmia Database) mediante el paquete `wfdb`.

## Arquitectura del Módulo

- **Fuente clínica:** PhysioNet MIT-BIH (`mitdb`).
- **Lector en la nube:** `wfdb.rdrecord` con lectura segmentada por demanda (sin descarga masiva del dataset completo).
- **Salida estructurada:** Arreglos NumPy y JSON formateado con derivaciones (MLII, V5), marcas temporales y voltaje en milivoltios (mV).
- **Mecanismo de rescate:** Generador sintético P-QRS-T en caso de desconexión o latencia en PhysioNet.

## Uso Rápido

### 1. Activar Entorno Virtual
```bash
source backend/venv/bin/activate
pip install -r backend/requirements.txt
```

### 2. Ejecutar Resumen de Telemetría (CLI)
```bash
python -m src.ecg_streamer --record 100 --start 0 --length 720
```

### 3. Exportar Trazado Estructurado a JSON
```bash
python -m src.ecg_streamer --record 106 --start 0 --length 1000 --format json --out trazado_106.json
```

## Hoja de Ruta / Backlog Futuro (Post-MVP)
- [ ] **API REST / WebSocket con FastAPI**: Servicio de streaming en tiempo real para alimentar monitores de ambulancia remotos vía WebSocket o SSE (Server-Sent Events).
- [ ] **Detector de Arritmias R-Peak**: Detección automática de complejos QRS y cálculo dinámico de frecuencia cardíaca.
