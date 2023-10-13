package com.thxpapa.merci.web;

import com.thxpapa.merci.domain.user.MerciUser;
import com.thxpapa.merci.dto.ErrorResponse;
import com.thxpapa.merci.dto.UserRegisterRequestDto;
import com.thxpapa.merci.service.geo.GeoService;
import com.thxpapa.merci.service.user.MerciUserService;
import com.thxpapa.merci.util.SpecialDayUtil;
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
    private final SpecialDayUtil specialDayUtil;

    /* MT1 대형마트 / CS2 편의점 / PS3 어린이집, 유치원 / SC4 학교 / AC5 학원 / PK6 주차장 / OL7 주유소, 충전소 / SW8 지하철역
    * BK9 은행 / CT1 문화시설 / AG2 중개업소 / PO3 공공기관 / AT4 관광명소 / AD5 숙박 / FD6 음식점 / CE7 카페 / HP8 병원 / PM9 약국 */
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
    public CompletableFuture<ResponseEntity<Object>> fetchInfra(@RequestParam("lon") String lon, @RequestParam("lat") String lat, @RequestParam("rad") String rad) {
        /*log.debug("fetchInfra starts!");*/

        List<CompletableFuture<List<Object>>> categorySearchFutures = new ArrayList<>();

        for (String code : kakaoCategoryGroupCodeList) {
            categorySearchFutures.add(geoService.searchKakaoCategory(code, lon, lat, rad));
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

    @GetMapping("/geo/fetchSttnList.json")
    public ResponseEntity<Object> fetchSttnList(@RequestParam("lon") String lon, @RequestParam("lat") String lat) {
        try {
            List<Object> res = geoService.fetchSttnList(lon, lat);

            if (res == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("can't find station data"));
            }

            return ResponseEntity.status(HttpStatus.OK).body(res);
        } catch (Exception e) {
            log.debug("fetchSttnList error occurred!");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("server error"));
        }
    }

    @GetMapping("/geo/getSttnArvInfo.json")
    public ResponseEntity<Object> getSttnArvInfo(@RequestParam("cityCode") String cityCode, @RequestParam("nodeId") String nodeId) {
        try {
            List<Object> res = geoService.getSttnArvInfo(cityCode, nodeId);

            if (res == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("can't find arriving data"));
            }

            return ResponseEntity.status(HttpStatus.OK).body(res);
        } catch (Exception e) {
            log.debug("getSttnArvInfo error occurred!");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("server error"));
        }
    }

    // calendar rest api call
    @GetMapping("/cal/practice")
    public ResponseEntity<Object> practice(@RequestParam("solYear") String solYear, @RequestParam("solMonth") String solMonth) {
        specialDayUtil.getRestDeInfo(solYear, solMonth);
        return null;
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
