package com.edubridge.dto;

import com.edubridge.entity.Session;
import com.edubridge.entity.SessionStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SessionResponse {

    private Long id;
    private Long requestId;
    private Long tutorId;
    private String tutorName;
    private LocalDateTime scheduledTime;
    private SessionStatus status;

    public static SessionResponse from(Session session) {
        return SessionResponse.builder()
                .id(session.getId())
                .requestId(session.getRequest().getId())
                .tutorId(session.getTutor().getId())
                .tutorName(session.getTutor().getName())
                .scheduledTime(session.getScheduledTime())
                .status(session.getStatus())
                .build();
    }
}
