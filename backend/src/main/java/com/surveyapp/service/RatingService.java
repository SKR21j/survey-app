package com.surveyapp.service;

import com.surveyapp.exception.ApiException;
import com.surveyapp.exception.ResourceNotFoundException;
import com.surveyapp.model.Rating;
import com.surveyapp.model.Survey;
import com.surveyapp.model.User;
import com.surveyapp.repository.RatingRepository;
import com.surveyapp.repository.SurveyRepository;
import com.surveyapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingService {

    private final RatingRepository ratingRepository;
    private final SurveyRepository surveyRepository;
    private final UserRepository userRepository;

    @Transactional
    public Rating rateSurvey(Long surveyId, int score, String comment) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new ResourceNotFoundException("Survey", surveyId));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (ratingRepository.existsBySurveyIdAndUserId(surveyId, user.getId())) {
            throw new ApiException(HttpStatus.CONFLICT, "You have already rated this survey");
        }

        Rating rating = new Rating();
        rating.setSurvey(survey);
        rating.setUser(user);
        rating.setScore(score);
        rating.setComment(comment);

        Rating saved = ratingRepository.save(rating);
        log.info("Rating {} submitted for survey {} by {}", score, surveyId, username);
        return saved;
    }

    public double getAverageRating(Long surveyId) {
        if (!surveyRepository.existsById(surveyId)) {
            throw new ResourceNotFoundException("Survey", surveyId);
        }
        return ratingRepository.findAverageScoreBySurveyId(surveyId).orElse(0.0);
    }
}
