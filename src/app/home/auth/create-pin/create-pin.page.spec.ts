import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreatePinPage } from './create-pin.page';

describe('CreatePinPage', () => {
  let component: CreatePinPage;
  let fixture: ComponentFixture<CreatePinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
