package com.thxpapa.merci.web;

import com.thxpapa.merci.domain.file.MerciFile;
import com.thxpapa.merci.domain.gis.Spot;
import com.thxpapa.merci.dto.SpotRegisterRequestDto;
import com.thxpapa.merci.repository.fileRepository.MerciFileRepository;
import com.thxpapa.merci.repository.gisRepository.SpotRepository;
import com.thxpapa.merci.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/spot")
public class SpotController {

    private final FileUtil fileUtil;

    private final SpotRepository spotRepository;
    private final MerciFileRepository merciFileRepository;

    @GetMapping("/item/{spotId}")
    public String spotItem(@PathVariable Integer spotId) {
        return "gis/spot";
    }

    @PostMapping("/register")
    public String spotRegister(@ModelAttribute SpotRegisterRequestDto spotRegisterRequestDto, RedirectAttributes redirectAttributes) {
        log.debug("spotRegister starts!");
        try {
            // store mercifile item
            MerciFile file = fileUtil.storeFile(spotRegisterRequestDto.getSpotImg());
            merciFileRepository.save(file);

            // store spot item
            Spot storedSpot = spotRepository.save(Spot.builder()
                                    .name(spotRegisterRequestDto.getSpotName())
                                    .loc(spotRegisterRequestDto.getSpotLoc())
                                    .exp(spotRegisterRequestDto.getSpotExp())
                                    .lon(spotRegisterRequestDto.getSpotLon())
                                    .lat(spotRegisterRequestDto.getSpotLat())
                                    .merciFile(file)
                                    .statusCd("01")
                                    .build());

            redirectAttributes.addAttribute("spotId", storedSpot.getSpotUid());

        } catch (Exception e) {
            log.debug("spotRegister error occurred!");
        }
        return "redirect:/spot/item/{spotId}";
    }
}
