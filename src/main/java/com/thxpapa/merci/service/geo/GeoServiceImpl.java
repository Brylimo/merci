package com.thxpapa.merci.service.geo;

import com.thxpapa.merci.util.KakaoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeoServiceImpl implements GeoService {

    private final KakaoUtil kakaoUtil;
    private final List<String> kakaoCategoryGroupCodeList = new ArrayList<>(
            Arrays.asList("MT1", "CS2", "PS3", "SC4", "AC5", "PK6", "OL7", "SW8", "BK9", "CT1", "AG2", "PO3", "AT4", "AD5", "FD6", "CE7", "HP8", "PM9")
    );

    @Override
    public Object cvtCoordToAddr(String lon, String lat) {
        return kakaoUtil.cvtCoordToAddr(lon, lat);
    }

    @Override
    public List<Object> cvtQueryToCoord(String query) {
        // execute address search query
        List<Object> addrList = kakaoUtil.cvtAddrToCoord(query);

        if (addrList.size() > 0) {
            return addrList;
        }

        // execute keyword search query
        return kakaoUtil.cvtKeywordToCoord(query);
    }

    @Async
    @Transactional
    @Override
    public List<Object> searchKakaoCategory(String categoryCode, String lon, String lat) {
        int startPage = 1;
        List<Object> list = new ArrayList<>();

        while (true) {
            log.debug(categoryCode);
            Map<String, Object> res = kakaoUtil.searchCategory(categoryCode, lon, lat, startPage);
            list.addAll((List) res.get("documents"));

            if ((Boolean) res.get("isEnd")) break;

            startPage++;
        }

        return list ;
    }

    public List<Object> fetchInfra(String lon, String lat) {
        List<Object> response = new ArrayList<>();

        for (String code : kakaoCategoryGroupCodeList) {
            response.addAll(searchKakaoCategory(code, lon, lat));
        }

        return response;
    }
}
