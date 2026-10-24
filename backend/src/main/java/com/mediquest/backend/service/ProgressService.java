package com.mediquest.backend.service;

import com.mediquest.backend.domain.model.Attempt;
import com.mediquest.backend.domain.model.User;
import com.mediquest.backend.dto.AttemptHistoryDto;
import com.mediquest.backend.repository.AttemptRepository;
import com.mediquest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final AttemptRepository attemptRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AttemptHistoryDto> getStudentHistory(String userEmail) {
        String email = (userEmail != null && !userEmail.isBlank()) ? userEmail : "student@mediquest.edu";
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return Collections.emptyList();
        }

        List<Attempt> attempts = attemptRepository.findByUserIdOrderByCompletedAtDesc(user.getId());

        return attempts.stream()
                .map(a -> AttemptHistoryDto.builder()
                        .attemptId(a.getId())
                        .caseId(a.getClinicalCase().getId())
                        .caseTitle(a.getClinicalCase().getTitle())
                        .specialty(a.getClinicalCase().getSpecialty())
                        .difficulty(a.getClinicalCase().getDifficulty())
                        .selectedOptionKey(a.getSelectedOptionKey())
                        .isCorrect(a.getIsCorrect())
                        .scorePercentage(a.getScorePercentage())
                        .timeSpentSeconds(a.getTimeSpentSeconds())
                        .completedAt(a.getCompletedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
