package com.thxpapa.merci.repository.geoRepository;

import com.thxpapa.merci.domain.geo.Album;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlbumRepository extends JpaRepository<Album, Integer> {
}
