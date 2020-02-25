import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { Point } from '../dessin-ligne.service';
import { GestionnaireOutilsService, INDEX_OUTIL_SELECTION } from '../gestionnaire-outils.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionBoxService {

  selectionBox: RectangleService;

  constructor(public outils: GestionnaireOutilsService,
              private sanitizer: DomSanitizer) { }

  createSelectionBox(pointMin: Point, pointMax: Point) {

    this.selectionBox = new RectangleService();

    this.selectionBox.isSelected = true;
    this.selectionBox.tool = this.outils.outilActif;

    this.selectionBox.points[0] = pointMin;
    this.selectionBox.points[1] = pointMax;
    this.selectionBox.secondaryColor =  'rgba(0, 80, 150, 1)';

    this.selectionBox.drawRectangle();
    this.selectionBox.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(this.selectionBox.SVG);
  };

  deleteSelectionBox() {
    if (this.outils.outilActif.ID === INDEX_OUTIL_SELECTION) {
      delete this.selectionBox;
    }
  };
}
