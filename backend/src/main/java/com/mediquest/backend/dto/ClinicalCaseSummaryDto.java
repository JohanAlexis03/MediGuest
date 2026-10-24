package com.mediquest.backend.dto;

import com.mediquest.backend.domain.enums.Difficulty;
import com.mediquest.backend.domain.enums.Specialty;
import com.mediquest.backend.domain.model.PatientInfo;
import com.mediquest.backend.domain.model.VitalSigns;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalCaseSummaryDto {
    private String id;
    private String title;
    private Specialty specialty;
    private Difficulty difficulty;
    private String dispatchContext;
    private PatientInfo patient;
    private VitalSigns vitals;
    private String mediaImageUrl;
    private String mediaBadgeLabel;
    private String protocolReference;
}
