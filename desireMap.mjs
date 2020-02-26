export default class DesireMap {

    constructor() {
        this.dijkstraMaps = [];
        this.desires = [];
    }

    setDesire(map, desire) {
        let index = this.dijkstraMaps.indexOf(map);
        if (index === -1) {
            this.dijkstraMaps.push(map);
            this.desires.push(desire);
        } else {
            this.desires[index] = desire;
        }
    }

    valueAt(x, y) {
        let total = 0;
        for (let i = 0; i < this.desires.length; i++) {
            let desire = this.desires[i];
            let map = this.dijkstraMaps[i];
            if (desire > 0) {
                total += map.valueAt(x, y);
            } else if (desire < 0) {
                total += map.valueAtInverted(x, y);
            }
        }
        return total;
    }
}