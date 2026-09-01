package com.edubridge.service;

import com.edubridge.dto.LightweightTutorDto;
import com.edubridge.entity.TutorProfile;
import com.edubridge.repository.TutorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TutorService {

    private final TutorProfileRepository tutorProfileRepository;

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
