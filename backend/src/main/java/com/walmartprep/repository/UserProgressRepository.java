package com.walmartprep.repository;

import com.walmartprep.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {
    Optional<UserProgress> findByUserIdAndQuestionId(UUID userId, UUID questionId);
    List<UserProgress> findByUserId(UUID userId);
    List<UserProgress> findByUserIdAndNextRevisionDateLessThanEqual(UUID userId, LocalDate date);
}
