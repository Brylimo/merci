package com.thxpapa.merci.web;

import com.thxpapa.merci.domain.gis.Spot;
import com.thxpapa.merci.domain.user.User;
import com.thxpapa.merci.dto.ErrorResponse;
import com.thxpapa.merci.service.user.UserService;
import com.thxpapa.merci.service.util.KakaoUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping(value = "/gis")
public class GisController {
    @Autowired
    private KakaoUtil kakaoUtil;

    @GetMapping("/main")
    public String gis(Model model) {
        log.debug("main controller starts!");

        return "gis/gis";
    }

    @ResponseBody
    @GetMapping("/geo/cvtcoordtoaddr.json")
    public ResponseEntity<Object> cvtCoordToAddr(@RequestParam("lon") String lon, @RequestParam("lat") String lat) {
        log.debug("cvtcoordtoaddr controller starts!");

        try {
            Map<String, Object> res = kakaoUtil.cvtCoordToAddr(lon, lat);

            if (res == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("can't find address"));
            }

            return ResponseEntity.status(HttpStatus.OK).body(res);
        } catch (Exception e) {
            log.debug("cvtcoordtoaddr controller error occurred!");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("server error"));
        }
    }
}
