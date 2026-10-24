package com.mediquest.backend.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "question_options")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "question")
@EqualsAndHashCode(exclude = "question")
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 5)
    private String optionKey;       // "A", "B", "C", "D"

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;

    @NotNull
    @Column(nullable = false)
    private Boolean isCorrect;

    @Column(columnDefinition = "TEXT")
    private String clinicalFeedback;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonBackReference
    private Question question;
}
