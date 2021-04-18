import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SmeDataPage } from './sme-data.page';

describe('SmeDataPage', () => {
  let component: SmeDataPage;
  let fixture: ComponentFixture<SmeDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SmeDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
