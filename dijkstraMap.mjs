const DEFAULT_VALUE = Number.MAX_SAFE_INTEGER;

const gridAdjacency = function(x, y) {
    return [
        { x: x - 1, y: y - 1 },
        { x: x, y: y - 1 },
        { x: x + 1, y: y - 1 },
        { x: x - 1, y: y },
        { x: x + 1, y: y },
        { x: x - 1, y: y + 1 },
        { x: x, y: y + 1 },
        { x: x + 1, y: y + 1 }
    ];
}

export default class DijkstraMap {

    constructor(bounds, isPassable, isGoal, adjacencyFunction=gridAdjacency) {
        this.stale = true;
        this.inverseStale = true;
        this.fleeCoefficient = -1.2;
        this.minX = bounds.x.min;
        this.minY = bounds.y.min;
        this.maxX = bounds.x.max;
        this.maxY = bounds.y.max;
        this.adjacencyFunction = adjacencyFunction;
        this.isPassable = isPassable;
        this.isGoal = isGoal;

        this.height = this.maxY - this.minY;
        this.width = this.maxX - this.minX;
    }

    markAsStale() {
        this.stale = true;
        this.inverseStale = true;
    }

    valueAt(x, y) {
        if (this.stale) {
            this._generateMap();
        }
        return this._valueAt(x - this.minX, y - this.minY);
    }

    valueAtInverted(x, y) {
        if (this.inverseStale) {
            this._generateMapInverted();
        }
        return this._valueAtInverted(x - this.minX, y - this.minY);
    }

    _valueAt(x, y) {
        if (!this.isPassable(x, y)) {
            return DEFAULT_VALUE;
        }
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return DEFAULT_VALUE;
        }
        return this.map[x][y];
    }

    _valueAtInverted(x, y) {
        if (!this.isPassable(x, y)) {
            return DEFAULT_VALUE;
        }
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return DEFAULT_VALUE;
        }
        return this.mapInverted[x][y];
    }

    _valueOfLowestNeighbor(x, y) {
        return Math.min(...this.adjacencyFunction(x, y).map(p => this._valueAt(p.x, p.y)));
    }

    _valueOfLowestNeighborInverted(x, y) {
        return Math.min(...this.adjacencyFunction(x, y).map(p => this._valueAtInverted(p.x, p.y)));
    }

    _generateMap() {
        this.map = [];
        for (let i = 0; i < this.width; i++) {
            this.map[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.map[i][j] = this.isGoal(i, j) ? 0 : DEFAULT_VALUE;
            }
        }

        let anyTileUpdated;

        do {
            anyTileUpdated = false;
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    if (!this.isPassable(i, j)) {
                        continue;
                    }
                    let lowestNeighbor = this._valueOfLowestNeighbor(i, j);
                    if (lowestNeighbor < this.map[i][j] - 1) {
                        anyTileUpdated = true;
                        this.map[i][j] = lowestNeighbor + 1;
                    }
                }
            }
        } while (anyTileUpdated)
        this.stale = false;
    }

    _generateMapInverted() {
        if (this.stale) {
            this._generateMap();
        }

        this.mapInverted = [];
        for (let i = 0; i < this.width; i++) {
            this.mapInverted[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.mapInverted[i][j] = this.map[i][j] * this.fleeCoefficient;
            }
        }

        let anyTileUpdated;

        do {
            anyTileUpdated = false;
            for (let i = 0; i < this.width; i++) {
                for (let j = 0; j < this.height; j++) {
                    if (!this.isPassable(i, j)) {
                        continue;
                    }
                    let lowestNeighbor = this._valueOfLowestNeighborInverted(i, j);
                    if (lowestNeighbor < this.mapInverted[i][j] - 1) {
                        anyTileUpdated = true;
                        this.mapInverted[i][j] = lowestNeighbor + 1;
                    }
                }
            }
        } while (anyTileUpdated)
        this.inverseStale = false;
    }

}