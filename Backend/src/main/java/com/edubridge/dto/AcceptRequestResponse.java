package com.edubridge.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AcceptRequestResponse {

    private RequestResponse request;
    private SessionResponse session;
}
