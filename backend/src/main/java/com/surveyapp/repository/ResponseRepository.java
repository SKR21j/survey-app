package com.surveyapp.repository;

import com.surveyapp.model.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {
    Page<Response> findBySurveyId(Long surveyId, Pageable pageable);
    long countBySurveyId(Long surveyId);

    @Query("SELECT DISTINCT r FROM Response r LEFT JOIN FETCH r.answers a WHERE r.survey.id = :surveyId")
    List<Response> findBySurveyIdWithAnswers(@Param("surveyId") Long surveyId);
}
