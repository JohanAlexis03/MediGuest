package com.mediquest.backend.dto;

import com.mediquest.backend.domain.enums.Difficulty;
import com.mediquest.backend.domain.enums.Specialty;
import com.mediquest.backend.domain.model.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalCaseDetailDto {
    private String id;
    private String title;
    private Specialty specialty;
    private Difficulty difficulty;
    private String dispatchContext;
    private String scene;
    private String kinematicsOrOnset;
    private String protocolReference;
    private PatientInfo patient;
    private VitalSigns vitals;
    private PrimarySurvey primarySurvey;
    private SampleHistory sampleHistory;
    private ClinicalMedia media;
    private List<QuestionDto> questions;
}
