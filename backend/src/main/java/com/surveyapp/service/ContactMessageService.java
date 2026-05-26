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
        log.info("Saving contact message from: {} ({})", dto.getName(), dto.getEmail());
        
        ContactMessage message = new ContactMessage();
        message.setName(dto.getName());
        message.setEmail(dto.getEmail());
        message.setSubject(dto.getSubject());
        message.setMessage(dto.getMessage());
        
        ContactMessage saved = contactMessageRepository.save(message);
        log.info("Contact message saved with ID: {}", saved.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public Page<ContactMessage> getAllMessages(Pageable pageable) {
        log.info("Fetching all messages with pagination: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<ContactMessage> messages = contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable);
        log.info("Found {} messages", messages.getTotalElements());
        return messages;
    }

    @Transactional
    public void markAsRead(Long messageId) {
        log.info("Marking message as read: {}", messageId);
        contactMessageRepository.findById(messageId).ifPresentOrElse(
            message -> {
                message.setRead(true);
                contactMessageRepository.save(message);
                log.info("Message marked as read successfully: {}", messageId);
            },
            () -> log.warn("Message not found: {}", messageId)
        );
    }

    @Transactional
    public void deleteMessage(Long messageId) {
        log.info("Deleting message: {}", messageId);
        if (!contactMessageRepository.existsById(messageId)) {
            log.warn("Message not found for deletion: {}", messageId);
            return;
        }

        contactMessageRepository.deleteById(messageId);
        log.info("Message deleted successfully: {}", messageId);
    }
}
