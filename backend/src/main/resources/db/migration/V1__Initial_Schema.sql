-- V1__Initial_Schema.sql

-- Enable UUID extension if not already enabled (Requires superuser, often enabled by default in modern Postgres or on RDS)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    target_company VARCHAR(100) DEFAULT 'Walmart',
    current_streak INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions (DSA & System Design)
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL, -- Easy, Medium, Hard
    topic VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- DSA, LLD, HLD, CS_FUNDAMENTALS
    is_walmart_previous BOOLEAN DEFAULT FALSE,
    frequency INT DEFAULT 0,
    leetcode_url VARCHAR(500),
    article_url VARCHAR(500),
    video_url VARCHAR(500),
    company_tags JSONB,
    hints JSONB
);

-- Code Submissions
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    language VARCHAR(50) NOT NULL,
    code TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- Passed, Failed, Compilation Error
    runtime_ms INT,
    memory_kb INT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Progress & Revision
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    status VARCHAR(50), -- Not Started, Attempted, Solved, Revision Needed
    next_revision_date DATE, -- Spaced repetition tracking
    UNIQUE(user_id, question_id)
);
