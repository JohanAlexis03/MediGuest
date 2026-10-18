"""Tests unitarios para el módulo de telemetría ECG."""
import unittest
import numpy as np

from src.ecg_streamer import (
    format_to_structured_json,
    generate_synthetic_ecg,
    stream_telemetry_chunks,
)


class TestECGStreamer(unittest.TestCase):
    def test_synthetic_ecg_generation(self):
        signals, metadata = generate_synthetic_ecg(
            duration_seconds=2.0,
            sampling_rate_hz=360,
            heart_rate_bpm=72,
        )
        self.assertEqual(signals.shape, (720, 2))
        self.assertEqual(metadata["sampling_rate_hz"], 360)
        self.assertIn("MLII", metadata["channels"])
        self.assertIn("V5", metadata["channels"])

    def test_format_to_structured_json(self):
        signals, metadata = generate_synthetic_ecg(duration_seconds=1.0, sampling_rate_hz=100)
        output = format_to_structured_json(signals, metadata)
        self.assertEqual(output["status"], "success")
        self.assertEqual(len(output["points"]), 100)
        self.assertIn("MLII", output["lead_signals"])
        self.assertEqual(len(output["lead_signals"]["MLII"]), 100)

    def test_stream_telemetry_chunks(self):
        chunks = list(stream_telemetry_chunks(record_name="100", max_chunks=2, chunk_samples=50))
        self.assertEqual(len(chunks), 2)
        self.assertEqual(chunks[0]["chunk_index"], 0)
        self.assertEqual(chunks[1]["chunk_index"], 1)
        self.assertTrue(chunks[1]["is_last_chunk"])


if __name__ == "__main__":
    unittest.main()
