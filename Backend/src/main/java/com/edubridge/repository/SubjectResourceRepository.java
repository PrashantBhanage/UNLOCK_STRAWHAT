package com.edubridge.repository;

import com.edubridge.entity.SubjectResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubjectResourceRepository extends JpaRepository<SubjectResource, Long> {

    Optional<SubjectResource> findBySubjectIgnoreCase(String subject);
}
