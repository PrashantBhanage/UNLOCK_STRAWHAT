package com.edubridge.controller;

import com.edubridge.dto.AskRequestDto;
import com.edubridge.dto.AskResponseDto;
import com.edubridge.dto.FaqResponse;
import com.edubridge.dto.SlideResponse;
import com.edubridge.service.AiAssistantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    @GetMapping("/slides/{subject}")
    public ResponseEntity<List<SlideResponse>> getSlides(@PathVariable String subject) {
        return ResponseEntity.ok(aiAssistantService.getSlidesForSubject(subject));
    }

    @GetMapping("/faq/{subject}")
    public ResponseEntity<List<FaqResponse>> getFaq(@PathVariable String subject) {
        return ResponseEntity.ok(aiAssistantService.getFaqForSubject(subject));
    }

    @PostMapping("/ask")
    public ResponseEntity<AskResponseDto> ask(@RequestBody AskRequestDto request) {
        return ResponseEntity.ok(aiAssistantService.ask(request.getQuestion(), request.getSubject()));
    }
}
