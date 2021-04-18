import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FailurePage } from './failure.page';

describe('FailurePage', () => {
  let component: FailurePage;
  let fixture: ComponentFixture<FailurePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailurePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FailurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
