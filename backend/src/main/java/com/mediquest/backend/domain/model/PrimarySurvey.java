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
public class PrimarySurvey {

    @Column(columnDefinition = "TEXT")
    private String airway;          // A - Airway con control cervical

    @Column(columnDefinition = "TEXT")
    private String breathing;       // B - Ventilación y oxigenación

    @Column(columnDefinition = "TEXT")
    private String circulation;     // C - Circulación y control de hemorragia

    @Column(columnDefinition = "TEXT")
    private String disability;      // D - Déficit neurológico y pupilas

    @Column(columnDefinition = "TEXT")
    private String exposure;        // E - Exposición y control ambiental
}
