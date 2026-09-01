package com.edubridge.controller;

import com.edubridge.dto.ScheduleSessionDto;
import com.edubridge.dto.SessionResponse;
import com.edubridge.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PutMapping("/{id}/schedule")
    public ResponseEntity<SessionResponse> scheduleSession(
            @PathVariable Long id,
            @RequestBody ScheduleSessionDto dto) {
        return ResponseEntity.ok(sessionService.scheduleSession(id, dto));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<SessionResponse> completeSession(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.completeSession(id));
    }
}
