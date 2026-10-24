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
public class GlasgowScale {

    private Integer ocularResponse;
    private Integer verbalResponse;
    private Integer motorResponse;
    private Integer totalScore;
}
