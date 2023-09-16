package com.thxpapa.merci.web;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/geo")
public class GeoController {

    @GetMapping("/map")
    public String map(Model model) {
        log.debug("map starts!");
        return "geo/map";
    }
}
