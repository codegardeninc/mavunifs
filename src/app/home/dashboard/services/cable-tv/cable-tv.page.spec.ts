import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CableTvPage } from './cable-tv.page';

describe('CableTvPage', () => {
  let component: CableTvPage;
  let fixture: ComponentFixture<CableTvPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CableTvPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CableTvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
