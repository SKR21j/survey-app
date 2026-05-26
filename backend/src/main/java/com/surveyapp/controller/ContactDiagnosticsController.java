package com.surveyapp.controller;

import com.surveyapp.repository.ContactMessageRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@Tag(name = "Contact", description = "Contact form APIs")
public class ContactDiagnosticsController {

    private final ContactMessageRepository contactMessageRepository;

    @GetMapping("/diagnostics")
    @Operation(summary = "Get contact service diagnostics")
    public ResponseEntity<Map<String, Object>> getDiagnostics() {
        Map<String, Object> diagnostics = new HashMap<>();
        diagnostics.put("status", "ok");
        diagnostics.put("service", "contact-messages");
        diagnostics.put("totalMessages", contactMessageRepository.count());
        return ResponseEntity.ok(diagnostics);
    }
}
