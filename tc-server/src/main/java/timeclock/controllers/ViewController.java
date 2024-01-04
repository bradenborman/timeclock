package timeclock.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping(value={"/", "/start-shift", "/note", "/admin"})
    public String index() {
        return "index";
    }

}
