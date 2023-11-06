class LineObj {
    constructor(width, firstIdx, count = 0) {
        this.width = width;
        this.firstIdx = firstIdx;
        this.count = count;
        this.status = "unsettle"  // 2 status values : unsettle & settle, default : unsettle
    }
}