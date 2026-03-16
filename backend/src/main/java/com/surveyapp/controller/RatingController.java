package com.surveyapp.controller;

import com.surveyapp.model.Rating;
import com.surveyapp.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/surveys/{id}")
@RequiredArgsConstructor
@Tag(name = "Ratings", description = "Survey rating APIs")
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/ratings")
    @Operation(summary = "Rate a survey", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Rating> rateSurvey(
            @PathVariable Long id,
            @RequestParam @Min(1) @Max(5) int score,
            @RequestParam(required = false) String comment) {
        Rating rating = ratingService.rateSurvey(id, score, comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(rating);
    }

    @GetMapping("/average-rating")
    @Operation(summary = "Get average rating for a survey")
    public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Long id) {
        double avg = ratingService.getAverageRating(id);
        return ResponseEntity.ok(Map.of("surveyId", id, "averageRating", avg));
    }
}
