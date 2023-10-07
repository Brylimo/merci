package com.thxpapa.merci.domain.score;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;

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

    @ManyToOne
    @JoinColumn(name="dayId")
    private Day day;
}
