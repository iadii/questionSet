package com.walmartprep.repository;

import com.walmartprep.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import jakarta.transaction.Transactional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {
    Optional<UserProgress> findByUserIdAndQuestionId(UUID userId, UUID questionId);
    List<UserProgress> findByUserId(UUID userId);

    @Modifying
    @Transactional
    @Query("UPDATE UserProgress p SET p.status = 'REVISION_NEEDED' WHERE p.nextRevisionDate <= CURRENT_DATE AND p.status = 'SOLVED'")
    int markDueRevisions();
}
