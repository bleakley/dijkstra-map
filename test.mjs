import DijkstraMap from './dijkstraMap.mjs';

let map = new DijkstraMap(
    {
        x: {
            min: 0,
            max: 40
        },
        y: {
            min: 0,
            max: 40
        },
    },
    (x, y) => !(x === 18),
    (x, y) => y === 20 && x === 5
);

for (let i = 0; i < 40; i++) {
    let row = [];
    for (let j = 0; j < 40; j++) {
        let value = Math.floor(map.valueAtInverted(i, j));
        row.push(value > 9 || value < -50 ? 'X' : value);
    }
    console.log(row.join(''));
}