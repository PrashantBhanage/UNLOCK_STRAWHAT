package com.edubridge.service;

import com.edubridge.dto.AcceptRequestResponse;
import com.edubridge.dto.CreateRequestDto;
import com.edubridge.dto.RequestResponse;
import com.edubridge.dto.SessionResponse;
import com.edubridge.entity.Request;
import com.edubridge.entity.RequestStatus;
import com.edubridge.entity.Role;
import com.edubridge.entity.Session;
import com.edubridge.entity.SessionStatus;
import com.edubridge.entity.TutorProfile;
import com.edubridge.entity.User;
import com.edubridge.repository.RequestRepository;
import com.edubridge.repository.SessionRepository;
import com.edubridge.repository.TutorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository requestRepository;
    private final SessionRepository sessionRepository;
    private final TutorProfileRepository tutorProfileRepository;
    private final CurrentUserService currentUserService;

    @Transactional
    public RequestResponse createRequest(CreateRequestDto dto) {
        User student = currentUserService.requireRole(Role.STUDENT);

        Request request = Request.builder()
                .student(student)
                .subject(dto.getSubject())
                .description(dto.getDescription())
                .status(RequestStatus.PENDING)
                .build();

        return RequestResponse.from(requestRepository.save(request));
    }

    @Transactional(readOnly = true)
    public List<RequestResponse> getPendingRequestsForTutor() {
        User tutor = currentUserService.requireRole(Role.TUTOR);

        TutorProfile profile = tutorProfileRepository.findByUser_Id(tutor.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tutor profile not found"));

        List<String> subjects = parseSubjects(profile.getSubjects());
        if (subjects.isEmpty()) {
            return List.of();
        }

        return requestRepository.findByStatusAndSubjectIgnoreCaseIn(RequestStatus.PENDING, subjects)
                .stream()
                .map(RequestResponse::from)
                .toList();
    }

    @Transactional
    public AcceptRequestResponse acceptRequest(Long requestId) {
        User tutor = currentUserService.requireRole(Role.TUTOR);

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request is not pending");
        }

        TutorProfile profile = tutorProfileRepository.findByUser_Id(tutor.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tutor profile not found"));

        if (!tutorTeachesSubject(profile, request.getSubject())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not teach this subject");
        }

        if (sessionRepository.findByRequest_Id(requestId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Request already has a session");
        }

        request.setStatus(RequestStatus.MATCHED);
        requestRepository.save(request);

        Session session = Session.builder()
                .request(request)
                .tutor(tutor)
                .status(SessionStatus.PENDING)
                .build();
        session = sessionRepository.save(session);

        return new AcceptRequestResponse(RequestResponse.from(request), SessionResponse.from(session));
    }

    private List<String> parseSubjects(String subjectsCsv) {
        if (subjectsCsv == null || subjectsCsv.isBlank()) {
            return List.of();
        }
        return Arrays.stream(subjectsCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> s.toLowerCase(Locale.ROOT))
                .toList();
    }

    private boolean tutorTeachesSubject(TutorProfile profile, String subject) {
        return parseSubjects(profile.getSubjects()).contains(subject.trim().toLowerCase(Locale.ROOT));
    }
}
