package com.surveyapp.controller;

import com.surveyapp.dto.SurveyDTO;
import com.surveyapp.model.Survey;
import com.surveyapp.service.SurveyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/surveys")
@RequiredArgsConstructor
@Tag(name = "Surveys", description = "Survey management APIs")
public class SurveyController {

    private final SurveyService surveyService;

    @GetMapping
    @Operation(summary = "Get all active surveys")
    public ResponseEntity<Page<Survey>> getSurveys(Pageable pageable) {
        return ResponseEntity.ok(surveyService.getActiveSurveys(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get survey by ID")
    public ResponseEntity<Survey> getSurveyById(@PathVariable Long id) {
        return ResponseEntity.ok(surveyService.getSurveyById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new survey (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Survey> createSurvey(@Valid @RequestBody SurveyDTO dto) {
        Survey survey = surveyService.createSurvey(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(survey);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a survey (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Survey> updateSurvey(@PathVariable Long id, @Valid @RequestBody SurveyDTO dto) {
        return ResponseEntity.ok(surveyService.updateSurvey(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a survey (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> deleteSurvey(@PathVariable Long id) {
        surveyService.deleteSurvey(id);
        return ResponseEntity.noContent().build();
    }
}
