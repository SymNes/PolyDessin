import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Point } from '../outils/line-tool.service';
import { DrawingTool, EMPTY_TOOL } from '../outils/tool-manager.service';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class RectangleService implements DrawElement {
  SVG: string;
  SVGHtml: SafeHtml;

  points: Point[] = [{x: 0, y: 0},    // points[0], coin haut gauche (base)
                     {x: 0, y: 0}];   // points[1], coin bas droite
  isSelected = false;

  primaryColor: string;
  secondaryColor: string;

  thickness: number;
  perimeter: string;
  isDotted: boolean;

  tool: DrawingTool = EMPTY_TOOL;
  width = 0;
  height = 0;

  getWidth(): number {
    return Math.abs(this.points[1].x - this.points[0].x);
  };

  getHeight(): number {
    return Math.abs(this.points[1].y - this.points[0].y);
  };

  draw() {
    if ((this.getWidth() === 0 || this.getHeight() === 0)
      && this.tool.parameters[1].choosenOption !== 'Plein') {
      this.drawLine();
    } else {
      this.drawRectangle();
    }
    this.drawPerimeter();
  }

  drawLine() {
    if (this.tool.parameters[0].value) {
      this.thickness = this.tool.parameters[0].value;
    }

    this.SVG = '<line stroke-linecap="square'
      + '" stroke="' + this.secondaryColor
      + '" stroke-width="' + this.tool.parameters[0].value
      + (this.isDotted ? '"stroke-dasharray="4, 4"'  : '')
      + '" x1="' + this.points[0].x + '" y1="' + this.points[0].y
      + '" x2="' + (this.points[0].x + this.getWidth())
      + '" y2="' + (this.points[0].y + this.getHeight()) + '"/>';
  }

  drawRectangle() {
    const choosedOption = this.tool.parameters[1].choosenOption;
    this.SVG = '<rect fill="'
      + ((choosedOption !== 'Contour') ? this.primaryColor : 'none')
      + '" stroke="' + ((choosedOption !== 'Plein') ? this.secondaryColor : 'none')
      + (this.isDotted ? '"stroke-dasharray="4, 4"'  : '')
      + '" stroke-width="' + this.tool.parameters[0].value
      + '" x="' + this.points[0].x + '" y="' + this.points[0].y
      + '" width="' + this.getWidth() + '" height="' + this.getHeight() + '"/>';
  }

  drawPerimeter() {
    if (this.tool.parameters[1].choosenOption === 'Plein') {
      this.thickness = 0;
    } else if (this.tool.parameters[0].value) {
      this.thickness = this.tool.parameters[0].value;
    }
    const thickness = (this.tool.parameters[0].value) ? this.tool.parameters[0].value : 0;
    this.perimeter = '<rect stroke="gray" fill="none" stroke-width="2' + (this.isDotted ? '"stroke-dasharray="4, 4"'  : '');
    if (this.tool.parameters[1].choosenOption === 'Plein') {
      this.perimeter += '" x="' + this.points[0].x + '" y="' + this.points[0].y
        + '" height="' + this.getHeight() + '" width="' + this.getWidth() + '"/>';
    } else {
      this.perimeter += '" x="' + (this.points[0].x - thickness / 2)
        + '" y="' + (this.points[0].y - thickness / 2);
      this.perimeter += '" height="' + ((this.getHeight() === 0) ? thickness : (this.getHeight() + thickness))
        + '" width="' + ((this.getWidth() === 0) ? thickness : (this.getWidth() + thickness)) + '"/>';
    }
  }
}