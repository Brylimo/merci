package com.thxpapa.merci.service.geo;

import com.thxpapa.merci.util.KakaoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeoServiceImpl implements GeoService {

    private final KakaoUtil kakaoUtil;

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
}
