package com.thxpapa.merci.domain.user;

import com.thxpapa.merci.domain.geo.Spot;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name="merci_user", schema="datamart")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "merciUserUid", callSuper=false)
@ToString
public class MerciUser {
    @Id
    @Column(name="merci_user_uid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int merciUserUid;

    @Comment("이름")
    @Column(name="name", length = 45, nullable = false)
    private String name;

    @Comment("이메일")
    @Column(name="email", length = 45, nullable = false)
    private String email;

    @Comment("유저이름")
    @Column(name="username", length = 45, nullable = false)
    private String username;

    @Comment("비밀번호")
    @Column(name="password", length = 255, nullable = true)
    private String password;

    @Lob
    @Comment("자기소개")
    @Column(name="intro", nullable = true)
    private String intro;

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

    @OneToMany(mappedBy = "merciUser")
    private List<Spot> spots = new ArrayList<Spot>();

    @Builder
    public MerciUser(String name, String email, String username, String password, String intro, String statusCd) {
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
        this.intro = intro;
        this.statusCd = statusCd;
    }
}
