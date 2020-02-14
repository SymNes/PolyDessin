import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { BarreOutilsComponent } from '../barre-outils/barre-outils.component';
import { FenetreNewDessinComponent } from '../fenetre-new-dessin/fenetre-new-dessin.component';
import { GuideSujetComponent } from '../guide-sujet/guide-sujet.component';
import { OutilDessinComponent } from '../outil-dessin/outil-dessin.component';
import { PageDessinComponent } from '../page-dessin/page-dessin.component';
import { PageGuideComponent } from '../page-guide/page-guide.component';
import { SurfaceDessinComponent } from '../surface-dessin/surface-dessin.component';
import { AccueilComponent } from './accueil.component';

describe('AccueilComponent', () => {
  let component: AccueilComponent;
  let fixture: ComponentFixture<AccueilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageDessinComponent, PageGuideComponent, AccueilComponent, BarreOutilsComponent, GuideSujetComponent,
        OutilDessinComponent, SurfaceDessinComponent ],
      imports: [ MatDialogModule, RouterModule.forRoot([
        {path: '', component: AccueilComponent},
        {path: 'dessin', component: PageDessinComponent},
        {path: 'guide', component : PageGuideComponent}
    ]) ],
    providers: [ MatDialog, MatDialogConfig ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#creationDessin devrait appeler dialog.open() avec les bons parametres ', () => {
    spyOn(component.dialog, 'open');
    component.creationDessin();
    expect(component.dialog.open).toHaveBeenCalledWith(FenetreNewDessinComponent, component.dialogConfig);
  })
});
