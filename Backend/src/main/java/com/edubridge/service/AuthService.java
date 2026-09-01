package com.edubridge.service;

import com.edubridge.config.JwtUtil;
import com.edubridge.dto.AuthResponse;
import com.edubridge.dto.LoginRequest;
import com.edubridge.dto.SignupRequest;
import com.edubridge.entity.Role;
import com.edubridge.entity.TutorProfile;
import com.edubridge.entity.User;
import com.edubridge.repository.TutorProfileRepository;
import com.edubridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TutorProfileRepository tutorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse signup(SignupRequest request) {
        if (request.getRole() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is required (STUDENT or TUTOR)");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        user = userRepository.save(user);

        if (request.getRole() == Role.TUTOR) {
            tutorProfileRepository.save(TutorProfile.builder()
                    .user(user)
                    .subjects("")
                    .skills("")
                    .build());
        }

        return new AuthResponse(jwtUtil.generateToken(user.getEmail()));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        return new AuthResponse(jwtUtil.generateToken(request.getEmail()));
    }
}
