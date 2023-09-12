package com.thxpapa.merci.service.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
public class KakaoUtil {
    @Value("${kakao.api.url}")
    static private String kakaoUrl;
    @Value("${kakao.api.akey}")
    static private String aKey;

    static public String[] cvtCoordToAddr(String x, String y) {
        if (x==null || y==null) return null;
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", aKey);

            HttpEntity<?> httpEntity = new HttpEntity<>(headers);
            UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(kakaoUrl).build();

            return null;
        } catch(Exception e) {
            log.error("cvtCoordToAddr error occurred!");
            return null;
        }
    }

}