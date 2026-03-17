package com.surveyapp.controller;

import com.surveyapp.dto.ResponseDTO;
import com.surveyapp.dto.ResponseStatsDTO;
import com.surveyapp.model.Response;
import com.surveyapp.service.ResponseService;
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

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Responses", description = "Survey response APIs")
public class ResponseController {

    private final ResponseService responseService;

    @PostMapping("/responses")
    @Operation(summary = "Submit a survey response")
    public ResponseEntity<Response> submitResponse(@Valid @RequestBody ResponseDTO dto) {
        Response response = responseService.submitResponse(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/surveys/{id}/responses")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all responses for a survey", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Page<Response>> getSurveyResponses(@PathVariable Long id, Pageable pageable) {
        return ResponseEntity.ok(responseService.getSurveyResponses(id, pageable));
    }

    @GetMapping("/responses/survey/{surveyId}/stats")
    @Operation(summary = "Get response statistics for a survey")
    public ResponseEntity<List<ResponseStatsDTO>> getResponseStats(@PathVariable Long surveyId) {
        List<ResponseStatsDTO> stats = responseService.getResponseStats(surveyId);
        return ResponseEntity.ok(stats);
    }
}
