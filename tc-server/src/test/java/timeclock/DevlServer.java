package timeclock;

import org.springframework.boot.builder.SpringApplicationBuilder;

public class DevlServer extends TimeclockApplication {

    public static void main(String[] args) {
        new DevlServer().configure(new SpringApplicationBuilder())
                .initializers()
                .profiles("local")
                .run(args);
    }

}