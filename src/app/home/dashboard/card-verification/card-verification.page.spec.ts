import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardVerificationPage } from './card-verification.page';

describe('CardVerificationPage', () => {
  let component: CardVerificationPage;
  let fixture: ComponentFixture<CardVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardVerificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
