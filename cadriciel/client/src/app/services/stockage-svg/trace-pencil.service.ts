import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../tools/line-tool.service';
import { DrawingTool, EMPTY_TOOL } from '../tools/tool-manager.service';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class TracePencilService implements DrawElement {
  SVG: string;
  SVGHtml: SafeHtml;

  points: Point[];
  isSelected: boolean;

  tool: DrawingTool;
  thickness: number;

  isAPoint: boolean;
  primaryColor: string;

  pointMin: Point;
  pointMax: Point;

  translate: Point;

  constructor() {
    this.SVGHtml = '';
    this.points = [];
    this.isSelected = false;
    this.tool = EMPTY_TOOL;
    this.isAPoint = false;
    this.pointMin = {x: 0 , y: 0};
    this.pointMax = {x: 0 , y: 0};
    this.translate = { x: 0, y: 0};
  }

  draw(): void {
    if (!this.isSelected) {
      this.thickness = (this.tool.parameters[0].value) ? this.tool.parameters[0].value : 1;
    }

    if (this.isAPoint) {
      this.drawPoint();
    } else {
      this.drawPath();
    }
  }

  drawPath(): void {
    this.SVG = '<path transform ="translate(' + this.translate.x + ' ' + this.translate.y + `)" fill="none" stroke="${this.primaryColor}"`
      + 'stroke-linecap="round" stroke-width="' + this.thickness + '" d="';
    for (let i = 0; i < this.points.length; ++i) {
      this.SVG += (i === 0) ? 'M ' : 'L ';
      this.SVG += this.points[i].x + ' ' + this.points[i].y + ' ';
    }
    this.SVG += '" />';
  }

  drawPoint(): void {
    this.SVG = '<circle transform ="translate(' + this.translate.x + ' ' + this.translate.y +
      ')"cx="' + this.points[0].x + '" cy="' + this.points[0].y+ '" r="' + this.thickness / 2
      + '" fill="' + this.primaryColor + '"/>';
  }

  updatePosition(x: number, y: number): void {
    this.translate.x += x;
    this.translate.y += y;
    this.draw();
  }

  updatePositionMouse(mouse: MouseEvent, mouseClick: Point): void {
    this.translate.x = mouse.offsetX - mouseClick.x;
    this.translate.y = mouse.offsetY - mouseClick.y;
    this.draw();
  }

  translateAllPoints(): void {
    for (const point of this.points) {
      point.x += this.translate.x;
      point.y += this.translate.y;
    }
    this.translate = {x: 0, y: 0};
  }
}
