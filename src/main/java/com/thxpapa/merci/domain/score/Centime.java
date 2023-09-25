package com.thxpapa.merci.domain.score;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;

@Getter
@Entity
@Table(name="centime", schema="datamart")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "centimeUid", callSuper=false)
@ToString
public class Centime {
    @Id
    @Column(name="centime_uid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int centimeUid;

    @Comment("내용")
    @Column(name="content", length = 45, nullable = false)
    private String content;

    @Comment("포인트")
    @Column(name="centime")
    @ColumnDefault("0")
    private int centime;

    @ManyToOne
    @JoinColumn(name="dayId")
    private Day day;
}
