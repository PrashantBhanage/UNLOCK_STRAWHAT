package com.edubridge.controller;

import com.edubridge.dto.LightweightTutorDto;
import com.edubridge.dto.SubjectResourceResponse;
import com.edubridge.service.TutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tutors")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;

    @GetMapping("/lightweight")
    public ResponseEntity<List<LightweightTutorDto>> getLightweightTutors() {
        return ResponseEntity.ok(tutorService.getLightweightTutors());
    }

    @GetMapping("/resource/{subject}")
    public ResponseEntity<SubjectResourceResponse> getSubjectResource(@PathVariable String subject) {
        return ResponseEntity.ok(tutorService.getResourceForSubject(subject));
    }
}
