import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ClockFaceTime } from '../../models/clock-face-time.interface';
import { TimeUnit } from '../../models/time-unit.enum';
import { TimePeriod } from '../../models/time-period.enum';
import * as _moment from 'moment';
import { Moment } from 'moment';

const moment = _moment;
const SECONDS = 60;

@Component({
  selector: 'ngx-material-timepicker-seconds-face',
  templateUrl: './ngx-material-timepicker-seconds-face.component.html'
})
export class NgxMaterialTimepickerSecondsFaceComponent implements OnChanges {

  secondsList: ClockFaceTime[] = [];
  timeUnit = TimeUnit;

  @Input() selectedSecond: ClockFaceTime;
  @Input() period: TimePeriod;
  @Input() minTime: Moment;
  @Input() maxTime: Moment;

  @Input()
  set selectedHour(value: number) {
    this._selectedHour = value === 12 ? 0 : value;
  }

  @Input()
  set selectedMinute(value: number) {
    this._selectedMinute = value === 60 || value === 0 ? 0 : value;
  }

  private _selectedHour: number;
  private _selectedMinute: number;

  @Output() secondChange = new EventEmitter<ClockFaceTime>();

  constructor() {
    const angleStep = 360 / SECONDS;
    this.secondsList = Array(SECONDS).fill(0).map((v, i) => {
      const index = (v + i);
      const angle = angleStep * index;
      return {time: index === 0 ? '00' : index, angle: angle !== 0 ? angle : 360};
    });
  }

  private get disabledSeconds(): ClockFaceTime[] {
    if (this.minTime || this.maxTime) {
      return this.secondsList.map(value => {
        const hour = this.period === TimePeriod.AM ? this._selectedHour : this._selectedHour + 12;
        const minute = this._selectedMinute;
        const currentTime = moment().hour(hour).minute(minute).second(+value.time);

        return {
          ...value,
          disabled: currentTime.isBefore(this.minTime || null, 'seconds') || currentTime.isAfter(this.maxTime || null, 'seconds')
        };
      })
    }
    return this.secondsList;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['period'] && changes['period'].currentValue) {
      this.secondsList = this.disabledSeconds;
    }
  }
}
