package com.thxpapa.merci.web;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/score")
public class ScoreController {

    @GetMapping("/calendar")
    public String main(Model model) {
        List<String> week = new ArrayList<>(
                Arrays.asList("Sun", "Mon", "Thu", "Wed", "Thurs", "Fri", "Sat")
        );

        model.addAttribute("week", week);

        return "score/calendar";
    }
}
