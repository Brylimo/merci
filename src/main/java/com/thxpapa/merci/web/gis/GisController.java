package com.thxpapa.merci.web.gis;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@Controller
public class GisController {

    @GetMapping("/gis")
    public String gis() {
        log.debug("gis");
        return "gis/gis";
    }
}
