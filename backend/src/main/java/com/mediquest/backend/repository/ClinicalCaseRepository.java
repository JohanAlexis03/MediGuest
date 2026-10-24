package com.mediquest.backend.repository;

import com.mediquest.backend.domain.enums.Specialty;
import com.mediquest.backend.domain.model.ClinicalCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicalCaseRepository extends JpaRepository<ClinicalCase, String> {
    Page<ClinicalCase> findBySpecialty(Specialty specialty, Pageable pageable);
    List<ClinicalCase> findBySpecialty(Specialty specialty);
}
