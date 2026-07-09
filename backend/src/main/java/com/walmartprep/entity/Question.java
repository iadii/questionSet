package com.walmartprep.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import com.walmartprep.enums.Difficulty;
import com.walmartprep.enums.Category;

import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(nullable = false)
    private String topic;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    private Integer frequency = 0;

    @Column(name = "leetcode_url")
    private String leetcodeUrl;

    @Column(name = "article_url")
    private String articleUrl;

    @Column(name = "video_url")
    private String videoUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "company_tags", columnDefinition = "jsonb")
    private List<String> companyTags;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> hints;
}
