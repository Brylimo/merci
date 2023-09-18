package com.thxpapa.merci.service.geo;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface GeoService {
    Object cvtCoordToAddr(String lon, String lat);
    List<Object> cvtQueryToCoord(String query);
    CompletableFuture<List<Object>> searchKakaoCategory(String categoryCode, String lon, String lat);
}
