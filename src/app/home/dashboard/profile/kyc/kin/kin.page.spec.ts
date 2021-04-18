import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KinPage } from './kin.page';

describe('KinPage', () => {
  let component: KinPage;
  let fixture: ComponentFixture<KinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
