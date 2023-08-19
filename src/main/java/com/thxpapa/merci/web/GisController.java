package com.thxpapa.merci.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@Controller
public class GisController {

    @Value("${gis.akey}")
    private String gisAKey;

    @GetMapping("/gis")
    public String gis(Model model) {
        log.debug("gis");
        model.addAttribute("aKey", gisAKey);
        return "gis/gis";
    }
}
