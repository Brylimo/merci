package com.thxpapa.merci.domain.user;

import com.thxpapa.merci.domain.gis.Spot;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name="user", schema="datamart")
@EqualsAndHashCode(of = "userUid", callSuper=false)
@ToString
public class User {
    @Id
    @Column(name="user_uid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userUid;

    @Comment("유저이름")
    @Column(name="name", length = 45, nullable = false)
    private String name;

    @Comment("이메일")
    @Column(name="email", length = 45, nullable = false)
    private String email;

    @Comment("유저닉네임")
    @Column(name="nickname", length = 45, nullable = false)
    private String nickname;

    @Comment("비밀번호")
    @Column(name="password", length = 255, nullable = true)
    private String password;

    @Lob
    @Comment("자기소개")
    @Column(name="intro", nullable = true)
    private String intro;

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

    @OneToMany(mappedBy = "user")
    private List<Spot> spots = new ArrayList<Spot>();
}
