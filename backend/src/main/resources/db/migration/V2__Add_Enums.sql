-- V2__Add_Enums.sql

-- Add role to users
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'ROLE_USER' NOT NULL;

-- Remove the hardcoded boolean in favor of companyTags
ALTER TABLE questions DROP COLUMN is_walmart_previous;

-- Ensure existing string values match the new Enums (uppercase and replace spaces with underscores)
UPDATE questions SET difficulty = UPPER(difficulty);
UPDATE questions SET category = UPPER(category);
UPDATE user_progress SET status = REPLACE(UPPER(status), ' ', '_');
