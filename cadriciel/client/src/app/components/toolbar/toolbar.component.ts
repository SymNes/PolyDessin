import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { Subscription } from 'rxjs';
import { Scope } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';
import { SelectionService } from 'src/app/services/tools/selection/selection.service';
import { DrawingTool, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { ColorChoiceComponent } from '../color-choice/color-choice.component';
import { GridOptionsComponent } from '../grid-options/grid-options.component';
import { NewDrawingWarningComponent } from '../new-drawing-warning/new-drawing-warning.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnDestroy {

  primaryScope = Scope.Primary;
  secondaryScope = Scope.Secondary;
  colorPickerPopup: ColorChoiceComponent;

  private newDrawingSubscription: Subscription;

  constructor(public dialog: MatDialog,
              public tools: ToolManagerService,
              public shortcuts: ShortcutsManagerService,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService,
              public selection: SelectionService
             ) {
    this.newDrawingSubscription = shortcuts.newDrawingEmmiter.subscribe((isIgnored: boolean) => {
     if (!isIgnored) { this.warningNewDrawing(); };
    });
  }

  ngOnDestroy() {
    this.newDrawingSubscription.unsubscribe();
    this.shortcuts.newDrawingEmmiter.next(true);
  }

  onClick(tool: DrawingTool) {
    if (this.tools.activeTool.name === 'Selection' && this.selection.selectionBox) {
      this.selection.deleteBoundingBox();
  }
    this.tools.activeTool.isActive = false;
    this.tools.activeTool = tool;
    this.tools.activeTool.isActive = true;
    this.shortcuts.clearOngoingSVG();
  }

  onChange(event: Event, parameterName: string) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.tools.activeTool.parameters[this.tools.findParameterIndex(parameterName)].value = Math.max(Number(eventCast.value), 1);
  }

  selectChoice(event: Event, parameterName: string) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.tools.activeTool.parameters[this.tools.findParameterIndex(parameterName)].chosenOption = eventCast.value;
  }

  disableShortcuts() {
    this.shortcuts.focusOnInput = true;
  }

  enableShortcuts() {
    this.shortcuts.focusOnInput = false;
  }

  warningNewDrawing() {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(NewDrawingWarningComponent, dialogConfig);
  }

  selectColor(scope: string) {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.panelClass = 'fenetre-couleur';
    this.colorPickerPopup = this.dialog.open(ColorChoiceComponent, dialogConfig).componentInstance;
    if (scope === 'principale') {
      this.colorPickerPopup.portee = Scope.Primary;
    }
    if (scope === 'secondaire') {
      this.colorPickerPopup.portee = Scope.Secondary;
    }
    if (scope === 'fond') {
      this.colorPickerPopup.portee = Scope.Background;
    }
  }

  openGridWindow() {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    this.dialog.open(GridOptionsComponent, dialogConfig);
  }

  selectPreviousPrimaryColor(chosenColor: string) {
    this.colorParameter.primaryColor = chosenColor;
  }

  selectPreviousSecondaryColor(chosenColor: string, event: MouseEvent) {
    this.colorParameter.secondaryColor = chosenColor;
    event.preventDefault();
  }

  applyPrimaryOpacity(event: Event) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.colorParameter.primaryOpacity = Math.max(Math.min(Number(eventCast.value), 1), 0);
    this.colorParameter.primaryOpacityDisplayed = Math.round(100 * this.colorParameter.primaryOpacity);
  }

  applySecondaryOpacity(event: Event) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.colorParameter.secondaryOpacity = Math.max(Math.min(Number(eventCast.value), 1), 0);
    this.colorParameter.secondaryOpacityDisplayed = Math.round(100 * this.colorParameter.secondaryOpacity);
  }
}