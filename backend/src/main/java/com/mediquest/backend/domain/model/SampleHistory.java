package com.mediquest.backend.domain.model;

import jakarta.persistence.Column;
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
public class SampleHistory {

    @Column(columnDefinition = "TEXT")
    private String symptoms;        // S - Signos y síntomas

    @Column(columnDefinition = "TEXT")
    private String allergies;       // A - Alergias

    @Column(columnDefinition = "TEXT")
    private String medications;     // M - Medicamentos habituales

    @Column(columnDefinition = "TEXT")
    private String pastHistory;     // P - Patologías previas

    @Column(columnDefinition = "TEXT")
    private String lastMeal;        // L - Última ingesta oral

    @Column(columnDefinition = "TEXT")
    private String events;          // E - Eventos desencadenantes
}
