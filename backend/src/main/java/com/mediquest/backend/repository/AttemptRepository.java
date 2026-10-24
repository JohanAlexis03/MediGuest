package com.mediquest.backend.repository;

import com.mediquest.backend.domain.model.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    List<Attempt> findByUserIdOrderByCompletedAtDesc(Long userId);
    List<Attempt> findByClinicalCaseId(String clinicalCaseId);
}
