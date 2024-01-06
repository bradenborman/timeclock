package timeclock.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;
import timeclock.services.TimeclockService;

@Configuration
public class CronConfig {

    private final TimeclockService timeclockService;

    public CronConfig(TimeclockService timeclockService) {
        this.timeclockService = timeclockService;
    }

    @Scheduled(cron = "0 30 23 * * ?") //11:30 PM
    public void sendReport() {
        timeclockService.sendDailySummaryEmail();
    }

}