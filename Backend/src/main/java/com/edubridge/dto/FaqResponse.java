package com.edubridge.dto;

import com.edubridge.entity.FaqKnowledgeBase;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FaqResponse {

    private Long id;
    private String subject;
    private String question;
    private String answer;
    private String keywords;

    public static FaqResponse from(FaqKnowledgeBase faq) {
        return FaqResponse.builder()
                .id(faq.getId())
                .subject(faq.getSubject())
                .question(faq.getQuestion())
                .answer(faq.getAnswer())
                .keywords(faq.getKeywords())
                .build();
    }
}
