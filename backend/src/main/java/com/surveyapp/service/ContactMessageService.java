package com.surveyapp.service;

import com.surveyapp.dto.ContactMessageDTO;
import com.surveyapp.model.ContactMessage;
import com.surveyapp.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    @Transactional
    public ContactMessage saveMessage(ContactMessageDTO dto) {
        ContactMessage message = new ContactMessage();
        message.setName(dto.getName());
        message.setEmail(dto.getEmail());
        message.setSubject(dto.getSubject());
        message.setMessage(dto.getMessage());
        
        ContactMessage saved = contactMessageRepository.save(message);
        log.info("Contact message saved: {}", saved.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public Page<ContactMessage> getAllMessages(Pageable pageable) {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional
    public void markAsRead(Long messageId) {
        contactMessageRepository.findById(messageId).ifPresent(message -> {
            message.setRead(true);
            contactMessageRepository.save(message);
            log.info("Message marked as read: {}", messageId);
        });
    }
}
