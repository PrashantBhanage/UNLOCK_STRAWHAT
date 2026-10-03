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
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }

        String name = request.getName() == null ? "" : request.getName().trim();
        String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        String password = request.getPassword() == null ? "" : request.getPassword();

        if (name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid email is required");
        }
        if (password.length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters");
        }
        if (request.getRole() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is required (STUDENT or TUTOR)");
        }

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
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

        return new AuthResponse(jwtUtil.generateToken(user.getEmail()), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }

        String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
        String password = request.getPassword() == null ? "" : request.getPassword();

        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid email is required");
        }
        if (password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        return new AuthResponse(jwtUtil.generateToken(user.getEmail()), user.getRole());
    }
}
