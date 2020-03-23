import { TestBed } from '@angular/core/testing';

import { DomSanitizer } from '@angular/platform-browser';
import { CanvasConversionService } from './canvas-conversion.service';
import { Color, DrawElement } from './stockage-svg/draw-element';
import { RectangleService } from './stockage-svg/rectangle.service';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';
import { TraceBrushService } from './stockage-svg/trace-brush.service';
import { TracePencilService } from './stockage-svg/trace-pencil.service';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers

let firstElement: DrawElement;
let secondElement: DrawElement;
let thirdElement: DrawElement;

describe('CanvasConversionService', () => {
  let service: CanvasConversionService;
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  let stockage: SVGStockageService;
  let sanitizer: DomSanitizer;
  let completeElements: DrawElement[];

  const firstColor: Color = {
    RGBAString: 'rgba(1, 0, 0, 1)',
    RGBA: [1, 0, 0, 1]
  };
  const secondColor: Color = {
    RGBAString: 'rgba(2, 0, 0, 1)',
    RGBA: [2, 0, 0, 1]
  };
  const thirdColor: Color = {
    RGBAString: 'rgba(3, 0, 0, 1)',
    RGBA: [3, 0, 0, 1]
  };

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(CanvasConversionService);
    stockage = TestBed.get(SVGStockageService);
    sanitizer = TestBed.get(DomSanitizer);
    service['svgStockage'] = stockage;
    service.coloredDrawing = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    canvas = document.createElement('canvas');
    service.canvas = canvas;
    const contextCanvas = canvas.getContext('2d');
    if (contextCanvas) {
      context = contextCanvas;
      service['context'] = context;
    }
    service['image'] = new Image();

    firstElement = new TracePencilService();
    firstElement.points = [{x: 0, y: 0}, {x: 1, y: 2}, {x: 0, y: 3}];
    firstElement.draw();

    secondElement = new RectangleService();
    secondElement.points = [{x: 3, y: 7}, {x: 2, y: 5}];
    secondElement.draw();

    thirdElement = new TraceBrushService();
    thirdElement.points = [{x: 0, y: 0}, {x: 1, y: 1}];
    thirdElement.draw();

    completeElements = [firstElement, secondElement, thirdElement];
    spyOn(stockage, 'getCompleteSVG').and.callFake(() => completeElements);

    const imageData = new ImageData(2, 2);
    const data = imageData.data;
    data.set([
      1, 0, 0, 1,
      1, 0, 0, 1,
      9, 0, 0, 1,
      3, 0, 2, 1
    ]);
    spyOn(context, 'getImageData').and.callFake(() => imageData);
  });

  beforeAll(() => {
    jasmine.clock().install();
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS convertToCanvas

  it('#convertToCanvas ne devrait rien faire si le canvas n\'est pas défini', () => {
    delete service.canvas;
    const spy = spyOn(HTMLCanvasElement.prototype, 'getContext');
    service.convertToCanvas();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#convertToCanvas devrait appeler getContext("2d") pour obtenir le contexte du canvas', () => {
    spyOn(service.canvas, 'getContext');
    service.convertToCanvas();
    expect(service.canvas.getContext).toHaveBeenCalledWith('2d');
  });

  it('#convertToCanvas ne devrait rien faire si le contexte n\'est pas défini', () => {
    delete service['context'];
    spyOn(service.canvas, 'getContext').and.callFake(() => null);
    service.convertToCanvas();
    expect(service['context']).not.toBeDefined();
  });

  it('#convertToCanvas ne devrait rien faire si coloredDrawing n\'est pas défini', () => {
    delete service['context'];
    delete service.coloredDrawing;
    service.convertToCanvas();
    expect(service['context']).not.toBeDefined();
  });

  it('#convertToCanvas devrait garder le contexte en mémoire s\'il est défini', () => {
    service.convertToCanvas();
    expect(service['context']).toEqual(context);
  });

  it('#convertToCanvas devrait appeler serializeToString sur coloredDrawing', () => {
    const spy = spyOn(XMLSerializer.prototype, 'serializeToString');
    service.convertToCanvas();
    expect(spy).toHaveBeenCalledWith(service.coloredDrawing);
  });

  it('#convertToCanvas devrait charger la fonction loadImage dans l\'image', () => {
    service.convertToCanvas();
    expect(JSON.stringify(service['image'].onload)).toEqual(JSON.stringify(service.loadImage));
  });

  it('#convertToCanvas devrait générer l\'URL de l\'image du SVG', () => {
    spyOn(URL, 'createObjectURL');
    service.convertToCanvas();
    expect(URL.createObjectURL).toHaveBeenCalledWith(
      new Blob([new XMLSerializer().serializeToString(service.coloredDrawing)], {type: 'image/svg+xml;charset=utf-8'})
    );
  });

  it('#convertToCanvas devrait charger l\'URL de l\'image du SVG dans le src de l\'image', () => {
    spyOn(URL, 'createObjectURL').and.callFake(() => 'http://localhost:9876/fakeURL');
    service.convertToCanvas();
    expect(service['image'].src).toEqual('http://localhost:9876/fakeURL');
  });

  // TEST loadImage

  it('#loadImage devrait appeler drawImage du contexte avec l\'image en paramètre', () => {
    spyOn(context, 'drawImage');
    service.loadImage();
    expect(context.drawImage).toHaveBeenCalledWith(service['image'], 0, 0);
  });

  // TESTS updateDrawing

  it('#updateDrawing devrait appeler getCompleteSVG de SVGStockage', () => {
    service.updateDrawing();
    expect(stockage.getCompleteSVG).toHaveBeenCalled();
  });

  it('#updateDrawing devrait assigner des teintes de rouge aux premiers SVG du stockage', () => {
    service.updateDrawing();
    if (service['drawing'].elements && service['drawing'].elements[0].primaryColor) {
      expect(service['drawing'].elements[0].primaryColor.RGBAString).toEqual('rgba(1, 0, 0, 1)');
    }
  });

  it('#updateDrawing devrait assigner des teintes de vert lorsque la limite de rouge est atteinte', () => {
    for (let i = 0; i < 256; ++i) {
      completeElements[i] = firstElement;
    }
    service.updateDrawing();
    if (service['drawing'].elements && service['drawing'].elements[255].primaryColor) {
      expect(service['drawing'].elements[255].primaryColor.RGBAString).toEqual('rgba(0, 1, 0, 1)');
    }
  });

  it('#updateDrawing devrait assigner des teintes de bleu lorsque la limite de vert est atteinte', () => {
    for (let i = 0; i < 65536; ++i) {
      completeElements[i] = firstElement;
    }
    service.updateDrawing();
    if (service['drawing'].elements && service['drawing'].elements[65535].primaryColor) {
      expect(service['drawing'].elements[65535].primaryColor.RGBAString).toEqual('rgba(0, 0, 1, 1)');
    }
  });

  it('#updateDrawing devrait appeler draw sur des clones de chacun des éléments du stockage', () => {
    const spy = spyOn(TracePencilService.prototype, 'draw');
    service.updateDrawing();
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('#updateDrawing devrait appeler sanitize sur des clones de chacun des éléments du stockage', () => {
    spyOn(service, 'sanitize');
    service.updateDrawing();
    expect(service.sanitize).toHaveBeenCalledTimes(3);
  });

  it('#updateDrawing devrait ajouter un clone de chaque élément avec des couleurs modifiées dans drawing.elements', () => {
    service.updateDrawing();

    firstElement.primaryColor = firstColor;
    const coloredFirstElement = {...firstElement};
    firstElement.draw();
    coloredFirstElement.svgHtml = sanitizer.bypassSecurityTrustHtml(firstElement.svg);

    expect(service['drawing'].elements).toContain(coloredFirstElement);
  });

  it('#updateDrawing devrait changer la couleur secondaire de l\'élément s\'il en contient une', () => {
    service.updateDrawing();

    secondElement.primaryColor = secondColor;
    secondElement.secondaryColor = secondColor;
    const coloredSecondElement = {...secondElement};
    secondElement.draw();
    coloredSecondElement.svgHtml = sanitizer.bypassSecurityTrustHtml(secondElement.svg);

    expect(service['drawing'].elements).toContain(coloredSecondElement);
  });

  it('#updateDrawing devrait convertir l\'élément en TracePencil s\'il s\'agit d\'un TraceBrush', () => {
    service.updateDrawing();

    thirdElement.primaryColor = thirdColor;
    const coloredThirdElement = {...thirdElement};
    const pencil = new TracePencilService();
    pencil.points = thirdElement.points;
    pencil.primaryColor = thirdColor;
    pencil.draw();
    coloredThirdElement.svgHtml = sanitizer.bypassSecurityTrustHtml(pencil.svg);

    expect(service['drawing'].elements).toContain(coloredThirdElement);
  });

  it('#updateDrawing devrait remettre chaque élément du stockage à son état initial', () => {
    const firstInitial = JSON.stringify(firstElement);
    const secondInitial = JSON.stringify(secondElement);
    const thirdInitial = JSON.stringify(thirdElement);
    service.updateDrawing();
    expect(JSON.stringify(firstElement)).toEqual(firstInitial);
    expect(JSON.stringify(secondElement)).toEqual(secondInitial);
    expect(JSON.stringify(thirdElement)).toEqual(thirdInitial);
  });

  it('#updateDrawing devrait ajouter les éléments à coloredElements en utilisant la couleur unique comme clé', () => {
    const spy = spyOn(Map.prototype, 'set');
    service.updateDrawing();
    expect(spy).toHaveBeenCalledWith(firstColor.RGBAString, firstElement);
    expect(spy).toHaveBeenCalledWith(secondColor.RGBAString, secondElement);
    expect(spy).toHaveBeenCalledWith(thirdColor.RGBAString, thirdElement);
  });

  it('#updateDrawing devrait appeler setTimeout de window', () => {
    spyOn(window, 'setTimeout');
    service.updateDrawing();
    expect(window.setTimeout).toHaveBeenCalled();
  });

  it('#updateDrawing devrait appeler convertToCanvas après le délai', () => {
    spyOn(service, 'convertToCanvas');
    service.updateDrawing();
    jasmine.clock().tick(50);
    expect(service.convertToCanvas).toHaveBeenCalled();
  });

  // TESTS getElementsInArea

  it('#getElementsInArea devrait appeler getImageData avec les coordonnées, la hauteur et la largeur en paramètres', () => {
    service.getElementsInArea(1, 2, 15, 28);
    expect(context.getImageData).toHaveBeenCalledWith(1, 2, 15, 28);
  });

  it('#getElementsInArea devrait appeler get sur coloredElements pour toutes les couleurs sur la surface', () => {
    spyOn(service['coloredElements'], 'get');
    service.getElementsInArea(0, 0, 2, 2);
    expect(service['coloredElements'].get).toHaveBeenCalledWith('rgba(1, 0, 0, 1)');
    expect(service['coloredElements'].get).toHaveBeenCalledWith('rgba(1, 0, 0, 1)');
    expect(service['coloredElements'].get).toHaveBeenCalledWith('rgba(9, 0, 0, 1)');
    expect(service['coloredElements'].get).toHaveBeenCalledWith('rgba(3, 0, 2, 1)');
  });

  it('#getElementsInArea ne devrait pas ajouter d\'élément qui n\'est pas contenu dans coloredElements', () => {
    service['coloredElements'] = new Map<string, DrawElement>();
    expect(service.getElementsInArea(0, 0, 2, 2)).toEqual([]);
  });

  it('#getElementsInArea devrait ajouter les éléments qu\'il trouve dans la valeur de retour', () => {
    service['coloredElements'].set('rgba(3, 0, 2, 1)', thirdElement).set('rgba(9, 0, 0, 1)', secondElement);
    expect(service.getElementsInArea(0, 0, 2, 2)).toContain(secondElement);
    expect(service.getElementsInArea(0, 0, 2, 2)).toContain(thirdElement);
  });

  it('#getElementsInArea ne devrait pas ajouter plusieurs fois le même élément dans la valeur de retour', () => {
    service['coloredElements'].set('rgba(1, 0, 0, 1)', firstElement);
    expect(service.getElementsInArea(0, 0, 2, 2)).toEqual([firstElement]);
  });

  // TEST sanitize

  it('#sanitize devrait retourner la valeur en SafeHtml du string passé en paramètre', () => {
    const testString = '<test />';
    expect(service.sanitize(testString)).toEqual(sanitizer.bypassSecurityTrustHtml(testString));
  });
});
