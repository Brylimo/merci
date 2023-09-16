package com.thxpapa.merci.service.geo;

import com.thxpapa.merci.domain.geo.Spot;
import com.thxpapa.merci.dto.SpotRegisterRequestDto;

public interface SpotService {
    Spot storeSpot(SpotRegisterRequestDto spotRegisterRequestDto);
}
