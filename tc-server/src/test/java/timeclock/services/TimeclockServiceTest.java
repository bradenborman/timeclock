package timeclock.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.Month;

@SpringBootTest
@ActiveProfiles({"local", "secret"})
class TimeclockServiceTest {


    @Autowired
    TimeclockService timeclockService;

    @Test
    void sendDailySummaryEmailTest() {
        LocalDate localDate = LocalDate.of(2025, Month.FEBRUARY, 6);
        timeclockService.sendDailySummaryEmail(localDate);
    }

}