package com.mediquest.backend.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "attempts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "clinical_case_id", nullable = false)
    private ClinicalCase clinicalCase;

    @Column(length = 5)
    private String selectedOptionKey;   // "A", "B", "C", "D"

    @NotNull
    @Column(nullable = false)
    private Boolean isCorrect;

    @NotNull
    @Column(nullable = false)
    private Integer scorePercentage;    // 0 - 100

    private Integer timeSpentSeconds;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime completedAt;
}
