import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { ColorParameterService } from '../color/color-parameter.service';
import { LineService } from '../stockage-svg/line.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { SecondaryColorChangeService } from './secondary-color-change.service';

describe('SecondaryColorChangeService', () => {
  let stockageService: SVGStockageService;
  let colorParameter: ColorParameterService;
  let service: SecondaryColorChangeService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    stockageService = TestBed.get(SVGStockageService);
    stockageService.addSVG(new LineService());
    colorParameter = TestBed.get(ColorParameterService);
    service = new SecondaryColorChangeService(new LineService(), colorParameter, TestBed.get(DomSanitizer));
    service.oldColor = 'rgba(0, 0, 0, 1)';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS constructeur

  it('Le constructeur devrait appeler la fonction getParameters', () => {
    spyOn(colorParameter, 'getSecondaryColor');
    service = new SecondaryColorChangeService(new LineService(), colorParameter, TestBed.get(DomSanitizer));
    expect(colorParameter.getSecondaryColor).toHaveBeenCalledWith();
  });

  it('Le constructeur devrait appeler la fonction changeColor', () => {
    const test = spyOn(SecondaryColorChangeService.prototype, 'changeColor');
    service = new SecondaryColorChangeService(new LineService(), colorParameter, TestBed.get(DomSanitizer));
    expect(test).toHaveBeenCalledWith(colorParameter.getSecondaryColor());
  });

  // TESTS undo

  it('#undo devrait appeler la fonction changeColor', () => {
    spyOn(service, 'changeColor');
    service.undo();
    expect(service.changeColor).toHaveBeenCalledWith(service.oldColor);
  });

  // TESTS redo

  it('#redo devrait appeler la fonction changeColor', () => {
    spyOn(service, 'changeColor');
    service.redo();
    expect(service.changeColor).toHaveBeenCalledWith(service.oldColor);
  });

  // TESTS changeColor

  it('#changeColor ne devrait pas modifier oldColor si primaryColor est une chaine vide', () => {
    service.element.secondaryColor = '';
    service.oldColor = 'test';
    service.changeColor('test');
    expect(service.oldColor).toEqual('test');
  });

  it('#changeColor devrait modifier oldColor si primaryColor n\'est pas une chaine vide', () => {
    service.element.secondaryColor = 'Plein';
    service.oldColor = 'test';
    service.changeColor('test');
    expect(service.oldColor).toEqual('Plein');
  });

  it('#changeColor devrait modifier primaryColor pour lui attribuer celui en paramètre', () => {
    service.element.secondaryColor = 'Plein';
    service.changeColor('test');
    expect(service.element.secondaryColor).toEqual('test');
  });

  it('#changeColor devrait appeler la fonction draw', () => {
    spyOn(service.element, 'draw');
    service.changeColor('test');
    expect(service.element.draw).toHaveBeenCalled();
  });

  it('#changeColor devrait appeler la fonction bypassSecurityTrustHtml pour attribuer svg dans svgHtml', () => {
    service.element.svg = 'test';
    service.changeColor('test');
    // tslint:disable-next-line:no-string-literal
    expect(service.element.svgHtml).toEqual(service['sanitizer'].bypassSecurityTrustHtml(service.element.svg));
  });
});
