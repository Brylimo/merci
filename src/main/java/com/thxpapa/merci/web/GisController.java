package com.thxpapa.merci.web;

import com.thxpapa.merci.dto.ErrorResponse;
import com.thxpapa.merci.util.KakaoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/gis")
public class GisController {

    private final KakaoUtil kakaoUtil;

    @GetMapping("/main")
    public String main(Model model) {
        log.debug("main starts!");
        return "gis/gis";
    }

    @GetMapping("/geo/cvtcoordtoaddr.json")
    public ResponseEntity<Object> cvtCoordToAddr(@RequestParam("lon") String lon, @RequestParam("lat") String lat) {
        log.debug("cvtcoordtoaddr starts!");

        try {
            Map<String, Object> res = kakaoUtil.cvtCoordToAddr(lon, lat);

            if (res == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("can't find address"));
            }

            return ResponseEntity.status(HttpStatus.OK).body(res);
        } catch (Exception e) {
            log.debug("cvtcoordtoaddr error occurred!");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("server error"));
        }
    }

    @GetMapping("/geo/cvtaddrtocoord.json")
    public ResponseEntity<Object> cvtAddrToACoord(@RequestParam("query") String query) {
        log.debug("cvtaddrtocoord starts!");

        try {
            List<Object> res = kakaoUtil.cvtAddrToCoord(query);

            if (res == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("can't find location"));
            }

            return ResponseEntity.status(HttpStatus.OK).body(res);
        } catch (Exception e) {
            log.debug("cvtaddrtocoord error occurred!");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("server error"));
        }
    }
}
