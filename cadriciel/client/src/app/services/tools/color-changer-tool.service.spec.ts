import { TestBed } from '@angular/core/testing';

// import { PrimaryColorChangeService } from '../command/primary-color-change.service';
// import { SecondaryColorChangeService } from '../command/secondary-color-change.service';
import { Color, DrawElement } from '../stockage-svg/draw-element';
import { ColorChangerToolService } from './color-changer-tool.service';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers

describe('ColorChangerToolService', () => {
  let service: ColorChangerToolService;

  const colorTest1: Color = {
    RGBA: [9, 9, 9, 1],
    RGBAString: 'rgba(9, 9, 9, 1)'
  };

  const colorTest2: Color = {
    RGBA: [255, 255, 255, 1],
    RGBAString: 'rgba(255, 255, 255, 1)'
  };

  const element: DrawElement = {
    svg: '',
    svgHtml: '',
    trueType: 0,
    points: [],
    isSelected: false,
    erasingEvidence: false,
    erasingColor: {RGBA: [0, 0, 0, 0], RGBAString: ''},
    pointMin: {x: 0, y: 0},
    pointMax: {x: 0, y: 0},
    translate: {x: 0, y: 0},
    draw: () => { return; },
    updatePosition: () => { return; },
    updatePositionMouse: () => { return; },
    updateParameters: () => { return; },
    translateAllPoints: () => { return; }
  };

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(ColorChangerToolService));

  it('should be created', () => {
    const testService: ColorChangerToolService = TestBed.get(ColorChangerToolService);
    expect(testService).toBeTruthy();
  });

  // TESTS onMouseClick

  it('#onMouseClick ne devrait pas executer de commande si il n\'y a pas d\'element actif', () => {
    spyOn(service['commands'], 'execute');

    service.onMouseClick();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it('#onMouseClick ne devrait pas executer de commande si la couleur principale de l\'element actif est la même que celle choisi', () => {
    spyOn(service['commands'], 'execute');

    service.activeElement = element;
    service.activeElement.primaryColor = colorTest1;
    service['colorParameter'].primaryColor = colorTest1;

    service.onMouseClick();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it('#onMouseClick devrait executer une commande si la couleur principale de l\'element actif est différente de  celle choisi', () => {
    spyOn(service['commands'], 'execute');

    service.activeElement = {...element};
    service.activeElement.primaryColor = colorTest1;
    service['colorParameter'].primaryColor = colorTest2;

    service.onMouseClick();
    expect(service['commands'].execute)
        .toHaveBeenCalled();
        // .toHaveBeenCalledWith(new PrimaryColorChangeService(service['activeElement'], service['colorParameter'], service['sanitizer']));
  });

  // TESTS onRightClick

  it('#onRightClick ne devrait pas executer de commande si il n\'y a pas d\'element actif', () => {
    spyOn(service['commands'], 'execute');

    service.onRightClick();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it('#onRightClick ne devrait pas executer de commande si la couleur secondaire de l\'element actif est la même que celle choisi', () => {
    spyOn(service['commands'], 'execute');

    service.activeElement = element;
    service.activeElement.secondaryColor = colorTest2;
    service['colorParameter'].secondaryColor = colorTest2;

    service.onRightClick();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it('#onRightClick devrait executer une commande si la couleur secondaire de l\'element actif est différente de  celle choisi', () => {
    spyOn(service['commands'], 'execute');

    service.activeElement = {...element};
    service.activeElement.secondaryColor = colorTest1;
    service['colorParameter'].secondaryColor = colorTest2;

    service.onRightClick();
    expect(service['commands'].execute)
        .toHaveBeenCalled();
      // .toHaveBeenCalledWith(new SecondaryColorChangeService(service['activeElement'], service['colorParameter'], service['sanitizer']));
  });

});
