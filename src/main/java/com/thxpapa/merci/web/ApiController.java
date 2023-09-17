package com.thxpapa.merci.web;

import com.thxpapa.merci.domain.user.MerciUser;
import com.thxpapa.merci.dto.ErrorResponse;
import com.thxpapa.merci.dto.UserRegisterRequestDto;
import com.thxpapa.merci.service.geo.GeoService;
import com.thxpapa.merci.service.user.MerciUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api")
public class ApiController {

    private final GeoService geoService;
    private final MerciUserService merciUserService;

    // geo rest api call
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

    @GetMapping("/geo/fetchInfra.json")
    public ResponseEntity<Object> fetchInfra(@RequestParam("lon") String lon, @RequestParam("lat") String lat) {
        log.debug("fetchInfra starts!");
        // todo need to make async api call

        long startTime = System.currentTimeMillis();
        try {
            List<Object> res = geoService.fetchInfra(lon, lat);

            if (res == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("can't fetch infra data"));
            }

            long stopTime = System.currentTimeMillis();
            System.out.println(stopTime - startTime); // 3.14 seconds give and take
            return ResponseEntity.status(HttpStatus.OK).body(res);
        } catch (Exception e) {
            log.debug("fetchInfra error occurred!");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("server error"));
        }
    }

    // auth rest api call
    @PostMapping("/auth/join.json")
    public ResponseEntity<Object> join(@ModelAttribute UserRegisterRequestDto userRegisterRequestDto) {
        log.debug("join starts!");

        try {
            MerciUser merciUser = merciUserService.createMerciUser(userRegisterRequestDto);

            if (merciUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("can't register user"));
            }

            return ResponseEntity.status(HttpStatus.OK).body(merciUser);
        } catch (Exception e) {
            log.debug("cvtquerytocoord error occurred!");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("server error"));
        }
    }
}
