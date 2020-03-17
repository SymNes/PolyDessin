import { TestBed } from '@angular/core/testing';

import { AddSVGService } from '../command/add-svg.service';
import { EllipseService } from '../stockage-svg/ellipse.service';
import { EllipseToolService } from './ellipse-tool.service';

// tslint:disable: no-magic-numbers

describe('EllipseToolService', () => {
  let service: EllipseToolService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(EllipseToolService));
  beforeEach(() => {
    service.initial.x = 0;
    service.initial.y = 0;
    service.commands.drawingInProgress = true;
  });
  // Mettre l'outil de rectangle comme l'outil actif
  beforeEach(() => {
    service.tools.activeTool = service.tools.toolList[8];
    service.tools.activeTool.parameters[1].chosenOption = 'Contour';
    service.tools.activeTool.parameters[0].value = 5;
  });

  it('should be created', () => {
    const testService: EllipseToolService = TestBed.get(EllipseToolService);
    expect(testService).toBeTruthy();
  });

  // TESTS onMouseMove

  it('#onMouseMove ne devrait rien faire si commandes.drawingInProgress est faux', () => {
    service.commands.drawingInProgress = false;
    spyOn(service, 'shiftPress');
    spyOn(service, 'shiftRelease');
    // on simule un déplacement de souris quelconque
    service.onMouseMove(new MouseEvent('mousemove'));
    expect(service.shiftPress).not.toHaveBeenCalled();
    expect(service.shiftRelease).not.toHaveBeenCalled();
  });
  it('#onMouseMove devrait calculer la width et la height', () => {
    // on simule un mouvement de 50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.onMouseMove(evenement);
    // on vérifie que la width et la height ont les bonnes valeurs
    expect(service.calculatedHeight).toBe(50);
    expect(service.calculatedHeight).toBe(50);
  });
  it('#onMouseMove devrait calculer correctement la width et la height '
    + 'pour un déplacement avec des valeurs négatives', () => {
    // on simule un mouvement de -50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: -50, clientY: -50 });
    service.onMouseMove(evenement);
    // on vérifie que la width et la height ont les bonnes valeurs
    expect(service.calculatedHeight).toBe(50);
    expect(service.calculatedHeight).toBe(50);
  });
  it('#onMouseMove devrait calculer la base en X et en Y', () => {
    // on simule un mouvement de 50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.onMouseMove(evenement);
    // on vérifie que les coordonnées de la base ont les bonnes valeurs
    expect(service.calculatedBase.x).toBe(0);
    expect(service.calculatedBase.y).toBe(0);
  });
  it('#onMouseMove devrait calculer correctement la base en X et en Y '
    + 'pour un déplacement avec des valeurs négatives', () => {
    // on simule un mouvement de -50 en x et en y
    const evenement = new MouseEvent('mousemove', { clientX: -50, clientY: -50 });
    service.onMouseMove(evenement);
    // on vérifie que les coordonnées de la base ont ont les bonnes valeurs
    expect(service.calculatedBase.x).toBe(-50);
    expect(service.calculatedBase.y).toBe(-50);
  });
  it('#onMouseMove devrait former un carré si shift est enfoncé', () => {
    // on simule un déplacement de souris avec shift enfoncé
    spyOn(service, 'shiftPress');
    service.onMouseMove(new MouseEvent('mousemove', { shiftKey: true }));
    // on vérifie que la fonction pour former un carré a été appelée
    expect(service.shiftPress).toHaveBeenCalled();
  });
  it("#onMouseMove devrait former un rectangle (ou une ligne) si shift n'est pas enfoncé", () => {
    // on simule un déplacement de souris sans shift enfoncé
    spyOn(service, 'shiftRelease');
    service.onMouseMove(new MouseEvent('mousemove', { shiftKey: false }));
    // on vérifie que la fonction pour former un rectangle a été appelée
    expect(service.shiftRelease).toHaveBeenCalled();
  });

  // TESTS shiftRelease

  it('#shiftRelease ne devrait rien faire si commandes.drawingInProgress est faux', () => {
    service.commands.drawingInProgress = false;
    spyOn(service, 'refreshSVG');
    service.shiftRelease();
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });
  it('#shiftRelease devrait actualiser la height du rectangle si commandes.drawingInProgress est vrai', () => {
    service.calculatedHeight = 1;
    service.shiftRelease();
    expect(service.ellipse.getHeight()).toEqual(1);
  });
  it('#shiftRelease devrait actualiser la width du rectangle si commandes.drawingInProgress est vrai', () => {
    service.calculatedWidth = 2;
    service.shiftRelease();
    expect(service.ellipse.getWidth()).toEqual(2);
  });

  it('#shiftRelease devrait actualise le SVG si commandes.drawingInProgress est vrai', () => {
    spyOn(service, 'refreshSVG');
    service.shiftRelease();
    expect(service.refreshSVG).toHaveBeenCalled();
  });

  // TESTS shiftPress

  it('#shiftPress ne devrait rien faire si commandes.drawingInProgress est faux', () => {
    service.commands.drawingInProgress = false;
    spyOn(service, 'refreshSVG');
    service.shiftPress();
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });
  it('#shiftPress devrait actualise le SVG si commandes.drawingInProgress est faux', () => {
    spyOn(service, 'refreshSVG');
    service.shiftPress();
    expect(service.refreshSVG).toHaveBeenCalled();
  });
  it('#shiftPress devrait corriger la width si elle est plus grande '
    + 'que la height', () => {
    service.calculatedWidth = 100;
    service.calculatedHeight = 50;
    service.shiftPress();
    expect(service.ellipse.getWidth()).toBe(50);
  });
  it('#shiftPress ne devrait pas corriger la width si elle est plus petite '
    + 'que la height', () => {
    service.calculatedWidth = 50;
    service.calculatedHeight = 100;
    service.shiftPress();
    expect(service.ellipse.getWidth()).toBe(50);
  });
  it('#shiftPress devrait corriger la height si elle est plus grande '
    + 'que la width', () => {
    service.calculatedWidth = 50;
    service.calculatedHeight = 100;
    service.shiftPress();
    expect(service.ellipse.getHeight()).toBe(50);
  });
  it('#shiftPress ne devrait pas corriger la height si elle est plus petite '
    + 'que la width', () => {
    service.calculatedWidth = 100;
    service.calculatedHeight = 50;
    service.shiftPress();
    expect(service.ellipse.getHeight()).toBe(50);
  });
  it('#shiftPress devrait assigner calculatedBase.y au point intial en y du rectangle '
    + 'si calculatedBase.y égal au point initial du clic en y', () => {
    service.initial.y = 10;
    service.calculatedBase.y = service.initial.y;
    service.shiftPress();
    expect(service.ellipse.points[0].y).toBe(10);
  });
  it('#shiftPress devrait assigner calculatedBase.x au point intial en x du rectangle '
    + 'si calculatedBase.x égal au point initial du clic en x', () => {
    service.initial.x = 10;
    service.calculatedBase.x = service.initial.x;
    service.shiftPress();
    expect(service.ellipse.points[0].x).toBe(10);
  });
  it('#shiftPress devrait calculer le point en y au point intial en y du rectangle '
    + 'si calculatedBase.y n\'égal pas au point initial du clic en y', () => {
    service.initial.y = 10;
    service.calculatedBase.y = 100;
    service.calculatedHeight = 50;
    service.calculatedWidth = 25;
    const calculated = service.initial.y - service.calculatedWidth;
    service.shiftPress();
    expect(service.ellipse.points[0].y).toEqual(calculated);
  });
  it('#shiftPress devrait calculer le point en x au point intial en x du rectangle '
    + 'si calculatedBase.x n\'égal pas au point initial du clic en x', () => {
      service.initial.x = 10;
      service.calculatedBase.x = 100;
      service.calculatedHeight = 25;
      service.calculatedWidth = 50;
      const calculated = service.initial.x - service.calculatedHeight;
      service.shiftPress();
      expect(service.ellipse.points[0].x).toEqual(calculated);
  });

  // TESTS refreshSVG
  it('#refreshSVG devrait appeler updateParameters avec l\'outil en cours', () => {
    spyOn(service.ellipse, 'updateParameters');
    service.refreshSVG();
    expect(service.ellipse.updateParameters).toHaveBeenCalledWith(service.tools.activeTool);
  });
  it('#refreshSVG devrait appeler getPrimaryColor', () => {
    service.refreshSVG();
    expect(service.ellipse.primaryColor).toEqual(service.colorParameter.getPrimaryColor());
  });
  it('#refreshSVG devrait appeler getSecondaryColor', () => {
    service.refreshSVG();
    expect(service.ellipse.secondaryColor).toEqual(service.colorParameter.getSecondaryColor());
  });
  it('#refreshSVG devrait appeler draw', () => {
    spyOn(service.ellipse, 'draw');
    service.refreshSVG();
    expect(service.ellipse.draw).toHaveBeenCalled();
  });
  it('#refreshSVG devrait appeler setOngoingSVG', () => {
    spyOn(service.stockageSVG, 'setOngoingSVG');
    service.refreshSVG();
    expect(service.stockageSVG.setOngoingSVG).toHaveBeenCalledWith(service.ellipse);
  });

  // TESTS onMousePress

  it("#onMousePress devrait avoir commandes.drawingInProgress vrai apres un clic s'il est deja vrai", () => {
      // on effectue un clic dans cette fonction
      service.onMousePress(new MouseEvent('onclick'));
      // on vérifie que la fonction ne fait rien puisque rectangle est deja vrai
      expect(service.commands.drawingInProgress).toBe(true);
  });
  it('#onMousePress devrait mettre commandes.drawingInProgress vrai apres un clic', () => {
    service.commands.drawingInProgress = false;
    // on effectue un clic dans cette fonction
    service.onMousePress(new MouseEvent('onclick'));
    // on vérifie que la fonction met commandes.drawingInProgress vrai
    expect(service.commands.drawingInProgress).toBe(true);
  });
  it('#onMousePress devrait contenir les coordonnees initiales du clic', () => {
    service.commands.drawingInProgress = false;
    service.initial.x = 200; service.initial.y = 200;
    // on fait un clic aux coordonnees (100,50)
    const clic = new MouseEvent('click', { clientX: 100, clientY: 50 });
    service.onMousePress(clic);
    // on vérifie que la fonction contient les coordonnees correctement
    expect(service.initial.x).toBe(100);
    expect(service.initial.y).toBe(50);
  });
  it('#onMousePress devrait remettre la height et la width à 0', () => {
    service.commands.drawingInProgress = false;
    const rectangle = new EllipseService();
    rectangle.points = [{x: 0, y: 0}, {x: 10, y: 10}];
    // on fait un clic aux coordonnees (100,50)
    const clic = new MouseEvent('click', { clientX: 100, clientY: 50 });
    service.onMousePress(clic);
    // on vérifie que la fonction contient la width et longueur à 0
    expect(service.ellipse.getHeight()).toBe(0);
    expect(service.ellipse.getWidth()).toBe(0);
  });

  // TESTS onMouseRelease

  it('#onMouseRelease devrait mettre commandes.drawingInProgress faux apres un clic', () => {
    // on effectue un clic dans cette fonction
    service.onMouseRelease();
    // on vérifie que la fonction met commandes.drawingInProgress faux
    expect(service.commands.drawingInProgress).toBe(false);
  });
  it("#onMouseRelease devrait s'assurer que le curseur n'est pas nul " +
      'en height et width apres un relachement de clic', () => {
    // la height et la width sont nulles
    spyOn(service.commands, 'execute');
    service.onMouseRelease();
    // vérifier que la fonction d'AjoutSVG n'a pas été appelée
    expect(service.commands.execute).not.toHaveBeenCalled();
  });
  it('#onMouseRelease devrait appeler correctement la fonction execute avec un AjoutSVG', () => {
    // la height et la width sont non nulles
    const rectangle = new EllipseService();
    rectangle.points = [{x: 0, y: 0}, {x: 10, y: 10}];
    service.ellipse = rectangle;
    spyOn(service.commands, 'execute');
    service.onMouseRelease();
    // vérifier que la fonction ajouterSVG a été correctement appelée
    const addSVG = new AddSVGService(rectangle, service.stockageSVG);
    addSVG.svgKey = 0;
    expect(service.commands.execute).toHaveBeenCalledWith(addSVG);
  });
  it('#onMouseRelease devrait reinitialiser le rectangle', () => {
    const rectangle = new EllipseService();
    service.ellipse = rectangle;
    service.onMouseRelease();
    // vérifier que le SVG est vide
    expect(service.ellipse).toEqual(new EllipseService());
  });
  it('#onMouseRelease devrait reinitialiser la base calculee', () => {
    service.calculatedBase = {x: 100, y: 100};
    service.onMouseRelease();
    expect(service.calculatedBase).toEqual({x: 0, y: 0});
  });
  it('#onMouseRelease devrait reinitialiser la height calculee', () => {
    service.calculatedHeight = 100;
    service.onMouseRelease();
    expect(service.calculatedHeight).toEqual(0);
  });
  it('#onMouseRelease devrait reinitialiser la width calculee', () => {
    service.calculatedHeight = 100;
    service.onMouseRelease();
    expect(service.calculatedHeight).toEqual(0);
  });

  // TESTS clear

  it('#clear devrait mettre commandes.drawingInProgress faux', () => {
    service.clear();
    expect(service.commands.drawingInProgress).toBe(false);
  });

  it('#clear devrait reinitialiser le rectangle', () => {
    const rectangle = new EllipseService();
    rectangle.points = [{x: 0, y: 0}, {x: 10, y: 10}];
    service.ellipse = rectangle;
    service.clear();
    // vérifier que le SVG est vide
    expect(service.ellipse).toEqual(new EllipseService());
  });
});
