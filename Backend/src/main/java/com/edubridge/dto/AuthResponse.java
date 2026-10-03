package com.edubridge.dto;

import com.edubridge.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private Role role;
}
