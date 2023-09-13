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

import java.util.Map;

@Slf4j
@Component
public class KakaoUtil {
    @Value("${kakao.api.url}")
    private String kakaoUrl;
    @Value("${kakao.api.akey}")
    private String aKey;

    public Map<String, Object> cvtCoordToAddr(String x, String y) {
        if (x==null || y==null) return null;
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", aKey);

            HttpEntity<?> httpEntity = new HttpEntity<>(headers);
            UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(kakaoUrl+"/v2/local/geo/coord2regioncode.json").queryParam("x", x).queryParam("y", y).build().encode();
            ResponseEntity<String> response = restTemplate.exchange(uriComponents.toString(), HttpMethod.GET, httpEntity, String.class);

            if (response.getStatusCode().value() == 200) {
                JsonParser jsonParser = new JsonParser();

                JsonObject object = (JsonObject) jsonParser.parse(response.getBody());
                JsonArray jsonArray = (JsonArray) object.get("documents");

                JsonObject res = (JsonObject) jsonArray.get(0);

                return new ObjectMapper().readValue(res.toString(), Map.class);
            }

            return null;
        } catch(Exception e) {
            log.error("cvtCoordToAddr error occurred!");
            return null;
        }
    }

}