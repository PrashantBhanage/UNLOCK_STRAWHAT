package com.edubridge.controller;

import com.edubridge.dto.AcceptRequestResponse;
import com.edubridge.dto.CreateRequestDto;
import com.edubridge.dto.RequestResponse;
import com.edubridge.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;

    @PostMapping
    public ResponseEntity<RequestResponse> createRequest(@RequestBody CreateRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(requestService.createRequest(dto));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<RequestResponse>> getPendingRequests() {
        return ResponseEntity.ok(requestService.getPendingRequestsForTutor());
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<AcceptRequestResponse> acceptRequest(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.acceptRequest(id));
    }
}
