package com.mediquest.backend.dto;

import com.mediquest.backend.domain.enums.Difficulty;
import com.mediquest.backend.domain.enums.Specialty;
import com.mediquest.backend.domain.model.*;

import java.util.ArrayList;
import java.util.List;

public record CaseJsonDto(
    String id,
    String title,
    Specialty specialty,
    Difficulty difficulty,
    String dispatchContext,
    String scene,
    String kinematicsOrOnset,
    String protocolReference,
    PatientInfo patient,
    VitalSigns vitals,
    PrimarySurvey primarySurvey,
    SampleHistory sampleHistory,
    ClinicalMedia media,
    List<QuestionJsonDto> questions
) {
    public record QuestionJsonDto(
        String prompt,
        String protocolReference,
        List<OptionJsonDto> options
    ) {}

    public record OptionJsonDto(
        String optionKey,
        String text,
        Boolean isCorrect,
        String clinicalFeedback
    ) {}

    public ClinicalCase toEntity() {
        ClinicalCase clinicalCase = ClinicalCase.builder()
                .id(this.id)
                .title(this.title)
                .specialty(this.specialty)
                .difficulty(this.difficulty)
                .dispatchContext(this.dispatchContext)
                .scene(this.scene)
                .kinematicsOrOnset(this.kinematicsOrOnset)
                .protocolReference(this.protocolReference)
                .patient(this.patient)
                .vitals(this.vitals)
                .primarySurvey(this.primarySurvey)
                .sampleHistory(this.sampleHistory)
                .media(this.media)
                .questions(new ArrayList<>())
                .build();

        if (this.questions != null) {
            for (QuestionJsonDto qDto : this.questions) {
                Question question = Question.builder()
                        .prompt(qDto.prompt())
                        .protocolReference(qDto.protocolReference() != null ? qDto.protocolReference() : this.protocolReference)
                        .clinicalCase(clinicalCase)
                        .options(new ArrayList<>())
                        .build();

                if (qDto.options() != null) {
                    List<Option> options = new ArrayList<>();
                    for (OptionJsonDto oDto : qDto.options()) {
                        Option option = Option.builder()
                                .optionKey(oDto.optionKey())
                                .text(oDto.text())
                                .isCorrect(oDto.isCorrect() != null ? oDto.isCorrect() : false)
                                .clinicalFeedback(oDto.clinicalFeedback())
                                .question(question)
                                .build();
                        options.add(option);
                    }
                    question.setOptions(options);
                }
                clinicalCase.getQuestions().add(question);
            }
        }

        return clinicalCase;
    }
}
