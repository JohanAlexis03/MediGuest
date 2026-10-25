package com.mediquest.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptionDto {
    private Long id;
    private String optionKey;   // "A", "B", "C", "D"
    private String text;
    // REGLA DE SEGURIDAD: isCorrect y clinicalFeedback NO se exponen al alumno antes de resolver
}
