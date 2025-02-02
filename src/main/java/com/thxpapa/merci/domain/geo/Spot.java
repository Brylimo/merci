package com.thxpapa.merci.domain.geo;

import com.thxpapa.merci.domain.file.MerciFile;
import com.thxpapa.merci.domain.user.MerciUser;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name="spot", schema="datamart")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "spotUid", callSuper=false)
@ToString
public class Spot {
    @Id
    @Column(name="spot_uid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int spotUid;

    @Comment("장소이름")
    @Column(name="name", length = 45, nullable = true)
    private String name;

    @Comment("장소")
    @Column(name="loc", length = 40, nullable = false)
    private String loc;

    @Lob
    @Comment("장소설명")
    @Column(name="exp", nullable = true)
    private String exp;

    @Comment("경도")
    @Column(name="lon")
    private Double lon;

    @Comment("위도")
    @Column(name="lat")
    private Double lat;

    @Comment("상태정보")
    @Column(name="status_cd", length = 3, nullable = false)
    @ColumnDefault("'01'")
    private String statusCd;

    @Comment("등록 날짜 시간")
    @CreationTimestamp
    @Column(name="reg_dt")
    private LocalDateTime regDt;

    @Comment("업데이트 날짜 시간")
    @CreationTimestamp
    @Column(name="mod_dt")
    private LocalDateTime modDt;

    @ManyToOne
    @JoinColumn(name="merciUserId")
    private MerciUser merciUser;

    @OneToOne
    @JoinColumn(name="merciFileId")
    private MerciFile merciFile;

    @Builder
    public Spot(String name, String loc, String exp, Double lon, Double lat, MerciFile merciFile, String statusCd) {
        this.name = name;
        this.loc = loc;
        this.exp = exp;
        this.lon = lon;
        this.lat = lat;
        this.statusCd = statusCd;
        this.merciFile = merciFile;
    }
}
