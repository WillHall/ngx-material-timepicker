import { Injectable } from '@angular/core';
import { ClockFaceTime } from '../models/clock-face-time.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { TimePeriod } from '../models/time-period.enum';
import * as moment_ from 'moment';
import { TimeFormat } from '../models/time-format.enum';

const moment = moment_;

const DEFAULT_HOUR: ClockFaceTime = {
  time: 12,
  angle: 360
};

const DEFAULT_MINUTE: ClockFaceTime = {
  time: '00',
  angle: 360
};

const DEFAULT_SECOND: ClockFaceTime = {
  time: '00',
  angle: 360
};

@Injectable()
export class NgxMaterialTimepickerService {
  private hourSubject = new BehaviorSubject<ClockFaceTime>(DEFAULT_HOUR);
  private minuteSubject = new BehaviorSubject<ClockFaceTime>(DEFAULT_MINUTE);
  private secondSubject = new BehaviorSubject<ClockFaceTime>(DEFAULT_SECOND);
  private periodSubject = new BehaviorSubject<TimePeriod>(TimePeriod.AM);

  set hour(hour: ClockFaceTime) {
    this.hourSubject.next(hour);
  }

  get selectedHour(): Observable<ClockFaceTime> {
    return this.hourSubject.asObservable();
  }

  set minute(minute: ClockFaceTime) {
    this.minuteSubject.next(minute);
  }

  get selectedMinute(): Observable<ClockFaceTime> {
    return this.minuteSubject.asObservable();
  }

  set second(second: ClockFaceTime) {
    this.secondSubject.next(second);
  }

  get selectedSecond(): Observable<ClockFaceTime> {
    return this.secondSubject.asObservable();
  }

  set period(period: TimePeriod) {
    this.periodSubject.next(period);
  }

  get selectedPeriod(): Observable<TimePeriod> {
    return this.periodSubject.asObservable();
  }

  get fullTime(): string {
    const hour = this.hourSubject.getValue().time;
    const minute = this.minuteSubject.getValue().time;
    const second = this.secondSubject.getValue().time;
    const period = this.periodSubject.getValue();

    return second ? `${hour}:${minute}:${second} ${period}` : `${hour}:${minute} ${period}`;
  }

  set defaultTime(timeObj) {
    const time = timeObj.time;
    const enableSeconds = timeObj.enableSeconds;
    const format = enableSeconds ? TimeFormat.TWENTY_FOUR.replace('mm', 'mm:ss') : TimeFormat.TWENTY_FOUR;
    const defaultTime = moment(time, format).toDate();

    if (moment(defaultTime).isValid()) {
      this.hour = {...DEFAULT_HOUR, time: defaultTime.getHours() === 0 ? '00' : defaultTime.getHours()};
      this.minute = {...DEFAULT_MINUTE, time: defaultTime.getMinutes() === 0 ? '00' : defaultTime.getMinutes()};
      this.second = { ...DEFAULT_SECOND, time: defaultTime.getSeconds() === 0 ? '00' : defaultTime.getSeconds() };
      this.period = <TimePeriod>time.substr(time.length - 2).toUpperCase();
    }
  }
}
