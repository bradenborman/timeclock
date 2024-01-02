package timeclock.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;
import timeclock.services.EmailService;

@Configuration
public class CronConfig {

    private EmailService emailService;

    public CronConfig(EmailService emailService) {
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 36 23 * * ?") //11:30 PM
    public void sendReport() {
        emailService.sendWorksheetEmailTest();
    }

}