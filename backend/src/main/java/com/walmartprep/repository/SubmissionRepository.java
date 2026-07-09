package com.walmartprep.repository;

import com.walmartprep.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    List<Submission> findByUserIdAndQuestionIdOrderBySubmittedAtDesc(UUID userId, UUID questionId);
    
    @Query(value = "SELECT CAST(submitted_at AS DATE) as sub_date, COUNT(*) as cnt FROM submissions WHERE user_id = :userId GROUP BY CAST(submitted_at AS DATE)", nativeQuery = true)
    List<Object[]> countSubmissionsByDate(@Param("userId") UUID userId);
}
