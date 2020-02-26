import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../outils/line-tool.service';
import { EMPTY_TOOL, DrawingTool } from '../outils/tool-manager.service';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class LineService implements DrawElement {
  SVG: string;
  SVGHtml: SafeHtml;

  points: Point[] = [];
  isSelected = false;

  primaryColor = 'rgba(0,0,0,1)';

  tool: DrawingTool = EMPTY_TOOL;
  thickness: number;
  isAPolygon = false;
  mousePosition = {x: 0, y: 0};

  draw() {
    if (this.tool.parameters[0].value) {
      this.thickness = this.tool.parameters[0].value;
    }
    this.SVG = (this.isAPolygon) ? '<polygon ' : '<polyline ';
    this.SVG += 'fill="none" stroke="' + this.primaryColor + '" stroke-width="' + this.tool.parameters[0].value
    this.SVG += '" points="';
    for (const point of this.points) {
      this.SVG += point.x + ' ' + point.y + ' ';
    }
    if (!this.isAPolygon) {
      this.SVG += this.mousePosition.x + ' ' + this.mousePosition.y;
    }
    this.SVG += '" />';
    if (this.tool.parameters[1].choosenOption === 'Avec points') {
      this.drawPoints();
    }
  }

  drawPoints() {
    if (this.tool.parameters[2].value) {
      if (2 * this.tool.parameters[2].value > this.thickness) {
        this.thickness = 2 * this.tool.parameters[2].value;
    }
  }
    for (const point of this.points) {
      this.SVG += ' <circle cx="' + point.x + '" cy="' + point.y + '" r="'
      + this.tool.parameters[2].value  + '" fill="' + this.primaryColor + '"/>';
    }
  }

  isEmpty() {
    return this.points.length === 0 ||
      (this.points.length === 1 && this.tool.parameters[1].choosenOption === 'Sans points');
  }
}