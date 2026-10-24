package com.mediquest.backend.domain.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientInfo {

    private Integer age;
    private String ageUnit;         // "años", "meses"
    private String sex;             // "Masculino", "Femenino"
    private Double weightKg;
    private String occupation;
}
