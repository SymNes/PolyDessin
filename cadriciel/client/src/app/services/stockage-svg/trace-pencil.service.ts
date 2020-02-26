import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../outils/line-tool.service';
import { EMPTY_TOOL, DrawingTool } from '../outils/tool-manager.service';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class TracePencilService implements DrawElement {
  SVG: string;
  SVGHtml: SafeHtml;

  points: Point[] = [];
  isSelected = false;

  tool: DrawingTool = EMPTY_TOOL;
  thickness: number;

  isAPoint = false;
  primaryColor: string;

  draw() {
    if (this.isAPoint) {
      this.drawPoint();
    } else {
      this.drawPath();
    }
  }

  drawPath() {
    if (this.tool.parameters[0].value) {
      this.thickness = this.tool.parameters[0].value;
    }
    this.SVG = `<path fill="none" stroke="${this.primaryColor}"`
      + 'stroke-linecap="round" stroke-width="' + this.tool.parameters[0].value + '" d="';
    for (let i = 0; i < this.points.length; ++i) {
      this.SVG += (i === 0) ? 'M ' : 'L ';
      this.SVG += this.points[i].x + ' ' + this.points[i].y + ' ';
    }
    this.SVG += '" />';
  }

  drawPoint() {
    if (this.tool.parameters[0].value) {
      this.thickness = this.tool.parameters[0].value;
      this.SVG = '<circle cx="' + this.points[0].x + '" cy="' + this.points[0].y
        + '" r="' + this.tool.parameters[0].value / 2
        + '" fill="' + this.primaryColor + '"/>';
    }
  }
}