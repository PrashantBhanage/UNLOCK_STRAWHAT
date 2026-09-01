package com.edubridge.repository;

import com.edubridge.entity.FaqKnowledgeBase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FaqRepository extends JpaRepository<FaqKnowledgeBase, Long> {

    List<FaqKnowledgeBase> findBySubjectIgnoreCase(String subject);
}
