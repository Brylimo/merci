package com.thxpapa.merci.repository.fileRepository;

import com.thxpapa.merci.domain.file.MerciFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MerciFileRepository extends JpaRepository<MerciFile, Integer> {
}
