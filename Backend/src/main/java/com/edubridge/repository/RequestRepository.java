package com.edubridge.repository;

import com.edubridge.entity.Request;
import com.edubridge.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {

    List<Request> findByStatusAndSubjectIgnoreCaseIn(RequestStatus status, Collection<String> subjects);
}
