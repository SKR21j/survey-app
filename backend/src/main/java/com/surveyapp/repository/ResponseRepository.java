package com.surveyapp.repository;

import com.surveyapp.model.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {
    Page<Response> findBySurveyId(Long surveyId, Pageable pageable);
    long countBySurveyId(Long surveyId);
}
