import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatSidenavModule } from '@angular/material';
import { ExportWindowComponent } from './export-window.component';

describe('ExportWindowComponent', () => {
  let component: ExportWindowComponent;
  let fixture: ComponentFixture<ExportWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportWindowComponent ],
      imports: [MatSidenavModule, MatDialogModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});