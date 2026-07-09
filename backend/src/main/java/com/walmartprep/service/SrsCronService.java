package com.walmartprep.service;

import com.walmartprep.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SrsCronService {

    private final UserProgressRepository userProgressRepository;

    /**
     * Runs every day at midnight to mark due SRS questions as REVISION_NEEDED.
     * We use a fixed delay for testing, but in production, this should be a cron job like "0 0 0 * * *".
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void markDueRevisions() {
        log.info("Running daily SRS job to check for due revisions...");
        int updatedCount = userProgressRepository.markDueRevisions();
        log.info("Marked {} questions as REVISION_NEEDED", updatedCount);
    }
}
