package com.thxpapa.merci.service.gis;

import java.util.List;

public interface GeoService {
    Object cvtCoordToAddr(String lon, String lat);
    List<Object> cvtQueryToCoord(String query);
}
