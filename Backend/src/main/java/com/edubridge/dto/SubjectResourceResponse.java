package com.edubridge.dto;

import com.edubridge.entity.SubjectResource;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class SubjectResourceResponse {

    String subject;
    String resourceUrl;
    String resourceLabel;

    public static SubjectResourceResponse from(SubjectResource resource) {
        return SubjectResourceResponse.builder()
                .subject(resource.getSubject())
                .resourceUrl(resource.getResourceUrl())
                .resourceLabel(resource.getResourceLabel())
                .build();
    }
}
