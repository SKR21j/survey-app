package com.surveyapp.service;

import com.surveyapp.dto.SurveyDTO;
import com.surveyapp.exception.ApiException;
import com.surveyapp.exception.ResourceNotFoundException;
import com.surveyapp.model.Question;
import com.surveyapp.model.Survey;
import com.surveyapp.model.User;
import com.surveyapp.repository.SurveyRepository;
import com.surveyapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SurveyService {

    private final SurveyRepository surveyRepository;
    private final UserRepository userRepository;

    public Page<Survey> getActiveSurveys(Pageable pageable) {
        return surveyRepository.findByActiveTrue(pageable);
    }

    public Survey getSurveyById(Long id) {
        return surveyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Survey", id));
    }

    @Transactional
    public Survey createSurvey(SurveyDTO dto) {
        User currentUser = getCurrentUser();

        Survey survey = new Survey();
        survey.setTitle(dto.getTitle());
        survey.setDescription(dto.getDescription());
        survey.setActive(dto.isActive());
        survey.setCreatedBy(currentUser);

        if (dto.getQuestions() != null) {
            List<Question> questions = new ArrayList<>();
            for (SurveyDTO.QuestionDTO qDto : dto.getQuestions()) {
                Question question = new Question();
                question.setText(qDto.getText());
                question.setType(parseQuestionType(qDto.getType()));
                question.setRequired(qDto.isRequired());
                question.setDisplayOrder(qDto.getDisplayOrder());
                question.setOptions(qDto.getOptions() != null ? qDto.getOptions() : new ArrayList<>());
                question.setSurvey(survey);
                questions.add(question);
            }
            survey.setQuestions(questions);
        }

        Survey saved = surveyRepository.save(survey);
        log.info("Survey created: {} by {}", saved.getId(), currentUser.getUsername());
        return saved;
    }

    @Transactional
    public Survey updateSurvey(Long id, SurveyDTO dto) {
        Survey survey = getSurveyById(id);
        User currentUser = getCurrentUser();
        validateCanEditSurvey(currentUser, survey);

        survey.setTitle(dto.getTitle());
        survey.setDescription(dto.getDescription());
        survey.setActive(dto.isActive());

        if (dto.getQuestions() != null) {
            survey.getQuestions().clear();
            for (SurveyDTO.QuestionDTO qDto : dto.getQuestions()) {
                Question question = new Question();
                question.setText(qDto.getText());
                question.setType(parseQuestionType(qDto.getType()));
                question.setRequired(qDto.isRequired());
                question.setDisplayOrder(qDto.getDisplayOrder());
                question.setOptions(qDto.getOptions() != null ? qDto.getOptions() : new ArrayList<>());
                question.setSurvey(survey);
                survey.getQuestions().add(question);
            }
        }

        return surveyRepository.save(survey);
    }

    @Transactional
    public void deleteSurvey(Long id) {
        Survey survey = getSurveyById(id);
        surveyRepository.delete(survey);
        log.info("Survey deleted: {}", id);
    }

    private Question.QuestionType parseQuestionType(String type) {
        if (type == null || type.isBlank()) {
            return Question.QuestionType.TEXT;
        }
        try {
            return Question.QuestionType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new com.surveyapp.exception.ApiException(
                    org.springframework.http.HttpStatus.BAD_REQUEST,
                    "Invalid question type: " + type
            );
        }
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateCanEditSurvey(User user, Survey survey) {
        boolean isAdmin = user.getRole() == User.Role.ADMIN;
        boolean isOwner = survey.getCreatedBy() != null
                && survey.getCreatedBy().getId() != null
                && survey.getCreatedBy().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only edit surveys that you created");
        }
    }
}
