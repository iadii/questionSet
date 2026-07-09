package com.walmartprep.repository;

import com.walmartprep.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
    Page<Question> findByCategory(com.walmartprep.enums.Category category, Pageable pageable);
    Page<Question> findByTopic(String topic, Pageable pageable);
    Page<Question> findByCategoryAndTopic(com.walmartprep.enums.Category category, String topic, Pageable pageable);
}
