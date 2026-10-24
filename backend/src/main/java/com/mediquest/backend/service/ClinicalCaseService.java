package com.mediquest.backend.service;

import com.mediquest.backend.domain.enums.Difficulty;
import com.mediquest.backend.domain.enums.Specialty;
import com.mediquest.backend.domain.model.ClinicalCase;
import com.mediquest.backend.dto.ClinicalCaseDetailDto;
import com.mediquest.backend.dto.ClinicalCaseSummaryDto;
import com.mediquest.backend.dto.OptionDto;
import com.mediquest.backend.dto.QuestionDto;
import com.mediquest.backend.exception.ResourceNotFoundException;
import com.mediquest.backend.repository.ClinicalCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClinicalCaseService {

    private final ClinicalCaseRepository clinicalCaseRepository;

    @Transactional(readOnly = true)
    public List<ClinicalCaseSummaryDto> getAllCases(Specialty specialty, Difficulty difficulty) {
        List<ClinicalCase> cases = (specialty != null)
                ? clinicalCaseRepository.findBySpecialty(specialty)
                : clinicalCaseRepository.findAll();

        return cases.stream()
                .filter(c -> difficulty == null || c.getDifficulty() == difficulty)
                .map(this::toSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClinicalCaseDetailDto getCaseById(String id) {
        ClinicalCase clinicalCase = clinicalCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Caso clínico con ID '" + id + "' no encontrado."));

        return toDetailDto(clinicalCase);
    }

    private ClinicalCaseSummaryDto toSummaryDto(ClinicalCase c) {
        return ClinicalCaseSummaryDto.builder()
                .id(c.getId())
                .title(c.getTitle())
                .specialty(c.getSpecialty())
                .difficulty(c.getDifficulty())
                .dispatchContext(c.getDispatchContext())
                .patient(c.getPatient())
                .vitals(c.getVitals())
                .mediaImageUrl(c.getMedia() != null ? c.getMedia().getImageUrl() : null)
                .mediaBadgeLabel(c.getMedia() != null ? c.getMedia().getBadgeLabel() : null)
                .protocolReference(c.getProtocolReference())
                .build();
    }

    private ClinicalCaseDetailDto toDetailDto(ClinicalCase c) {
        List<QuestionDto> safeQuestions = c.getQuestions().stream()
                .map(q -> QuestionDto.builder()
                        .id(q.getId())
                        .prompt(q.getPrompt())
                        .protocolReference(q.getProtocolReference())
                        .options(q.getOptions().stream()
                                .map(opt -> OptionDto.builder()
                                        .id(opt.getId())
                                        .optionKey(opt.getOptionKey())
                                        .text(opt.getText())
                                        // Seguridad: isCorrect y clinicalFeedback NO se envían aquí
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return ClinicalCaseDetailDto.builder()
                .id(c.getId())
                .title(c.getTitle())
                .specialty(c.getSpecialty())
                .difficulty(c.getDifficulty())
                .dispatchContext(c.getDispatchContext())
                .scene(c.getScene())
                .kinematicsOrOnset(c.getKinematicsOrOnset())
                .protocolReference(c.getProtocolReference())
                .patient(c.getPatient())
                .vitals(c.getVitals())
                .primarySurvey(c.getPrimarySurvey())
                .sampleHistory(c.getSampleHistory())
                .media(c.getMedia())
                .questions(safeQuestions)
                .build();
    }
}
