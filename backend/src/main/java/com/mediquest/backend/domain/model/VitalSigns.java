package com.mediquest.backend.domain.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VitalSigns {

    private Integer heartRate;            // FC (lpm)
    private Integer respiratoryRate;      // FR (rpm)
    private String bloodPressure;         // TA (mmHg ej: 120/80)
    private Integer oxygenSaturation;     // SpO2 (%)
    private Double bodyTemperature;       // Temp (°C)

    @Embedded
    private GlasgowScale glasgow;
}
