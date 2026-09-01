package com.edubridge.dto;

import com.edubridge.entity.Request;
import com.edubridge.entity.RequestStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RequestResponse {

    private Long id;
    private Long studentId;
    private String studentName;
    private String subject;
    private String description;
    private RequestStatus status;
    private LocalDateTime createdAt;

    public static RequestResponse from(Request request) {
        return RequestResponse.builder()
                .id(request.getId())
                .studentId(request.getStudent().getId())
                .studentName(request.getStudent().getName())
                .subject(request.getSubject())
                .description(request.getDescription())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .build();
    }
}
