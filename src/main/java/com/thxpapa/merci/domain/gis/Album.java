package com.thxpapa.merci.domain.gis;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name="album", schema="datamart")
@EqualsAndHashCode(of = "albumUid", callSuper=false)
@ToString
public class Album {
    @Id
    @Column(name="album_uid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int albumUid;

    @Comment("앨범이름")
    @Column(name="name", length = 45, nullable = true)
    private String name;

    @Comment("앨범이름")
    @Column(name="like_cnt")
    @ColumnDefault("0")
    private int likeCnt;

    @Comment("앨범설명")
    @Column(name="exp", length = 255, nullable = true)
    private String exp;

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

    @ManyToOne
    @JoinColumn(name="spotId")
    private Spot spot;
}
