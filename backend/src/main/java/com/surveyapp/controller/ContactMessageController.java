package com.surveyapp.controller;

import com.surveyapp.dto.ContactMessageDTO;
import com.surveyapp.dto.ContactMessageResponseDTO;
import com.surveyapp.model.ContactMessage;
import com.surveyapp.service.ContactMessageService;
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
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@Tag(name = "Contact", description = "Contact form APIs")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    @PostMapping("/messages")
    @Operation(summary = "Submit a contact message")
    public ResponseEntity<ContactMessageResponseDTO> submitMessage(@Valid @RequestBody ContactMessageDTO dto) {
        ContactMessage message = contactMessageService.saveMessage(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ContactMessageResponseDTO.from(message));
    }

    @GetMapping("/messages")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all contact messages (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Page<ContactMessageResponseDTO>> getAllMessages(Pageable pageable) {
        Page<ContactMessage> messages = contactMessageService.getAllMessages(pageable);
        Page<ContactMessageResponseDTO> responseDTOs = messages.map(ContactMessageResponseDTO::from);
        return ResponseEntity.ok(responseDTOs);
    }

    @PutMapping("/messages/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mark a message as read (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        contactMessageService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/messages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a message (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        contactMessageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
