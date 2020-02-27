import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material'
import { ColorManagerService, Scope } from 'src/app/services/color/color-manager.service';

@Component({
  selector: 'app-color-choice',
  templateUrl: './color-choice.component.html',
  styleUrls: ['./color-choice.component.scss'],
  providers: [ColorManagerService]
})
export class ColorChoiceComponent  {

  portee: Scope = Scope.Primary;

  constructor(public colorManager: ColorManagerService,
              public dialogRef: MatDialogRef<ColorChoiceComponent>) {}

  closeWindow() {
    this.dialogRef.close();
  }

  applyColor() {
    this.colorManager.applyColor(this.portee);
    this.dialogRef.close();
  }

}
