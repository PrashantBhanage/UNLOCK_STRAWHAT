package com.edubridge.service;

import com.edubridge.dto.ScheduleSessionDto;
import com.edubridge.dto.SessionResponse;
import com.edubridge.entity.RequestStatus;
import com.edubridge.entity.Role;
import com.edubridge.entity.Session;
import com.edubridge.entity.SessionStatus;
import com.edubridge.entity.User;
import com.edubridge.repository.RequestRepository;
import com.edubridge.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final RequestRepository requestRepository;
    private final CurrentUserService currentUserService;

    @Transactional
    public SessionResponse scheduleSession(Long sessionId, ScheduleSessionDto dto) {
        User tutor = currentUserService.requireRole(Role.TUTOR);
        Session session = getSessionForTutor(sessionId, tutor);

        if (dto.getScheduledTime() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "scheduledTime is required");
        }

        session.setScheduledTime(dto.getScheduledTime());
        return SessionResponse.from(sessionRepository.save(session));
    }

    @Transactional
    public SessionResponse completeSession(Long sessionId) {
        User tutor = currentUserService.requireRole(Role.TUTOR);
        Session session = getSessionForTutor(sessionId, tutor);

        if (session.getStatus() == SessionStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Session is already completed");
        }

        session.setStatus(SessionStatus.COMPLETED);
        sessionRepository.save(session);

        session.getRequest().setStatus(RequestStatus.COMPLETED);
        requestRepository.save(session.getRequest());

        return SessionResponse.from(session);
    }

    private Session getSessionForTutor(Long sessionId, User tutor) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));

        if (!session.getTutor().getId().equals(tutor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not the tutor for this session");
        }

        return session;
    }
}
