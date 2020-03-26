import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { ExportWindowComponent } from '../components/export-window/export-window.component';
import { GalleryComponent } from '../components/gallery/gallery.component';
import { SavePopupComponent } from '../components/save-popup/save-popup.component';
import { CommandManagerService } from './command/command-manager.service';
import { TranslateSvgService } from './command/translate-svg.service';
import { GridService } from './grid/grid.service';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';
import { EllipseToolService } from './tools/ellipse-tool.service';
import { EraserToolService } from './tools/eraser-tool.service';
import { LineToolService, Point } from './tools/line-tool.service';
import { RectangleToolService } from './tools/rectangle-tool.service';
import { SelectionService } from './tools/selection/selection.service';
import { TOOL_INDEX, ToolManagerService } from './tools/tool-manager.service';

type FunctionShortcut = (keyboard?: KeyboardEvent ) => void;

const SELECTION_MOVEMENT_PIXEL = 3;
const MOVEMENT_DELAY_MS = 100;
const CONTINUOUS_MOVEMENT = 5;

@Injectable({
  providedIn: 'root'
})

export class ShortcutsManagerService {
  focusOnInput: boolean;
  private shortcutManager: Map<string, FunctionShortcut > = new Map<string, FunctionShortcut>();
  private counter100ms: number;
  private clearTimeout: number;

  private leftArrow: boolean;
  private rightArrow: boolean;
  private upArrow: boolean;
  private downArrow: boolean;

  private dialogConfig: MatDialogConfig;

  newDrawingEmmiter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private tools: ToolManagerService,
              private rectangleTool: RectangleToolService,
              private ellipseTool: EllipseToolService,
              private lineTool: LineToolService,
              private commands: CommandManagerService,
              private selection: SelectionService,
              private stockageSVG: SVGStockageService,
              private grid: GridService,
              private dialog: MatDialog,
              private sanitizer: DomSanitizer,
              private eraser: EraserToolService
              ) {
                this.focusOnInput = false;
                this.counter100ms = 0;
                this.clearTimeout = 0;
                this.leftArrow = false;
                this.rightArrow = false;
                this.upArrow = false;
                this.downArrow = false;
                this.dialogConfig = new MatDialogConfig();
                this.dialogConfig.disableClose = true;
                this.dialogConfig.autoFocus = true;
                this.dialogConfig.width = '80%';
                this.shortcutManager.set('1', this.shortcutKey1.bind(this))
                                    .set('2', this.shortcutKey2.bind(this))
                                    .set('3', this.shortcutKey3.bind(this))
                                    .set('a', this.shortcutKeyA.bind(this))
                                    .set('c', this.shortcutKeyC.bind(this))
                                    .set('e', this.shortcutKeyE.bind(this))
                                    .set('i', this.shortcutKeyI.bind(this))
                                    .set('l', this.shortcutKeyL.bind(this))
                                    .set('w', this.shortcutKeyW.bind(this))
                                    .set('r', this.shortcutKeyR.bind(this))
                                    .set('s', this.shortcutKeyS.bind(this))
                                    .set('z', this.shortcutKeyZ.bind(this))
                                    .set('Z', this.shortcutKeyUpperZ.bind(this))
                                    .set('Shift', this.shortcutKeyShift.bind(this))
                                    .set('o', this.shortcutKeyO.bind(this))
                                    .set('Backspace', this.shortcutKeyBackSpace.bind(this))
                                    .set('Escape', this.shortcutKeyEscape.bind(this))
                                    .set('g', this.shortcutKeyG.bind(this))
                                    .set('+', this.shortcutKeyPlus.bind(this))
                                    .set('-', this.shortcutKeyMinus.bind(this))
                                    .set('ArrowLeft', this.shortcutKeyArrowLeft.bind(this))
                                    .set('ArrowRight', this.shortcutKeyArrowRight.bind(this))
                                    .set('ArrowDown', this.shortcutKeyArrowDown.bind(this))
                                    .set('ArrowUp', this.shortcutKeyArrowUp.bind(this));
              }

  updatePositionTimer(): void {
    if (this.selection.selectionBox.selectionBox) {
      if (!this.leftArrow && !this.rightArrow && !this.upArrow && !this.downArrow) {
        window.clearInterval(this.clearTimeout);
        this.counter100ms = 0;
        this.clearTimeout = 0;
        if (this.selection.hasMoved()) {
          this.commands.execute(new TranslateSvgService(
            this.selection.selectedElements,
            this.selection.selectionBox,
            this.sanitizer,
            this.selection.deleteBoundingBox));
        }

      } else if (this.clearTimeout === 0) {
        this.translateSelection();
        this.clearTimeout = window.setInterval(this.translateSelection.bind(this), MOVEMENT_DELAY_MS);
      }
    }
  }

  translateSelection(): void {
    const translate: Point = {x: 0 , y: 0};

    if (this.leftArrow) {
      translate.x = -SELECTION_MOVEMENT_PIXEL;
    }

    if (this.rightArrow) {
      translate.x = SELECTION_MOVEMENT_PIXEL;
    }

    if (this.upArrow) {
      translate.y = -SELECTION_MOVEMENT_PIXEL;
    }

    if (this.downArrow) {
      translate.y = SELECTION_MOVEMENT_PIXEL;
    }

    this.counter100ms++;
    if (this.counter100ms <= 1) {
      this.selection.updatePosition(translate.x , translate.y);
    }
    if (this.counter100ms > CONTINUOUS_MOVEMENT) {
      this.selection.updatePosition(translate.x , translate.y);
    }
  }

  treatInput(keyboard: KeyboardEvent): void {
    if (this.focusOnInput) { return; }
    if (this.shortcutManager.has(keyboard.key)) {
      keyboard.preventDefault();
      (this.shortcutManager.get(keyboard.key) as FunctionShortcut)(keyboard);
    }
    this.updatePositionTimer();
  }

  clearOngoingSVG(): void {
    this.selection.deleteBoundingBox();
    this.rectangleTool.clear();
    this.lineTool.clear();
    this.eraser.clear();
  }

  // SHORTCUT FUNCTIONS

  shortcutKey1(): void {
    this.tools.changeActiveTool(TOOL_INDEX.RECTANGLE);
    this.clearOngoingSVG();
  }

  shortcutKey2(): void {
    this.tools.changeActiveTool(TOOL_INDEX.ELLIPSE);
    this.clearOngoingSVG();
  }

  shortcutKey3(): void {
    this.tools.changeActiveTool(TOOL_INDEX.POLYGON);
    this.clearOngoingSVG();
  }

  shortcutKeyA(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this.selection.deleteBoundingBox();
      this.tools.changeActiveTool(TOOL_INDEX.SELECTION);
      if (this.stockageSVG.getCompleteSVG().length !== 0) {
        for (const element of this.stockageSVG.getCompleteSVG()) {
          element.isSelected = true;
          this.selection.selectedElements.push(element);
        }
        this.selection.createBoundingBox();
      }
    } else { this.tools.changeActiveTool(TOOL_INDEX.SPRAY); }

  }

  shortcutKeyC(): void {
    this.tools.changeActiveTool(TOOL_INDEX.PENCIL);
    this.clearOngoingSVG();
  }

  shortcutKeyE(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this.focusOnInput = true;
      this.selection.deleteBoundingBox();
      this.dialog.open(ExportWindowComponent, this.dialogConfig).afterClosed().subscribe(() => { this.focusOnInput = false; });
    } else {
      this.tools.changeActiveTool(TOOL_INDEX.ERASER);
      this.clearOngoingSVG();
    }
  }

  shortcutKeyI(): void {
    this.tools.changeActiveTool(TOOL_INDEX.PIPETTE);
    this.clearOngoingSVG();
  }

  shortcutKeyL(): void {
    this.tools.changeActiveTool(TOOL_INDEX.LINE);
    this.clearOngoingSVG();
  }

  shortcutKeyW(): void {
    this.tools.changeActiveTool(TOOL_INDEX.BRUSH);
    this.clearOngoingSVG();
  }

  shortcutKeyR(): void {
    this.tools.changeActiveTool(TOOL_INDEX.COLOR_CHANGER);
    this.clearOngoingSVG();
  }

  shortcutKeyS(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this.focusOnInput = true;
      this.selection.deleteBoundingBox();
      this.dialog.open(SavePopupComponent, this.dialogConfig).afterClosed().subscribe(() => { this.focusOnInput = false; });
    } else {
      this.tools.changeActiveTool(TOOL_INDEX.SELECTION);
      this.clearOngoingSVG();
    }
  }

  shortcutKeyZ(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey && !this.commands.drawingInProgress) {
      this.commands.cancelCommand();
    }
  }

  shortcutKeyUpperZ(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey && !this.commands.drawingInProgress) {
      this.commands.redoCommand();
    }
  }

  shortcutKeyShift(): void {
    switch (this.tools.activeTool.ID) {
      case TOOL_INDEX.RECTANGLE:
        this.rectangleTool.shiftPress();
        break;
      case TOOL_INDEX.LINE:
        this.lineTool.memorizeCursor();
        break;
      case TOOL_INDEX.ELLIPSE:
        this.ellipseTool.shiftPress();
        break;
    }
  }

  shortcutKeyO(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this.newDrawingEmmiter.next(false);
      this.selection.deleteBoundingBox();
    }
  }

  shortcutKeyBackSpace(): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
      this.lineTool.removePoint();
    }
  }

  shortcutKeyEscape(): void {
    if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
      this.lineTool.clear();
    }
  }

  shortcutKeyG(keyboard: KeyboardEvent): void {
    if (keyboard.ctrlKey) {
      this.focusOnInput = true;
      this.selection.deleteBoundingBox();
      this.dialog.open(GalleryComponent, this.dialogConfig).afterClosed().subscribe(() => { this.focusOnInput = false; });
    } else { this.grid.showGrid = !this.grid.showGrid; }
  }

  shortcutKeyPlus(): void {
    this.grid.increaseSize();
  }

  shortcutKeyMinus(): void {
    this.grid.decreaseSize();
  }

  shortcutKeyArrowLeft(): void {
    this.leftArrow = true;
  }

  shortcutKeyArrowRight(): void {
    this.rightArrow = true;
  }

  shortcutKeyArrowUp(): void {
    this.upArrow = true;
  }

  shortcutKeyArrowDown(): void {
    this.downArrow = true;
  }

  treatReleaseKey(keyboard: KeyboardEvent): void {
    switch (keyboard.key) {
      case 'Shift':
        if (this.tools.activeTool.ID === TOOL_INDEX.RECTANGLE) {
          this.rectangleTool.shiftRelease();
        }
        if (this.tools.activeTool.ID === TOOL_INDEX.LINE) {
          this.lineTool.shiftRelease();
        }
        if (this.tools.activeTool.ID === TOOL_INDEX.ELLIPSE) {
          this.ellipseTool.shiftRelease();
        }
        break;

      case 'ArrowLeft':
        this.leftArrow = false;
        break;

      case 'ArrowRight':
        this.rightArrow = false;
        break;

      case 'ArrowDown':
        this.downArrow = false;
        break;

      case 'ArrowUp':
        this.upArrow = false;
        break;

      default:
        break;
    }
    this.updatePositionTimer();
  }
}
