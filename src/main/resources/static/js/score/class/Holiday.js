document.write('<script src="/js/score/class/SolarLunarUtil.js"></script>')

class Holiday {
    constructor(solYear) {
        this.holidayMap = {
            1: {1: "새해 첫날"},
            3: {3: "삼일절"},
            5: {5: "어린이날"},
            6: {6: "현충일"},
            8: {15: "광복절"},
            10: {3: "개천절", 9: "한글날"},
            12: {25: "크리스마스"}
        };

        const seallal = this.calculateSeollal(solYear);

        console.log("ss", seallal);
    };

    calculateSeollal(solYear) {
        console.log(SolarLunarUtil.solarToLunar(solYear, '1', '1'));
    };
}