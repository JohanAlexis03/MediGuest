package com.mediquest.backend.service;

import com.mediquest.backend.domain.model.*;
import com.mediquest.backend.dto.SolveCaseRequestDto;
import com.mediquest.backend.dto.SolveCaseResponseDto;
import com.mediquest.backend.exception.ResourceNotFoundException;
import com.mediquest.backend.repository.AttemptRepository;
import com.mediquest.backend.repository.ClinicalCaseRepository;
import com.mediquest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluationService {

    private final ClinicalCaseRepository clinicalCaseRepository;
    private final UserRepository userRepository;
    private final AttemptRepository attemptRepository;

    @Transactional
    public SolveCaseResponseDto evaluateAndSave(String caseId, SolveCaseRequestDto request) {
        ClinicalCase clinicalCase = clinicalCaseRepository.findById(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("Caso clínico con ID '" + caseId + "' no encontrado."));

        if (clinicalCase.getQuestions().isEmpty()) {
            throw new ResourceNotFoundException("El caso clínico no tiene preguntas asignadas para evaluación.");
        }

        Question question = clinicalCase.getQuestions().get(0);
        String selectedKey = request.getSelectedOptionKey().trim().toUpperCase();

        Option selectedOption = question.getOptions().stream()
                .filter(opt -> opt.getOptionKey().equalsIgnoreCase(selectedKey))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Opción '" + selectedKey + "' no válida para este caso clínico."));

        Option correctOption = question.getOptions().stream()
                .filter(Option::getIsCorrect)
                .findFirst()
                .orElse(selectedOption);

        boolean isCorrect = Boolean.TRUE.equals(selectedOption.getIsCorrect());
        int score = isCorrect ? 100 : 0;

        // Identificar al estudiante para persistir el intento (RF10)
        String email = (request.getUserEmail() != null && !request.getUserEmail().isBlank())
                ? request.getUserEmail()
                : "student@mediquest.edu";

        User student = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("No se encontró usuario para registrar el intento.")));

        Attempt attempt = Attempt.builder()
                .user(student)
                .clinicalCase(clinicalCase)
                .selectedOptionKey(selectedKey)
                .isCorrect(isCorrect)
                .scorePercentage(score)
                .timeSpentSeconds(request.getTimeSpentSeconds() != null ? request.getTimeSpentSeconds() : 0)
                .build();

        attemptRepository.save(attempt);
        log.info("Intento registrado para caso '{}' por usuario '{}': Nota={}% (Correcto={})",
                caseId, student.getEmail(), score, isCorrect);

        return SolveCaseResponseDto.builder()
                .caseId(caseId)
                .selectedOptionKey(selectedKey)
                .correctOptionKey(correctOption.getOptionKey())
                .isCorrect(isCorrect)
                .scorePercentage(score)
                .clinicalFeedback(selectedOption.getClinicalFeedback() != null
                        ? selectedOption.getClinicalFeedback()
                        : correctOption.getClinicalFeedback())
                .protocolReference(question.getProtocolReference() != null
                        ? question.getProtocolReference()
                        : clinicalCase.getProtocolReference())
                .completedAt(LocalDateTime.now())
                .build();
    }
}
