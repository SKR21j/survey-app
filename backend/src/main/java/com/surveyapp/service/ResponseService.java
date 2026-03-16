package com.surveyapp.service;

import com.surveyapp.dto.ResponseDTO;
import com.surveyapp.exception.ResourceNotFoundException;
import com.surveyapp.model.Answer;
import com.surveyapp.model.Question;
import com.surveyapp.model.Response;
import com.surveyapp.model.Survey;
import com.surveyapp.model.User;
import com.surveyapp.repository.ResponseRepository;
import com.surveyapp.repository.SurveyRepository;
import com.surveyapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResponseService {

    private static final String ANONYMOUS_USER = "anonymousUser";

    private final ResponseRepository responseRepository;
    private final SurveyRepository surveyRepository;
    private final UserRepository userRepository;

    @Transactional
    public Response submitResponse(ResponseDTO dto) {
        Survey survey = surveyRepository.findById(dto.getSurveyId())
                .orElseThrow(() -> new ResourceNotFoundException("Survey", dto.getSurveyId()));

        Response response = new Response();
        response.setSurvey(survey);

        String username = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : null;

        if (username != null && !username.equals(ANONYMOUS_USER)) {
            userRepository.findByUsername(username).ifPresent(response::setUser);
        }

        if (dto.getAnswers() != null) {
            List<Answer> answers = new ArrayList<>();
            for (ResponseDTO.AnswerDTO aDto : dto.getAnswers()) {
                Question question = survey.getQuestions().stream()
                        .filter(q -> q.getId().equals(aDto.getQuestionId()))
                        .findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("Question", aDto.getQuestionId()));

                Answer answer = new Answer();
                answer.setResponse(response);
                answer.setQuestion(question);
                answer.setValue(aDto.getValue());
                answers.add(answer);
            }
            response.setAnswers(answers);
        }

        Response saved = responseRepository.save(response);
        log.info("Response submitted for survey: {}", survey.getId());
        return saved;
    }

    public Page<Response> getSurveyResponses(Long surveyId, Pageable pageable) {
        if (!surveyRepository.existsById(surveyId)) {
            throw new ResourceNotFoundException("Survey", surveyId);
        }
        return responseRepository.findBySurveyId(surveyId, pageable);
    }
}
