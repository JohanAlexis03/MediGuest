package com.mediquest.backend.dto;

import com.mediquest.backend.domain.enums.Difficulty;
import com.mediquest.backend.domain.enums.Specialty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttemptHistoryDto {
    private Long attemptId;
    private String caseId;
    private String caseTitle;
    private Specialty specialty;
    private Difficulty difficulty;
    private String selectedOptionKey;
    private Boolean isCorrect;
    private Integer scorePercentage;
    private Integer timeSpentSeconds;
    private LocalDateTime completedAt;
}
