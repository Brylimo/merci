package com.thxpapa.merci.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
public class SpotRegisterRequestDto {
    private Double spotLon;
    private Double spotLat;
    private String spotName;
    private String spotLoc;
    private String spotExp;
    private MultipartFile spotImg;
}
