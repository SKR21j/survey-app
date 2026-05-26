package com.surveyapp.dto;

import com.surveyapp.model.ContactMessage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessageResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private Boolean read;
    private LocalDateTime createdAt;

    public static ContactMessageResponseDTO from(ContactMessage message) {
        return new ContactMessageResponseDTO(
            message.getId(),
            message.getName(),
            message.getEmail(),
            message.getSubject(),
            message.getMessage(),
            message.getRead(),
            message.getCreatedAt()
        );
    }
}
