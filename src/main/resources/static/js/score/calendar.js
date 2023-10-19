let selectedDate = null;
let targetDate = null;
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

$(() => {
    $(".fa-caret-left").click(() => {
        targetDate.setMonth(targetDate.getMonth() - 1);
        $(".calendar-frame .leftside-span").text(monthNames[targetDate.getMonth()]);
        $(".calendar-frame .year-span").text(targetDate.getFullYear());
        generateCalendar(targetDate);
    });

    $(".fa-caret-right").click(() => {
        targetDate.setMonth(targetDate.getMonth() + 1);
        $(".calendar-frame .leftside-span").text(monthNames[targetDate.getMonth()]);
        $(".calendar-frame .year-span").text(targetDate.getFullYear());
        generateCalendar(targetDate);
    });

    $(".modal-content .register-task").click(() => {
        let dataObj = {};
        dataObj.isEvent = $(".modal-content input[name='is-event']").val();
        dataObj.date = $(".modal-content input[name='date']").val();
        dataObj.task = $(".modal-content input[name='task']").val();

        $(".modal-content input[name='task']").val('');

        $.ajax({
            headers: {
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            },
            type: "POST",
            url: "/api/cal/addOneTask.json",
            data: $.param(dataObj),
            dataType: "json",
            success: (res) => {
                $(".modal-wrapper2").removeClass("modal-show");
                $(".modal-wrapper2").addClass("modal-none");

                const $cellTag = $("<div class='cell-event'></div>");
                $cellTag.text(res["content"]);

                $(".cell.selected").append($cellTag);
            },
            error: (error) => {
                alert('일정 등록에 실패했습니다. \n해당 문제가 지속될 경우 관리자에게 문의하여 주십시오.');
                console.error(error.code);
            }
        });
    });

    init();
});

const init = () => {
    const today = new Date();

    selectedDate = today;
    targetDate = today;
    $(".calendar-frame .leftside-span").text(monthNames[today.getMonth()]);
    $(".calendar-frame .year-span").text(today.getFullYear());

    generateCalendar(today);
    todoRenderer(selectedDate);
}

const onClickCellHandler = function() {
    const selectedElements = document.querySelectorAll(".calendar-body-frame .selected");

    selectedElements.forEach(element => {
       $(element).removeClass("selected");
    });
    $(".modal-wrapper2").removeClass("modal-show");
    $(".modal-wrapper2").addClass("modal-none");

    $(this).addClass("selected");

    const targetDay = $(this).find(".cell-inner").text();
    selectedDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDay);

    todoRenderer(selectedDate);
}

const onDblClickCellHandler = function() {
    $(".modal-wrapper2").removeClass("modal-none");
    $(".modal-wrapper2").addClass("modal-show");

    $(".modal-wrapper2 .modal-content input[name='date']").val(formatDateToString(selectedDate));

    $(".modal-wrapper2 .modal-header").on("mousedown", function () {
        const $modal = $(".modal-wrapper2");

        const currentLeft = $modal.position().left;
        const currentTop = $modal.position().top;

        $modal.css("transform", "none");
        $modal.css("left", currentLeft);
        $modal.css("top", currentTop);

        $(".modal-wrapper2.draggable").draggable();
    });
}

const onClickAddATaskHandler = function() {
    const addBtnFrames = document.querySelectorAll(".todo-list .add-frame")

    addBtnFrames.forEach(frame => {
        $(frame).remove();
    })

    const $inputFrame = $(`
        <div class='task-frame'>
            <input type="hidden" name="is-event" value="false" />
            <input type="hidden" name="date" />
            <input type="text" name="task" placeholder="할일을 입력해주세요." />
            <button type="button" class="save-btn">입력</button>
            <button type="button" class="subtract-btn">-</button>
        </div>
    `);

    $($inputFrame).find(".save-btn").click(onClickTaskSaveBtnHandler);
    $($inputFrame).find(".subtract-btn").click(onClickTaskSubtractBtnHandler);

    $(".tcontent-frame .todo-list").append($inputFrame);
    $(".tcontent-frame input[name='date']").val(formatDateToString(selectedDate));

    renderTaskAddBtn();
}

const onClickTaskSaveBtnHandler = (event) => {
    let dataObj = {};
    dataObj.isEvent = $(".tcontent-frame input[name='is-event']").val();
    dataObj.date = $(".tcontent-frame input[name='date']").val();
    dataObj.task = $(".tcontent-frame input[name='task']").val();

    $(".tcontent-frame input[name='task']").val('');

    $.ajax({
        headers: {
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        },
        type: "POST",
        url: "/api/cal/addOneTask.json",
        data: $.param(dataObj),
        dataType: "json",
        success: (res) => {
            // re-render list of to-do
            generateTodoList(formatDateToString(selectedDate))
        },
        error: (error) => {
            alert('일정 등록에 실패했습니다. \n해당 문제가 지속될 경우 관리자에게 문의하여 주십시오.');
            console.error(error.code);
        }
    });
}

const onClickTaskSubtractBtnHandler = function(event) {
   $(this).parent().remove();
}

const onClickTaskDelBtnHandler = function(event) {
    const eventId = $(this).parent().data("eventId");

    $.ajax({
        url: `/api/cal/deleteTask/${eventId}.json`,
        type: "DELETE",
        error: (error) => {
            console.error(error.code);
        }
    });

    $(this).parent().remove();
}

const taskCheckHandler = function(event) {
    if ($(this).is(':checked')) {
        $(this).parent().find('.task-txt').addClass("line-through");
    } else {
        $(this).parent().find('.task-txt').removeClass("line-through");
    }
}

const todoRenderer = (selectedDate) => {
    $(".theader-frame .yoil").text(monthNames[selectedDate.getMonth()]);
    $(".theader-frame .day").text(selectedDate.getDate());

    generateTodoList(formatDateToString(selectedDate));
}

const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
}

const generateCalendar = (date) => {
    $("div").remove(".cell, .obsolete-cell, .today-cell");

    let todayFlag = false;

    const thisDate = date;
    const today = new Date();
    const lastDate = new Date(date);
    let columnCnt = 5; // default 5
    lastDate.setMonth(lastDate.getMonth() - 1);

    if (today.getFullYear() === thisDate.getFullYear() && today.getMonth() === thisDate.getMonth()) {
        todayFlag = true;
    }

    const lastDaysInMonth = getDaysInMonth(lastDate.getFullYear(), lastDate.getMonth());
    const daysInMonth = getDaysInMonth(thisDate.getFullYear(), thisDate.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(thisDate.getFullYear(), thisDate.getMonth());

    if (firstDayOfMonth + daysInMonth > 35) {
        columnCnt = 6;
    } else if (firstDayOfMonth + daysInMonth <= 28) {
        columnCnt = 4;
    } else {
        columnCnt = 5;
    }

    $(".calendar-body-frame").css("grid-template-rows", `2.4rem repeat(${columnCnt}, calc((100% - 2.4rem) / ${columnCnt}))`);

    let dayCounter = 1;
    let nextDayCounter = 1;

    $.ajax({
        url: "/api/cal/getTagDaysByMonth.json",
        type: "GET",
        data: {
            year: thisDate.getFullYear(),
            month: thisDate.getMonth() + 1
        },
        success: (res) => {
            const tagList = res.map(tag => {
               return tag["date"] ?
                   {
                       day: tag["date"][2],
                       name: tag["name"],
                       type: tag["tagType"]
                   } :
                   undefined;
            });

            for (let i = 0; i < columnCnt; i++) {
                if (i === 0) { // first row
                    for (let j = firstDayOfMonth - 1; j >= 0; j--) {
                        createCell(lastDaysInMonth - j, "obsolete");
                    }
                    for (let j = firstDayOfMonth; j < 7; j++) {
                        let $cell = null;
                        let isTag = tagList.some(tag => tag && tag.day === dayCounter);

                        if (todayFlag && today.getDate() === dayCounter) {
                            if (isTag) {
                                const tags = tagList.filter(obj => obj && obj.day === dayCounter);
                                $cell = createCell(dayCounter, "today", tags);
                            } else {
                                $cell = createCell(dayCounter, "today");
                            }

                            if (selectedDate.getDate() === dayCounter) {
                                $cell.addClass("selected");
                            }
                        } else {
                            if (isTag) {
                                const tags = tagList.filter(obj => obj && obj.day === dayCounter);
                                $cell = createCell(dayCounter, "normal", tags);
                            } else {
                                $cell = createCell(dayCounter, "normal");
                            }
                        }

                        // weekend
                        if ($cell && j % 7 === 0) {
                            $cell.css("color", "red");
                        } else if ($cell && j % 7 === 6) {
                            $cell.css("color", "blue");
                        }

                        // process holiday
                        if (isTag) {
                            const tag = tagList.filter(obj => obj && obj.day === dayCounter);
                            tag.forEach(tg => {
                               if (tg["type"] === "holiday") $cell.css("color", "red");
                            });
                        }

                        dayCounter++;
                    }
                } else {
                    for (let j = 0; j < 7; j++) {
                        let $cell = null;
                        let isTag = tagList.some(tag => tag && tag.day === dayCounter);

                        if (dayCounter <= daysInMonth) {
                            if (todayFlag && today.getDate() === dayCounter) {
                                if (isTag) {
                                    const tags = tagList.filter(obj => obj && obj.day === dayCounter);
                                    $cell = createCell(dayCounter, "today", tags);
                                } else {
                                    $cell = createCell(dayCounter, "today");
                                }

                                if (selectedDate.getDate() === dayCounter) {
                                    $cell.addClass("selected");
                                }
                            } else {
                                if (isTag) {
                                    const tags = tagList.filter(obj => obj && obj.day === dayCounter);
                                    $cell = createCell(dayCounter, "normal", tags);
                                } else {
                                    $cell = createCell(dayCounter, "normal");
                                }
                            }

                            // weekend
                            if ($cell && j % 7 === 0) {
                                $cell.css("color", "red");
                            } else if ($cell && j % 7 === 6) {
                                $cell.css("color", "blue");
                            }

                            // process holiday
                            if (isTag) {
                                const tag = tagList.filter(obj => obj && obj.day === dayCounter);
                                tag.forEach(tg => {
                                    if (tg["type"] === "holiday") $cell.css("color", "red");
                                });
                            }

                            dayCounter++;
                        } else {
                            createCell(nextDayCounter, "obsolete");
                            nextDayCounter++
                        }
                    }
                }
            }
        },
        error: (error) => {
            console.error(error.code);
        }
    });
}

const generateTodoList = (dateString) => {
    $.ajax({
        url: "/api/cal/getAllDayTasks.json",
        type: "GET",
        data: {
            date: dateString
        },
        success: (res) => {
            $(".tcontent-frame .todo-list").empty();
            res.filter(job => {
                return job["eventCd"] === "00";
            }).forEach(job => {
                const $task = $("<div class='task-frame'></div>");
                $task.data("eventId", job["taskUid"]);

                const $taskCheckBox = $("<input type='checkbox' />");
                $taskCheckBox.on("change", taskCheckHandler);

                const $taskTxt = $("<div class='task-txt'></div>");
                $taskTxt.text(job.content);

                const $delBtn = $("<button type='button' class='del'>삭제</button>");

                $delBtn.click(onClickTaskDelBtnHandler);

                $task.append($taskCheckBox);
                $task.append($taskTxt);
                $task.append($delBtn);

                $(".tcontent-frame .todo-list").append($task);
            });

            renderTaskAddBtn();
        },
        error: (error) => {
            console.error(error.code);
        }
    });
}

const renderTaskAddBtn = () => {
    const $add = $("<div class='add-frame'></div>");
    const $addPlusBtn = $("<span class=\"icon-span\"><i class=\"fa-solid fa-plus\" aria-hidden=\"true\"></i></span>");

    const $addTxt = $("<div class='task-txt'></div>");
    $addTxt.text("Add a Task");

    $add.append($addPlusBtn);
    $add.append($addTxt);

    $add.click(onClickAddATaskHandler);

    $(".tcontent-frame .todo-list").append($add);
}

const getFirstDayOfMonth = (year, month) => {
    // Get the first day of the month
    return new Date(year, month, 1).getDay();
}

const getDaysInMonth = (year, month) => {
    // Get the number of days in a month;
    return new Date(year, month + 1, 0).getDate();
}

const createCell = (day, kind, tagList) => {
    let $cell = null;

    if (kind === "normal") {
        $cell = $("<div class='cell'></div>");
        $cell.click(onClickCellHandler);
        $cell.dblclick(onDblClickCellHandler);
    } else if (kind === "obsolete") {
        $cell = $("<div class='obsolete-cell'></div>");
    } else if (kind === "today") {
        $cell = $("<div class='today-cell'></div>");
        $cell.click(onClickCellHandler);
        $cell.dblclick(onDblClickCellHandler);
    }

    const $cellInner = $("<div class='cell-inner'></div>");
    $cellInner.text(day);

    $cell.append($cellInner);

    if (tagList) {
        tagList.forEach(tag => {
            let $cellTag = null;
            if (tag.type === "holiday") {
                $cellTag = $("<div class='cell-special'></div>");
            } else if (tag.type === "event") {
                $cellTag = $("<div class='cell-event'></div>");
            }
            $cellTag.text(tag.name);

            $cell.append($cellTag);
        })
    }
    $(".calendar-body-frame").append($cell);

    return $cell;
}