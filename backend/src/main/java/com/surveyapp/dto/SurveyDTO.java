package com.surveyapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class SurveyDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private boolean active;

    private Long createdById;

    private String createdByUsername;

    private List<QuestionDTO> questions;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Data
    public static class QuestionDTO {
        private Long id;

        @NotBlank(message = "Question text is required")
        private String text;

        private String type;

        private boolean required;

        private int displayOrder;

        private List<String> options;
    }
}
