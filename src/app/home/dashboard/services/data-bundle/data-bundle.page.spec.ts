import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DataBundlePage } from './data-bundle.page';

describe('DataBundlePage', () => {
  let component: DataBundlePage;
  let fixture: ComponentFixture<DataBundlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataBundlePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DataBundlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
