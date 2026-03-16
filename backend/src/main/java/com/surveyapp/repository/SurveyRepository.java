package com.surveyapp.repository;

import com.surveyapp.model.Survey;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    Page<Survey> findByActiveTrue(Pageable pageable);
    Page<Survey> findByCreatedById(Long userId, Pageable pageable);
}
