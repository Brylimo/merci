package com.thxpapa.merci.web;

import com.thxpapa.merci.dto.ErrorResponse;
import com.thxpapa.merci.service.gis.GeoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/gis")
public class GisController {

    private final GeoService geoService;

    @GetMapping("/main")
    public String main(Model model) {
        log.debug("main starts!");
        return "gis/gis";
    }

    @GetMapping("/geo/cvtcoordtoaddr.json")
    public ResponseEntity<Object> cvtCoordToAddr(@RequestParam("lon") String lon, @RequestParam("lat") String lat) {
        log.debug("cvtcoordtoaddr starts!");

        try {
            Object res = geoService.cvtCoordToAddr(lon, lat);

            if (res == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("can't find address"));
            }

            return ResponseEntity.status(HttpStatus.OK).body(res);
        } catch (Exception e) {
            log.debug("cvtcoordtoaddr error occurred!");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("server error"));
        }
    }

    @GetMapping("/geo/cvtquerytocoord.json")
    public ResponseEntity<Object> cvtQueryToCoord(@RequestParam("query") String query) {
        log.debug("cvtquerytocoord starts!");

        try {
            List<Object> res = geoService.cvtQueryToCoord(query);

            if (res == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("can't find query data"));
            }

            return ResponseEntity.status(HttpStatus.OK).body(res);
        } catch (Exception e) {
            log.debug("cvtquerytocoord error occurred!");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("server error"));
        }
    }
}
