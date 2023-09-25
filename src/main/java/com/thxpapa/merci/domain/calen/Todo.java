package com.thxpapa.merci.domain.calen;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Comment;

@Getter
@Entity
@Table(name="todo", schema="datamart")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "todoUid", callSuper=false)
@ToString
public class Todo {
    @Id
    @Column(name="todo_uid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int todoUid;

    @Comment("내용")
    @Column(name="content", length = 45, nullable = false)
    private String content;

    @ManyToOne
    @JoinColumn(name="dayId")
    private Day day;
}
