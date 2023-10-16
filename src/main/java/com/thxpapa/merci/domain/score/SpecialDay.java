package com.thxpapa.merci.domain.score;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(name="special_day", schema="datamart")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "specialDayUid", callSuper=false)
@ToString
public class SpecialDay {
    @Id
    @Column(name="special_day_uid")
    private String specialDayUid;

    @Comment("날짜")
    @Column(name="date")
    private LocalDate date;

    @Comment("이름")
    @Column(name="date_name")
    private String dateName;

    @Comment("공휴일 여부")
    @Column(name="holiday_cd")
    private Boolean holidayCd;

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

    static public final String idSplitter = "::";

    @Builder
    public SpecialDay(String specialDayUid, LocalDate date, String dateName, Boolean holidayCd, String statusCd) {
        this.specialDayUid = specialDayUid;
        this.date = date;
        this.dateName = dateName;
        this.holidayCd = holidayCd;
        this.statusCd = statusCd;
    }
}
