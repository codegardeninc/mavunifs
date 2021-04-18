import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AirtimePage } from './airtime.page';

describe('AirtimePage', () => {
  let component: AirtimePage;
  let fixture: ComponentFixture<AirtimePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtimePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AirtimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
