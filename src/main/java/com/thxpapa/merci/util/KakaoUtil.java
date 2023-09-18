package com.thxpapa.merci.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class KakaoUtil {
    @Value("${kakao.api.url}")
    private String kakaoUrl;
    @Value("${kakao.api.akey}")
    private String aKey;

    public Object cvtCoordToAddr(String x, String y) {
        if (x==null || y==null) return null;
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", aKey);

            HttpEntity<?> httpEntity = new HttpEntity<>(headers);
            UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(kakaoUrl+"/v2/local/geo/coord2address.json").queryParam("x", x).queryParam("y", y).queryParam("input_coord", "WGS84").build().encode();
            ResponseEntity<String> response = restTemplate.exchange(uriComponents.toString(), HttpMethod.GET, httpEntity, String.class);

            if (response.getStatusCode().value() == 200) {
                JsonParser jsonParser = new JsonParser();

                JsonObject body = (JsonObject) jsonParser.parse(response.getBody());
                JsonArray documents = (JsonArray) body.get("documents");
                JsonObject object = (JsonObject) documents.get(0);
                JsonObject res = (JsonObject) object.get("address");

                return new ObjectMapper().readValue(res.toString(), Object.class);
            }

            return null;
        } catch(Exception e) {
            log.error("cvtCoordToAddr error occurred!");
            return null;
        }
    }

    public List<Object> cvtAddrToCoord(String address) {
        if (address == null) return null;
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", aKey);

            HttpEntity<?> httpEntity = new HttpEntity<>(headers);
            UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(kakaoUrl+"/v2/local/search/address.json").queryParam("query", address).build();
            ResponseEntity<String> response = restTemplate.exchange(uriComponents.toString(), HttpMethod.GET, httpEntity, String.class);

            if (response.getStatusCode().value() == 200) {
                JsonParser jsonParser = new JsonParser();

                JsonObject body = (JsonObject) jsonParser.parse(response.getBody());
                JsonArray documents = (JsonArray) body.get("documents");

                return Arrays.asList(new ObjectMapper().readValue(documents.toString(), Object[].class));
            }

            return null;
        } catch (Exception e) {
            log.error("cvtAddrToCoord error occurred!");
            return null;
        }
    }

    public List<Object> cvtKeywordToCoord(String keyword) {
        if (keyword == null) return null;
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", aKey);

            HttpEntity<?> httpEntity = new HttpEntity<>(headers);
            UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(kakaoUrl+"/v2/local/search/keyword.json").queryParam("query", keyword).build();
            ResponseEntity<String> response = restTemplate.exchange(uriComponents.toString(), HttpMethod.GET, httpEntity, String.class);

            if (response.getStatusCode().value() == 200) {
                JsonParser jsonParser = new JsonParser();

                JsonObject body = (JsonObject) jsonParser.parse(response.getBody());
                JsonArray documents = (JsonArray) body.get("documents");

                return Arrays.asList(new ObjectMapper().readValue(documents.toString(), Object[].class));
            }

            return null;
        } catch (Exception e) {
            log.error("cvtKeywordToCoord error occurred!");
            return null;
        }
    }

    public Map<String, Object> searchCategory(String categoryGroupCode, String lon, String lat, String rad, Integer page) {
        if (categoryGroupCode == null || lon == null || lat == null || rad == null || page == null) return null;

        int radius = 19999;
        try { radius = Integer.parseInt(rad); } catch (NumberFormatException e) {}

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", aKey);

            HttpEntity<?> httpEntity = new HttpEntity<>(headers);
            UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(kakaoUrl+"/v2/local/search/category.json")
                    .queryParam("x", lon).queryParam("y", lat).queryParam("radius", radius).queryParam("size", 15).queryParam("page", page).queryParam("category_group_code", categoryGroupCode).build();
            ResponseEntity<String> response = restTemplate.exchange(uriComponents.toString(), HttpMethod.GET, httpEntity, String.class);

            if (response.getStatusCode().value() == 200) {
                Map<String, Object> res = new HashMap<>();
                JsonParser jsonParser = new JsonParser();

                JsonObject body = (JsonObject) jsonParser.parse(response.getBody());
                JsonObject meta = (JsonObject) body.get("meta");
                JsonArray documents = (JsonArray) body.get("documents");

                res.put("isEnd", Boolean.parseBoolean(String.valueOf(meta.get("is_end"))));
                res.put("documents", Arrays.asList(new ObjectMapper().readValue(documents.toString(), Object[].class)));

                return res;
            }

            return null;
        } catch (Exception e) {
            log.error("searchCategory error occurred!");
            return null;
        }
    }

}