package com.edubridge.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ScheduleSessionDto {

    private LocalDateTime scheduledTime;
}
