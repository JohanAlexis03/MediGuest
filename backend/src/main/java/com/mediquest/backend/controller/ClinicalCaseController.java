package com.mediquest.backend.controller;

import com.mediquest.backend.domain.enums.Difficulty;
import com.mediquest.backend.domain.enums.Specialty;
import com.mediquest.backend.dto.ClinicalCaseDetailDto;
import com.mediquest.backend.dto.ClinicalCaseSummaryDto;
import com.mediquest.backend.dto.SolveCaseRequestDto;
import com.mediquest.backend.dto.SolveCaseResponseDto;
import com.mediquest.backend.service.ClinicalCaseService;
import com.mediquest.backend.service.EvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class ClinicalCaseController {

    private final ClinicalCaseService clinicalCaseService;
    private final EvaluationService evaluationService;

    /**
     * RF03: Visualización de casos clínicos (con filtros opcionales de especialidad y dificultad).
     */
    @GetMapping
    public ResponseEntity<List<ClinicalCaseSummaryDto>> getAllCases(
            @RequestParam(required = false) Specialty specialty,
            @RequestParam(required = false) Difficulty difficulty) {
        List<ClinicalCaseSummaryDto> cases = clinicalCaseService.getAllCases(specialty, difficulty);
        return ResponseEntity.ok(cases);
    }

    /**
     * RF04 y RF05: Ficha clínica detallada (con evaluación primaria ABCDE y anamnesis SAMPLE).
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClinicalCaseDetailDto> getCaseById(@PathVariable String id) {
        ClinicalCaseDetailDto detail = clinicalCaseService.getCaseById(id);
        return ResponseEntity.ok(detail);
    }

    /**
     * RF07, RF08, RF09 y RF10: Resolución de caso, evaluación en servidor y registro inmutable en base de datos.
     */
    @PostMapping("/{id}/solve")
    public ResponseEntity<SolveCaseResponseDto> solveCase(
            @PathVariable String id,
            @Valid @RequestBody SolveCaseRequestDto request) {
        SolveCaseResponseDto response = evaluationService.evaluateAndSave(id, request);
        return ResponseEntity.ok(response);
    }
}
