class BlogUtil {
    static timers = [];
    static isActive = false;

    static timerFn() {
        const target = $(".wp .cursors");

        if (target.hasClass("cursor-visible")) {
            target.removeClass("cursor-visible");
        } else {
            target.addClass("cursor-visible");
        }
    }

    static timerPlayer() {
        let timerId = setTimeout(() => {
            BlogUtil.timerFn();

            BlogUtil.timers.splice(0);
            BlogUtil.timerPlayer();
        }, 450)

        BlogUtil.timers.push(timerId);
    }

    static clearTimerPlayer() {
        for (let i = 0; i < BlogUtil.timers.length; i++) {
            clearTimeout(BlogUtil.timers[i]);
        }
    }
}