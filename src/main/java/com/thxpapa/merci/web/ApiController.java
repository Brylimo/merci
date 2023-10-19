package com.thxpapa.merci.web;

import com.thxpapa.merci.domain.score.Day;
import com.thxpapa.merci.domain.score.SpecialDay;
import com.thxpapa.merci.domain.score.Task;
import com.thxpapa.merci.domain.user.MerciUser;
import com.thxpapa.merci.dto.ErrorResponse;
import com.thxpapa.merci.dto.UserRegisterRequestDto;
import com.thxpapa.merci.dto.score.TagDto;
import com.thxpapa.merci.service.geo.GeoService;
import com.thxpapa.merci.service.score.DayService;
import com.thxpapa.merci.service.score.SpecialDayService;
import com.thxpapa.merci.service.score.TaskService;
import com.thxpapa.merci.service.user.MerciUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api")
public class ApiController {

    private final GeoService geoService;
    private final MerciUserService merciUserService;
    private final SpecialDayService specialDayService;
    private final DayService dayService;
    private final TaskService taskService;

    /* MT1 대형마트 / CS2 편의점 / PS3 어린이집, 유치원 / SC4 학교 / AC5 학원 / PK6 주차장 / OL7 주유소, 충전소 / SW8 지하철역
    * BK9 은행 / CT1 문화시설 / AG2 중개업소 / PO3 공공기관 / AT4 관광명소 / AD5 숙박 / FD6 음식점 / CE7 카페 / HP8 병원 / PM9 약국 */
    private final List<String> kakaoCategoryGroupCodeList = new ArrayList<>(
            Arrays.asList("MT1", "CS2", "PS3", "SC4", "AC5", "PK6", "OL7", "SW8", "BK9", "CT1", "AG2", "PO3", "AT4", "AD5", "FD6", "CE7", "HP8", "PM9")
    );

    // geo rest api call
    @GetMapping(value = "/geo/cvtcoordtoaddr.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> cvtCoordToAddr(@RequestParam("lon") String lon, @RequestParam("lat") String lat) {
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

    @GetMapping(value = "/geo/cvtquerytocoord.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> cvtQueryToCoord(@RequestParam("query") String query) {
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

    @GetMapping(value = "/geo/fetchInfra.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public CompletableFuture<ResponseEntity<Object>> fetchInfra(@RequestParam("lon") String lon, @RequestParam("lat") String lat, @RequestParam("rad") String rad) {
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

    @GetMapping(value = "/geo/fetchSttnList.json", produces = MediaType.APPLICATION_JSON_VALUE)
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

    @GetMapping(value = "/geo/getSttnArvInfo.json", produces = MediaType.APPLICATION_JSON_VALUE)
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
    @GetMapping(value = "/cal/getTagDaysByMonth.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> getTagDaysByMonth(@RequestParam("year") String year, @RequestParam("month") String month) {
        try {
            LocalDate startDate = YearMonth.of(Integer.parseInt(year), Integer.parseInt(month)).atDay(1);
            LocalDate endDate = startDate.plusMonths(1).minusDays(1);

            List<TagDto> tagList = new ArrayList<>();

            List<SpecialDay> specialDayList = specialDayService.getSpecialDaysByMonth(startDate, endDate);
            List<Task> eventList = taskService.getEventsByMonth(startDate, endDate);

            // convert SpecialDay to TagDto
            tagList.addAll(specialDayList.stream().map(specialDay -> {
                return TagDto.builder()
                        .date(specialDay.getDate())
                        .name(specialDay.getDateName())
                        .tagType("holiday")
                        .build();
            }).collect(Collectors.toList()));

            // convert Task to TagDto
            tagList.addAll(eventList.stream().map(event -> {
                return TagDto.builder()
                        .date(event.getDay().getDate())
                        .name(event.getContent())
                        .tagType("event")
                        .build();
            }).collect(Collectors.toList()));

            return ResponseEntity.status(HttpStatus.OK).body(tagList);
        } catch (Exception e) {
            log.debug("getTagDaysByMonth error occurred!");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("server error"));
        }
    }

    @PostMapping(value = "/cal/addOneTask.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> addOneTask(@RequestBody MultiValueMap<String, String> formData) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try {
            String date = formData.get("date").get(0);
            String task = formData.get("task").get(0);
            String isEvent = formData.get("isEvent").get(0);
            String eventCd = null;

            if (isEvent.equals("false")) {
                eventCd = "00";
            } else if (isEvent.equals("true")) {
                eventCd = "01";
            }

            LocalDate thisDate = LocalDate.parse(date, formatter);
            
            Day day = dayService.findOneDay(thisDate);
            
            if (day == null) {
                day = dayService.createDay(thisDate);
            }

            Task createdTask = taskService.createTask(day, task, eventCd, 10);

            return ResponseEntity.status(HttpStatus.OK).body(createdTask);
        } catch (Exception e) {
            log.debug("addOneTask error occurred!");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("server error"));
        }
    }

    @DeleteMapping(value = "/cal/deleteTask/{id}.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> deleteTask(@PathVariable int id) {
        try {
            taskService.deleteById(id);

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.debug("deleteTask error occurred!");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("server error"));
        }
    }

    @GetMapping(value = "/cal/getAllDayTasks.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> getAllDayTasks(@RequestParam("date") String date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try {
            LocalDate thisDate = LocalDate.parse(date, formatter);

            Day day = dayService.findOneDay(thisDate);

            if (day == null) {
                return ResponseEntity.status(HttpStatus.OK).body(new ArrayList<Task>());
            } else {
                List<Task> taskList = taskService.getTasksByDay(day);

                return ResponseEntity.status(HttpStatus.OK).body(taskList);
            }
        } catch (Exception e) {
            log.debug("getAllDayTasks error occurred!");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("server error"));
        }
    }

    // auth rest api call
    @PostMapping(value = "/auth/join.json", produces = MediaType.APPLICATION_JSON_VALUE)
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
