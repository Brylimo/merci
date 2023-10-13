package com.thxpapa.merci.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
public class SpecialDayUtil {
    @Value("${special.api.url}")
    private String specialUrl;
    @Value("${datago.api.akey}")
    private String akey;

    public List<Object> getRestDeInfo(String solYear, String solMonth) {
        try {
            HttpURLConnection conn = null;

            StringBuilder urlBuilder = new StringBuilder(specialUrl + "/openapi/service/SpcdeInfoService/getRestDeInfo");
            urlBuilder.append("?" + URLEncoder.encode("serviceKey","UTF-8") + "=" + akey);
            urlBuilder.append("&" + URLEncoder.encode("solYear","UTF-8") + "=" + URLEncoder.encode(solYear, "UTF-8"));
            urlBuilder.append("&" + URLEncoder.encode("solMonth","UTF-8") + "=" + URLEncoder.encode(solMonth, "UTF-8"));

            conn = getConnection(urlBuilder.toString());
            if (conn == null) return null;

            String line;
            BufferedReader br = null;
            if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
                br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

                StringBuilder sb = new StringBuilder();
                while((line = br.readLine())!=null) {
                    sb.append(line);
                }

                JsonParser jsonParser = new JsonParser();
                JsonObject json = (JsonObject) jsonParser.parse(sb.toString());
                JsonObject res = (JsonObject) json.get("response");
                JsonArray list = ((JsonObject) res.get("body")).getAsJsonObject("items").getAsJsonArray("item");

                return Arrays.asList(new ObjectMapper().readValue(list.toString(), Object[].class));
            }
            return null;
        } catch(Exception e) {
            log.error("getRestDeInfo error occurred!");
            return null;
        }
    }

    private HttpURLConnection getConnection(String link) {
        HttpURLConnection conn = null;
        try {
            URL url = new URL(link);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-type", "application/json");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(3000);
            conn.connect();
            return conn;
        } catch (Exception e) {
            return null;
        }
    }
}
