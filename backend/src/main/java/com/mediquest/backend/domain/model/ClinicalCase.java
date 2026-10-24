package com.mediquest.backend.domain.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mediquest.backend.domain.enums.Difficulty;
import com.mediquest.backend.domain.enums.Specialty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clinical_cases")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "questions")
@EqualsAndHashCode(exclude = "questions")
public class ClinicalCase {

    @Id
    @Column(length = 60, nullable = false)
    private String id;              // Ej: "caso-1", "caso-asma", "caso-trauma-pelvis"

    @NotBlank
    @Column(nullable = false, length = 200)
    private String title;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Specialty specialty;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    private Difficulty difficulty;

    @Column(columnDefinition = "TEXT")
    private String dispatchContext; // Contexto de despacho / llamada al SVA

    @Column(columnDefinition = "TEXT")
    private String scene;           // Descripción de la escena prehospitalaria

    @Column(columnDefinition = "TEXT")
    private String kinematicsOrOnset; // Cinemática del trauma o inicio de los síntomas

    @Column(length = 255)
    private String protocolReference; // Ej: "PHTLS 9na Edición, Cap. 7"

    @Embedded
    private PatientInfo patient;

    @Embedded
    private VitalSigns vitals;

    @Embedded
    private PrimarySurvey primarySurvey;

    @Embedded
    private SampleHistory sampleHistory;

    @Embedded
    private ClinicalMedia media;

    @OneToMany(mappedBy = "clinicalCase", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
