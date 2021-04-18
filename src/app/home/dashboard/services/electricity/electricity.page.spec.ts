import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ElectricityPage } from './electricity.page';

describe('ElectricityPage', () => {
  let component: ElectricityPage;
  let fixture: ComponentFixture<ElectricityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ElectricityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
