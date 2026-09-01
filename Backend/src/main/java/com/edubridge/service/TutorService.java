package com.edubridge.service;

import com.edubridge.dto.LightweightTutorDto;
import com.edubridge.dto.SubjectResourceResponse;
import com.edubridge.entity.TutorProfile;
import com.edubridge.repository.SubjectResourceRepository;
import com.edubridge.repository.TutorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TutorService {

    private final TutorProfileRepository tutorProfileRepository;
    private final SubjectResourceRepository subjectResourceRepository;

    @Transactional(readOnly = true)
    public List<LightweightTutorDto> getLightweightTutors() {
        return tutorProfileRepository.findAll().stream()
                .flatMap(profile -> parseSubjects(profile).stream()
                        .map(subject -> new LightweightTutorDto(
                                profile.getUser().getId(),
                                profile.getUser().getName(),
                                subject)))
                .toList();
    }

    @Transactional(readOnly = true)
    public SubjectResourceResponse getResourceForSubject(String subject) {
        return subjectResourceRepository.findBySubjectIgnoreCase(subject)
                .map(SubjectResourceResponse::from)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No resource found for subject: " + subject));
    }

    private List<String> parseSubjects(TutorProfile profile) {
        String subjects = profile.getSubjects();
        if (subjects == null || subjects.isBlank()) {
            return List.of();
        }
        return Arrays.stream(subjects.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}
