package com.thxpapa.merci.service.geo;

import java.util.List;

public interface GeoService {
    Object cvtCoordToAddr(String lon, String lat);
    List<Object> cvtQueryToCoord(String query);
    List<Object> searchKakaoCategory(String categoryCode, String lon, String lat);
    List<Object> fetchInfra(String lon, String lat);
}
