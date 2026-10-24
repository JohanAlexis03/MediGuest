package com.mediquest.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolveCaseRequestDto {

    @NotBlank(message = "selectedOptionKey no puede estar vacío (ej: 'A', 'B', 'C', 'D')")
    private String selectedOptionKey;

    private Integer timeSpentSeconds;

    private String userEmail; // Si es nulo, se asume el estudiante activo por defecto
}
