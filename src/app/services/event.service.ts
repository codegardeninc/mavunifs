import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Events {

  constructor() { }

  private subject = new Subject<any> ()

  publish(data: any) {
    this.subject.next(data)
  }

  getEvent(): Subject<any> {
    return this.subject
  }
  
}
 