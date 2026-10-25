package com.mediquest.backend.controller;

import com.mediquest.backend.dto.AttemptHistoryDto;
import com.mediquest.backend.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    /**
     * RF11: Consulta de historial y progreso del estudiante.
     */
    @GetMapping
    public ResponseEntity<List<AttemptHistoryDto>> getStudentHistory(
            @RequestParam(required = false, defaultValue = "student@mediquest.edu") String userEmail) {
        List<AttemptHistoryDto> history = progressService.getStudentHistory(userEmail);
        return ResponseEntity.ok(history);
    }
}
