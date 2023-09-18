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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api")
public class ApiController {

    private final GeoService geoService;
    private final MerciUserService merciUserService;

    private final List<String> kakaoCategoryGroupCodeList = new ArrayList<>(
            Arrays.asList("MT1", "CS2", "PS3", "SC4", "AC5", "PK6", "OL7", "SW8", "BK9", "CT1", "AG2", "PO3", "AT4", "AD5", "FD6", "CE7", "HP8", "PM9")
    );

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
    public CompletableFuture<ResponseEntity<Object>> fetchInfra(@RequestParam("lon") String lon, @RequestParam("lat") String lat) {
        log.debug("fetchInfra starts!");

        List<CompletableFuture<List<Object>>> categorySearchFutures = new ArrayList<>();

        for (String code : kakaoCategoryGroupCodeList) {
            categorySearchFutures.add(geoService.searchKakaoCategory(code, lon, lat));
        }

        CompletableFuture<Void> allOf = CompletableFuture.allOf(
                categorySearchFutures.toArray(new CompletableFuture[0])
        );

        return allOf.thenApplyAsync(ignoredVoid -> {
            List<Object> response = new ArrayList<>();

            for (CompletableFuture<List<Object>> categorySearchFuture : categorySearchFutures) {
                try {
                    List<Object> categorySearchResult = categorySearchFuture.get();
                    response.addAll(categorySearchResult);
                } catch (Exception e) {
                    log.error("An error occurred while fetching category data", e);
                }
            }

            if (response.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Can't fetch infra data"));
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        });
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
