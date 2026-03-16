package com.surveyapp.controller;

import com.surveyapp.dto.ResponseDTO;
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

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Responses", description = "Survey response APIs")
public class ResponseController {

    private final ResponseService responseService;

    @PostMapping("/responses")
    @Operation(summary = "Submit a survey response", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Response> submitResponse(@Valid @RequestBody ResponseDTO dto) {
        Response response = responseService.submitResponse(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/surveys/{id}/responses")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all responses for a survey (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Page<Response>> getSurveyResponses(@PathVariable Long id, Pageable pageable) {
        return ResponseEntity.ok(responseService.getSurveyResponses(id, pageable));
    }
}
