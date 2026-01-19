package timeclock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@EnableScheduling
@SpringBootApplication
public class TimeclockApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		// Set default timezone to Central Time for the entire JVM
		TimeZone.setDefault(TimeZone.getTimeZone("America/Chicago"));
		SpringApplication.run(TimeclockApplication.class, args);
	}


	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(TimeclockApplication.class);
	}


}
