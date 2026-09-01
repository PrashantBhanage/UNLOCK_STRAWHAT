package com.edubridge.repository;

import com.edubridge.entity.SlideContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SlideContentRepository extends JpaRepository<SlideContent, Long> {

    List<SlideContent> findBySubjectIgnoreCaseOrderBySlideNumberAsc(String subject);
}
