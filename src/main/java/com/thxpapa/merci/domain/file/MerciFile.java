package com.thxpapa.merci.domain.file;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name="merci_file", schema="datamart")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "merciFileUid", callSuper=false)
@ToString
public class MerciFile {
    @Id
    @Column(name="merci_file_uid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int merciFileUid;

    @Comment("업로드 파일 이름")
    @Column(name="upload_name", length = 255)
    private String uploadName;

    @Comment("저장된 파일 이름")
    @Column(name="store_name", length = 255)
    private String storeName;

    @Comment("상태정보")
    @Column(name="status_cd")
    @ColumnDefault("0")
    private int statusCd;

    @Comment("등록 날짜 시간")
    @CreationTimestamp
    @Column(name="reg_dt")
    private LocalDateTime regDt;

    @Comment("업데이트 날짜 시간")
    @CreationTimestamp
    @Column(name="mod_dt")
    private LocalDateTime modDt;

    @Builder
    public MerciFile(String uploadName, String storeName) {
        this.uploadName = uploadName;
        this.storeName = storeName;
    }
}
