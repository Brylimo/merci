package com.thxpapa.merci.domain.gis;

import com.thxpapa.merci.domain.user.User;
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
@Table(name="spot", schema="datamart")
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

    @Comment("경도")
    @Column(name="lon")
    private Double lon;

    @Lob
    @Comment("위도")
    @Column(name="lat")
    private Double lat;

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
    @JoinColumn(name="userId")
    private User user;
}
