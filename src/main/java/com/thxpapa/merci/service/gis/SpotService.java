package com.thxpapa.merci.service.gis;

import com.thxpapa.merci.domain.gis.Spot;
import com.thxpapa.merci.dto.SpotRegisterRequestDto;

public interface SpotService {
    Spot storeSpot(SpotRegisterRequestDto spotRegisterRequestDto);
}
