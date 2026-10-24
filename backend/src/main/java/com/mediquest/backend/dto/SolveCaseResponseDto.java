package com.mediquest.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolveCaseResponseDto {
    private String caseId;
    private String selectedOptionKey;
    private String correctOptionKey;
    private Boolean isCorrect;
    private Integer scorePercentage;        // 100 o 0
    private String clinicalFeedback;        // Explicación formativa basada en PHTLS/ATLS
    private String protocolReference;
    private LocalDateTime completedAt;
}
