package com.thxpapa.merci.web;

import com.thxpapa.merci.domain.gis.Spot;
import com.thxpapa.merci.domain.user.User;
import com.thxpapa.merci.service.user.UserService;
import com.thxpapa.merci.service.util.KakaoUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;

@Slf4j
@Controller
public class GisController {

    @Autowired
    private UserService userService;

    @Autowired
    private KakaoUtil kakaoUtil;

    @GetMapping("/gis")
    public String gis(Model model) {
        log.debug("gis controller starts!");

        Map<String, Object> res = kakaoUtil.cvtCoordToAddr("128.6", "36.5");

        List<User> users = userService.getAllUsers();
        List<Spot> spots = users.get(0).getSpots();

        return "gis/gis";
    }
}
