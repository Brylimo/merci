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

const onSelectHandler = function() {
    const selectedElements = document.querySelectorAll(".calendar-body-frame .selected");

    selectedElements.forEach(element => {
       $(element).removeClass("selected");
    });
    $(this).addClass("selected");

    const targetDay = $(this).find(".cell-inner").text();
    selectedDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDay);

    todoRenderer(selectedDate);
}

const onClickAddATaskHandler = function() {
    const addBtnFrames = document.querySelectorAll(".todo-list .add-frame")

    addBtnFrames.forEach(frame => {
        $(frame).remove();
    })

    const $inputFrame = $(`
        <div class='task-frame'>
            <input type="hidden" name="date" />
            <input type="text" name="task" placeholder="할일을 입력해주세요." />
            <button type="button" class="save-btn">입력</button>
        </div>
    `);

    $($inputFrame).find(".save-btn").click(onClickTaskSaveBtnHandler);

    $(".tcontent-frame .todo-list").append($inputFrame);
    $(".tcontent-frame input[name='date']").val(formatDateToString(selectedDate));

    renderTaskAddBtn();
}

const onClickTaskSaveBtnHandler = (event) => {
    let dataObj = {};
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
        url: "/api/cal/getSpecialDaysByMonth.json",
        type: "GET",
        data: {
            year: thisDate.getFullYear(),
            month: thisDate.getMonth() + 1
        },
        success: (res) => {
            const holidayList = res.map(holiday => {
               return holiday["date"] ?
                   {
                       day: holiday["date"][2],
                       name: holiday["dateName"]
                   } :
                   undefined;
            });

            for (let i = 0; i < columnCnt; i++) {
                if (i === 0) {
                    for (let j = firstDayOfMonth - 1; j >= 0; j--) {
                        createCell(lastDaysInMonth - j, "obsolete");
                    }
                    for (let j = firstDayOfMonth; j < 7; j++) {
                        let $cell = null;
                        let isHoliday = holidayList.some(holiday => holiday && holiday.day === dayCounter);

                        if (todayFlag && today.getDate() === dayCounter) {
                            if (isHoliday) {
                                const holiday = holidayList.filter(obj => obj && obj.day === dayCounter);
                                holiday.forEach(holy => {
                                    $cell = createCell(dayCounter, "today", holy.name);
                                });
                            } else {
                                $cell = createCell(dayCounter, "today");
                            }

                            if (selectedDate.getDate() === dayCounter) {
                                $cell.addClass("selected");
                            }
                        } else {
                            if (isHoliday) {
                                const holiday = holidayList.filter(obj => obj && obj.day === dayCounter);
                                holiday.forEach(holy => {
                                    $cell = createCell(dayCounter, "normal", holy.name);
                                });
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
                        if (isHoliday) {
                            $cell.css("color", "red");
                        }

                        dayCounter++;
                    }
                } else {
                    for (let j = 0; j < 7; j++) {
                        let $cell = null;
                        let isHoliday = holidayList.some(holiday => holiday && holiday.day === dayCounter);

                        if (dayCounter <= daysInMonth) {
                            if (todayFlag && today.getDate() === dayCounter) {
                                if (isHoliday) {
                                    const holiday = holidayList.filter(obj => obj && obj.day === dayCounter);
                                    holiday.forEach(holy => {
                                        $cell = createCell(dayCounter, "today", holy.name);
                                    });
                                } else {
                                    $cell = createCell(dayCounter, "today");
                                }

                                if (selectedDate.getDate() === dayCounter) {
                                    $cell.addClass("selected");
                                }
                            } else {
                                if (isHoliday) {
                                    const holiday = holidayList.filter(obj => obj && obj.day === dayCounter);
                                    holiday.forEach(holy => {
                                        $cell = createCell(dayCounter, "normal", holy.name);
                                    });
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
                            if (isHoliday) {
                                $cell.css("color", "red");
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

            res.forEach(job => {
                const $task = $("<div class='task-frame'></div>");
                const $taskCheckBox = $("<input type='checkbox' />");
                $taskCheckBox.on("change", taskCheckHandler);

                const $taskTxt = $("<div class='task-txt'></div>");
                $taskTxt.text(job.content);

                const $delBtn = $("<button type='button' class='del'>삭제</button>");

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

const createCell = (day, kind, holiday) => {
    let $cell = null;

    if (kind === "normal") {
        $cell = $("<div class='cell'></div>");
        $cell.click(onSelectHandler);
    } else if (kind === "obsolete") {
        $cell = $("<div class='obsolete-cell'></div>");
    } else if (kind === "today") {
        $cell = $("<div class='today-cell'></div>");
        $cell.click(onSelectHandler);
    }

    const $cellInner = $("<div class='cell-inner'></div>");
    $cellInner.text(day);

    $cell.append($cellInner);

    if (holiday) {
        const $cellSpecial = $("<div class='cell-special'></div>");
        $cellSpecial.text(holiday);

        $cell.append($cellSpecial);
    }
    $(".calendar-body-frame").append($cell);

    return $cell;
}