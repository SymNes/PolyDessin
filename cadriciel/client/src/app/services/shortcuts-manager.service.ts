import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommandManagerService } from './command/command-manager.service';
import { DatabaseService } from './database/database.service';
import { GridService } from './grid/grid.service';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';
import { LineToolService } from './tools/line-tool.service';
import { RectangleToolService } from './tools/rectangle-tool.service';
import { SelectionService } from './tools/selection/selection.service';
import { TOOL_INDEX, ToolManagerService } from './tools/tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ShortcutsManagerService {
  focusOnInput: boolean;

  newDrawingEmmiter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(public tools: ToolManagerService,
              public rectangleTool: RectangleToolService,
              public lineTool: LineToolService,
              public commands: CommandManagerService,
              public selection: SelectionService,
              public SVGStockage: SVGStockageService,
              public grid: GridService,
              private db: DatabaseService
              ) {
                this.focusOnInput = false;
              }

  clearOngoingSVG(): void {
    this.rectangleTool.clear();
    this.lineTool.clear();
  }

  treatInput(keybord: KeyboardEvent): void {
    if (this.focusOnInput) { return; }
    switch (keybord.key) {
      case '1':
        this.selection.deleteBoundingBox();
        this.tools.changeActiveTool(TOOL_INDEX.RECTANGLE);
        this.clearOngoingSVG();
        break;

      case 'a':
        this.selection.deleteBoundingBox();

        if (keybord.ctrlKey) {
          keybord.preventDefault();
          this.tools.changeActiveTool(TOOL_INDEX.SELECTION);
          if (this.SVGStockage.getCompleteSVG().length !== 0) {
            // this.selection.createBoundingBoxAllStockageSVG(this.SVGStockage.getCompleteSVG());
            this.selection.selectedElements = this.SVGStockage.getCompleteSVG();
            this.selection.createBoundingBox();
          }
        } else {this.tools.changeActiveTool(TOOL_INDEX.SPRAY); };
        break;

      case 'c':
        this.selection.deleteBoundingBox();
        this.tools.changeActiveTool(TOOL_INDEX.PENCIL);
        this.clearOngoingSVG();
        break;

      case 'l':
        this.selection.deleteBoundingBox();
        this.tools.changeActiveTool(TOOL_INDEX.LINE);
        this.clearOngoingSVG();
        break;

      case 'w':
        this.selection.deleteBoundingBox();
        this.tools.changeActiveTool(TOOL_INDEX.BRUSH);
        this.clearOngoingSVG();
        break;

      case 's':
        if (keybord.ctrlKey) {
          this.db.sendData();
          if (event) {
            event.preventDefault();
          }
        } else {
          this.selection.deleteBoundingBox();
          this.tools.changeActiveTool(TOOL_INDEX.SELECTION);
          this.clearOngoingSVG();
        }
        break;

      case 'z':
        if (keybord.ctrlKey && !this.commands.drawingInProgress) {
          this.commands.cancelCommand();
        }
        break;

      case 'Z':
        if (keybord.ctrlKey && !this.commands.drawingInProgress) {
          this.commands.redoCommand();
        }
        break;

      case 'Shift':
        if (this.tools.activeTool.ID === TOOL_INDEX.RECTANGLE) {
          this.rectangleTool.shiftPress();
        }
        if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
          this.lineTool.memorizeCursor();
        }
        break;

      case 'o':
        if (keybord.ctrlKey) {
          this.newDrawingEmmiter.next(false);
          this.selection.deleteBoundingBox();
          keybord.preventDefault();
        }
        break;

      case 'Backspace':
        if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
          this.lineTool.retirerPoint();
        }
        break;

      case 'Escape':
        if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
          this.lineTool.clear();
        }
        break;

      case 'g':
        this.grid.showGrid = !this.grid.showGrid;
        break;

      case '+':
        this.grid.increaseSize();
        break;

      case '-':
        this.grid.decreaseSize();
        break;

      default:
        break;
    }
  }

  treatReleaseKey(keybord: KeyboardEvent): void {
    switch (keybord.key) {
      case 'Shift':
        if (this.tools.activeTool.ID === TOOL_INDEX.RECTANGLE) {
          this.rectangleTool.shiftRelease();
        }
        if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
          this.lineTool.shiftRelease();
        }
        break;

      default:
        break;
    }
  }
}
