import { Component, HostListener, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ClockFaceTime } from '../../models/clock-face-time.interface';
import { TimeUnit } from '../../models/time-unit.enum';
import { TimePeriod } from '../../models/time-period.enum';
import * as _moment from 'moment';
import { Moment } from 'moment';

const moment = _moment;
const MINUTES = 60;

@Component({
  selector: 'ngx-material-timepicker-minutes-face',
  templateUrl: './ngx-material-timepicker-minutes-face.component.html'
})
export class NgxMaterialTimepickerMinutesFaceComponent implements OnChanges {

  minutesList: ClockFaceTime[] = [];
  timeUnit = TimeUnit;

  @Input() selectedMinute: ClockFaceTime;
  @Input() period: TimePeriod;
  @Input() minTime: Moment;
  @Input() maxTime: Moment;

  @Input()
  set selectedHour(value: number) {
    this._selectedHour = value === 12 ? 0 : value;
  }

  private _selectedHour: number;

  @Output() minuteChange = new EventEmitter<ClockFaceTime>();
  @Output() minuteSelected = new EventEmitter<null>();

  constructor() {
    const angleStep = 360 / MINUTES;
    this.minutesList = Array(MINUTES).fill(0).map((v, i) => {
      const index = (v + i);
      const angle = angleStep * index;
      return {time: index === 0 ? '00' : index, angle: angle !== 0 ? angle : 360};
    });
  }

  @HostListener('touchend')
  @HostListener('click')
  onClick() {
    this.minuteSelected.next();
  }

  private get disabledMinutes(): ClockFaceTime[] {
    if (this.minTime || this.maxTime) {
      return this.minutesList.map(value => {
        const hour = this.period === TimePeriod.AM ? this._selectedHour : this._selectedHour + 12;
        const currentTime = moment().hour(hour).minute(+value.time);

        return {
          ...value,
          disabled: currentTime.isBefore(this.minTime || null, 'minutes') || currentTime.isAfter(this.maxTime || null, 'minutes')
        };
      })
    }
    return this.minutesList;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['period'] && changes['period'].currentValue) {
      this.minutesList = this.disabledMinutes;
    }
  }
}
