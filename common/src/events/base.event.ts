import { Subject } from './subject';

export interface BaseEvent {
  subject: Subject;
  data: any;
}
