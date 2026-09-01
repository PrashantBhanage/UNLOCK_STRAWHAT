package com.edubridge.repository;

import com.edubridge.entity.Session;
import com.edubridge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {

    Optional<Session> findByRequest_Id(Long requestId);

    List<Session> findByTutorOrderByScheduledTimeDesc(User tutor);
}
