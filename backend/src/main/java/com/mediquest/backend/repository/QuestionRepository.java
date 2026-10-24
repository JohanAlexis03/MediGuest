package com.mediquest.backend.repository;

import com.mediquest.backend.domain.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByClinicalCaseId(String clinicalCaseId);
}
