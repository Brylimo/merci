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
}

const onSelectHandler = function(event) {
    const selectedElements = document.querySelectorAll(".calendar-body-frame .selected");

    selectedElements.forEach(element => {
       $(element).removeClass("selected");
    });
    $(this).addClass("selected");
}

const generateCalendar = (date) => {
    $("div").remove(".cell, .obsolete-cell, .today-cell");

    let todayFlag = false;

    const thisDate = date;
    const today = new Date();
    const lastDate = new Date(date);
    lastDate.setMonth(lastDate.getMonth() - 1);

    if (today.getFullYear() === thisDate.getFullYear() && today.getMonth() === thisDate.getMonth()) {
        todayFlag = true;
    }

    const lastDaysInMonth = getDaysInMonth(lastDate.getFullYear(), lastDate.getMonth());
    const daysInMonth = getDaysInMonth(thisDate.getFullYear(), thisDate.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(thisDate.getFullYear(), thisDate.getMonth());

    let dayCounter = 1;
    let nextDayCounter = 1;

    for (let i = 0; i < 5; i++) {
        if (i === 0) {
            for (let j = firstDayOfMonth - 1; j >= 0; j--) {
                createCell(lastDaysInMonth - j, "obsolete");
            }
            for (let j = firstDayOfMonth; j < 7; j++) {
                if (todayFlag && today.getDate() === dayCounter) {
                    const $cell = createCell(dayCounter, "today");

                    if (selectedDate.getDate() === dayCounter) {
                        $cell.addClass("selected");
                    }
                } else {
                    createCell(dayCounter, "normal");
                }
                dayCounter++;
            }
        } else {
            for (let j = 0; j < 7; j++) {
                if (dayCounter <= daysInMonth) {
                    if (todayFlag && today.getDate() === dayCounter) {
                        const $cell = createCell(dayCounter, "today");

                        if (selectedDate.getDate() === dayCounter) {
                            $cell.addClass("selected");
                        }
                    } else {
                        createCell(dayCounter, "normal");
                    }
                    dayCounter++;
                } else {
                    createCell(nextDayCounter, "obsolete");
                    nextDayCounter++
                }
            }
        }
    }
}

const getFirstDayOfMonth = (year, month) => {
    // Get the first day of the month
    return new Date(year, month, 1).getDay();
}

const getDaysInMonth = (year, month) => {
    // Get the number of days in a month;
    return new Date(year, month + 1, 0).getDate();
}

const createCell = (day, kind) => {
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
    $(".calendar-body-frame").append($cell);

    return $cell;
}