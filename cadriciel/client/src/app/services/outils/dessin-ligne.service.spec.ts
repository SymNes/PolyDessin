import { TestBed } from '@angular/core/testing';

import { DessinLigneService } from './dessin-ligne.service';
import { INDEX_OUTIL_LIGNE } from './gestionnaire-outils.service';

describe('DessinLigneService', () => {
  let service: DessinLigneService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DessinLigneService));

  beforeEach(() => {
    // service.estClicSimple = true;
    service.curseurX = 0;
    service.curseurY = 0;
    service.positionX = 0;
    service.positionY = 0;
    // Mettre l'outil ligne comme l'outil actif
    service.outils.outilActif = service.outils.listeOutils[INDEX_OUTIL_LIGNE];
  });

  it('should be created', () => {
    const testService: DessinLigneService = TestBed.get(DessinLigneService);
    expect(testService).toBeTruthy();
  });

  // TESTS sourisDeplacee

  it('#sourisDeplacee devrait changer la position en x et en y', () => {
    const clic = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
    service.sourisDeplacee(clic);
    expect(service.curseurX).toBe(100);
    expect(service.curseurY).toBe(100);
  });

  it('#sourisDeplacee devrait appeler shiftEnfonce si shift est enfoncé', () => {
    // on simule un déplacement de souris avec shift enfoncé
    spyOn(service, 'shiftEnfonce');
    service.sourisDeplacee(new MouseEvent('mousemove', { shiftKey: true }));
    // on vérifie que la fonction shiftEnfonce est appele
    expect(service.shiftEnfonce).toHaveBeenCalled();
  });

  it("#sourisDeplacee devrait appeler shiftRelache si shift n'est pas enfoncé", () => {
    // on simule un déplacement de souris avec shift enfoncé
    spyOn(service, 'shiftRelache');
    service.sourisDeplacee(new MouseEvent('mousemove', { shiftKey: false }));
    // on vérifie que la fonction shiftEnfonce est appele
    expect(service.shiftRelache).toHaveBeenCalled();
  });

  // TESTS sourisCliquee

  it('#sourisCliquee devrait rajouter x et y au conteneur Point', () => {
    service.points = [];
    const clic = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.sourisCliquee(clic);
    expect(service.sourisCliquee).not.toBeNull();
  });

  it('#sourisCliquee devrait appeler setTimeout de window', () => {
    spyOn(window, 'setTimeout');
    const clic = new MouseEvent('click', { clientX: 100, clientY: 100 }); //////////////////////////
    service.sourisCliquee(clic);
    expect(window.setTimeout).toHaveBeenCalled();
  });

  it('#sourisCliquee devrait appeler actualiserSVG si setTimeout est appelé', () => {
    spyOn(service, 'actualiserSVG');
    const clic = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.sourisCliquee(clic);
    expect(service.actualiserSVG).toHaveBeenCalled();
  });
});
