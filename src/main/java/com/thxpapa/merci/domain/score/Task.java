package com.thxpapa.merci.domain.score;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name="task", schema="datamart")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "taskUid", callSuper=false)
@ToString
public class Task {
    @Id
    @Column(name="task_uid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int taskUid;

    @Comment("내용")
    @Column(name="content", length = 45, nullable = false)
    private String content;

    @Comment("보상")
    @Column(name="reward")
    @ColumnDefault("0")
    private int reward;

    @Comment("이벤트 유무")
    @Column(name="event_cd", length = 2, nullable = false)
    @ColumnDefault("'00'")
    private String eventCd;

    @Comment("완료 유무")
    @Column(name="done_cd")
    @ColumnDefault("false")
    private boolean doneCd;

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
    @JoinColumn(name="dayId")
    private Day day;

    @Builder
    public Task(String content, int reward, Day day, String eventCd, String statusCd) {
        this.content = content;
        this.reward = reward;
        this.eventCd = eventCd;
        this.statusCd = statusCd;
        this.day = day;
    }
}
