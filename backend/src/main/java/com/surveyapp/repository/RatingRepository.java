package com.surveyapp.repository;

import com.surveyapp.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findBySurveyId(Long surveyId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.survey.id = :surveyId")
    Optional<Double> findAverageScoreBySurveyId(@Param("surveyId") Long surveyId);

    boolean existsBySurveyIdAndUserId(Long surveyId, Long userId);
}
