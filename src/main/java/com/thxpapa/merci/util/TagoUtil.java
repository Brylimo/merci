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

import java.net.URI;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
public class TagoUtil {
    @Value("${tago.api.url}")
    private String tagoUrl;
    @Value("${tago.api.akey}")
    private String akey;

    public List<Object> getCrdntPrxmtSttnList(String lon, String lat) { // 반경 500m
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();

            String url = tagoUrl+"/1613000/BusSttnInfoInqireService/getCrdntPrxmtSttnList?"+"serviceKey="+akey+"&_type=json"+"&gpsLati="+lat+"&gpsLong="+lon;

            URI uri = new URI(url);
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, null, String.class);

            if (response.getStatusCode().value() == 200) {
                JsonParser jsonParser = new JsonParser();

            }

            return null;
        } catch(Exception e) {
            log.error("getCrdntPrxmtSttnList error occurred!");
            return null;
        }
    }

}
