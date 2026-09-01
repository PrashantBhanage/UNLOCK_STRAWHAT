package com.edubridge.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AskResponseDto {

    private String answer;
    private boolean matched;
}
