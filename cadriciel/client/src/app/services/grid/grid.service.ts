import { Injectable } from '@angular/core';
import { DrawingManagerService } from '../drawing-manager/drawing-manager.service';

export const MAX_CELL_SIZE = 500;
export const MIN_CELL_SIZE = 5;
const INITIAL_CELL_SIZE = 50;
const INITIAL_OPACITY = 0.75;
const SIZE_VARIATION = 5;

export interface Line {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

@Injectable({
  providedIn: 'root'
})
export class GridService {

  showGrid: boolean;
  cellSize: number;
  opacity: number;

  constructor(private drawing: DrawingManagerService) {
    this.showGrid = false;
    this.cellSize = INITIAL_CELL_SIZE;
    this.opacity = INITIAL_OPACITY;
  }

  increaseSize(): void {
    this.cellSize += SIZE_VARIATION - (this.cellSize % SIZE_VARIATION);
    if (this.cellSize > MAX_CELL_SIZE) {
      this.cellSize = MAX_CELL_SIZE;
    }
  }

  decreaseSize(): void {
    this.cellSize -= (this.cellSize % SIZE_VARIATION === 0) ? SIZE_VARIATION : this.cellSize % SIZE_VARIATION;
    if (this.cellSize < MIN_CELL_SIZE) {
      this.cellSize = MIN_CELL_SIZE;
    }
  }

  getColor(): string  {
    return 'rgba(0, 0, 0, ' + this.opacity + ')';
  }

  getLines(): Line[] {
    const lines: Line[] = [];
    if (this.showGrid) {
      for (let x = this.cellSize; x < this.drawing.width; x += this.cellSize) {
        lines.push({x1: x, x2: x, y1: 0, y2: this.drawing.height});
      }
      for (let y = this.cellSize; y < this.drawing.height; y += this.cellSize) {
        lines.push({x1: 0, x2: this.drawing.width, y1: y, y2: y});
      }
    }
    return lines;
  }
}
