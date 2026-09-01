package com.edubridge.dto;

import com.edubridge.entity.SlideContent;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SlideResponse {

    private Long id;
    private String subject;
    private String slideNumber;
    private String title;
    private String contentText;

    public static SlideResponse from(SlideContent slide) {
        return SlideResponse.builder()
                .id(slide.getId())
                .subject(slide.getSubject())
                .slideNumber(slide.getSlideNumber())
                .title(slide.getTitle())
                .contentText(slide.getContentText())
                .build();
    }
}
