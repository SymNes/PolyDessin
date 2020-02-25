import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ElementDessin } from '../../../../../common/communication/element-dessin';
import { Point } from '../outils/dessin-ligne.service';
import { OUTIL_VIDE, OutilDessin } from '../outils/gestionnaire-outils.service';

@Injectable({
  providedIn: 'root'
})
export class TraitCrayonService implements ElementDessin {
  SVG: string;
  SVGHtml: SafeHtml;
  estSelectionne = false;

  outil: OutilDessin = OUTIL_VIDE;
  epaisseur: number;
  points: Point[] = [];
  estPoint = false;
  couleurPrincipale: string;

  dessiner() {
    if (this.estPoint) {
      this.dessinerPoint();
    } else {
      this.dessinerChemin();
    }
  }

  dessinerChemin() {
    if (this.outil.parametres[0].valeur) {
      this.epaisseur = this.outil.parametres[0].valeur;
    }
    this.SVG = `<path fill="none" stroke="${this.couleurPrincipale}"`
      + 'stroke-linecap="round" stroke-width="' + this.outil.parametres[0].valeur + '" d="';
    for (let i = 0; i < this.points.length; ++i) {
      this.SVG += (i === 0) ? 'M ' : 'L ';
      this.SVG += this.points[i].x + ' ' + this.points[i].y + ' ';
    }
    this.SVG += '" />';
  }

  dessinerPoint() {
    if (this.outil.parametres[0].valeur) {
      this.epaisseur = this.outil.parametres[0].valeur;
      this.SVG = '<circle cx="' + this.points[0].x + '" cy="' + this.points[0].y
        + '" r="' + this.outil.parametres[0].valeur / 2
        + '" fill="' + this.couleurPrincipale + '"/>';
    }
  }
}
