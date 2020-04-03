import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';
import { NewDrawingWindowComponent } from '../new-drawing-window/new-drawing-window.component';

@Component({
  selector: 'app-new-drawing-warning',
  templateUrl: './new-drawing-warning.component.html',
  styleUrls: ['./new-drawing-warning.component.scss']
})
export class NewDrawingWarningComponent {

  constructor(private dialog: MatDialog,
              private shortcuts: ShortcutsManagerService,
              private dialogRef: MatDialogRef<NewDrawingWindowComponent> ) {
   }

  cancel(): void {
    this.shortcuts.focusOnInput = false;
    this.dialogRef.close();
  }

  openParameter(): void {
    this.dialogRef.close();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(NewDrawingWindowComponent, dialogConfig);
  }
}
