import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewpinPage } from './newpin.page';

describe('NewpinPage', () => {
  let component: NewpinPage;
  let fixture: ComponentFixture<NewpinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewpinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewpinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
