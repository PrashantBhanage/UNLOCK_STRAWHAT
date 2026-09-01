package com.edubridge.repository;

import com.edubridge.entity.TutorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TutorProfileRepository extends JpaRepository<TutorProfile, Long> {

    Optional<TutorProfile> findByUser_Id(Long userId);
}
