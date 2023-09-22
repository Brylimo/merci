package com.thxpapa.merci.service.geo;

import com.thxpapa.merci.util.KakaoUtil;
import com.thxpapa.merci.util.TagoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeoServiceImpl implements GeoService {

    private final KakaoUtil kakaoUtil;
    private final TagoUtil tagoUtil;

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
    public CompletableFuture<List<Object>> searchKakaoCategory(String categoryCode, String lon, String lat, String rad) {
        CompletableFuture<List<Object>> resultFuture = new CompletableFuture<>();
        int startPage = 1;
        List<Object> list = new ArrayList<>();

        try {
            while (true) {
                Map<String, Object> res = kakaoUtil.searchCategory(categoryCode, lon, lat, rad, startPage);
                list.addAll((List) res.get("documents"));

                if ((Boolean) res.get("isEnd")) break;

                startPage++;
            }

            resultFuture.complete(list);
        } catch (Exception e) {
            resultFuture.completeExceptionally(e);
        }

        return resultFuture;
    }

    @Override
    public List<Object> fetchSttnList(String lon, String lat) {
        List<Object> sttnList = tagoUtil.getCrdntPrxmtSttnList(lon, lat);
        return sttnList;
    }
}
