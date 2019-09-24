import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  TimelineViewsService, TimelineMonthService, AgendaService, EventSettingsModel, GroupModel, ResizeService, DragAndDropService, PopupOpenEventArgs, ScheduleComponent, CurrentAction, DayService, WeekService, WorkWeekService, MonthService
} from '@syncfusion/ej2-angular-schedule';
import { resourceData } from './data';
import { isNullOrUndefined } from 'util';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DateTimePicker } from '@syncfusion/ej2-calendars';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TimelineViewsService, TimelineMonthService, AgendaService, ResizeService, DragAndDropService, DayService, WeekService, WorkWeekService, MonthService],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  @ViewChild('scheduleObj', { static: false })
  public scheduleObj: ScheduleComponent;
  private selectionTarget: Element;
  public selectedDate: Date = new Date(2018, 3, 2);
  public currentView: string = 'TimelineWeek';
  public views: Array<string> = ['TimelineDay', 'TimelineWeek', 'TimelineMonth', 'Agenda'];
  public eventSettings: EventSettingsModel = {
    dataSource: resourceData
  };

  public group: GroupModel = {
    resources: ['Rooms', 'Owners']
  };

  public roomDataSource: Object[] = [
    { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
    { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
  ];

  public allowMultipleOwner: Boolean = true;
  public ownerDataSource: Object[] = [
    { OwnerText: 'House Shift', Id: 0, OwnerGroupId: 1, OwnerColor: '#F98132' },
    { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
    { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
    { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' },
    { OwnerText: 'Travis', Id: 4, OwnerGroupId: 1, OwnerColor: '#7DC9E1' },
    { OwnerText: 'Tony', Id: 5, OwnerGroupId: 2, OwnerColor: '#f8a398' },
    { OwnerText: 'Sam', Id: 6, OwnerGroupId: 1, OwnerColor: '#7499e1' },
    { OwnerText: 'Mary', Id: 7, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
    { OwnerText: 'Claudia', Id: 8, OwnerGroupId: 2, OwnerColor: '#ffaa00' },
    { OwnerText: 'Mark', Id: 9, OwnerGroupId: 1, OwnerColor: '#7499e1' }
  ];

  public onDetailsClick(): void {
    this.onCloseClick();
    const data: Object = this.scheduleObj.getCellDetails(this.scheduleObj.getSelectedElements()) as Object;
    this.scheduleObj.openEditor(data, 'Add');
  }

  public onAddClick(): void {
    this.onCloseClick();
    const data: Object = this.scheduleObj.getCellDetails(this.scheduleObj.getSelectedElements()) as Object;
    const eventData: { [key: string]: Object } = this.scheduleObj.eventWindow.getObjectFromFormData('e-quick-popup-wrapper');
    this.scheduleObj.eventWindow.convertToEventData(data as { [key: string]: Object }, eventData);
    eventData.Id = this.scheduleObj.eventBase.getEventMaxID() as number + 1;
    this.scheduleObj.addEvent(eventData);
  }

  public onEditClick(args: any): void {
    if (this.selectionTarget) {
      let eventData: { [key: string]: Object } = this.scheduleObj.getEventDetails(this.selectionTarget) as { [key: string]: Object };
      let currentAction: CurrentAction = 'Save';
      if (!isNullOrUndefined(eventData.RecurrenceRule) && eventData.RecurrenceRule !== '') {
        if (args.target.classList.contains('e-edit-series')) {
          currentAction = 'EditSeries';
          eventData = this.scheduleObj.eventBase.getRecurrenceEvent(eventData);
        } else {
          currentAction = 'EditOccurrence';
        }
      }
      this.scheduleObj.openEditor(eventData, currentAction);
    }
  }

  public onDeleteClick(args: any): void {
    this.onCloseClick();
    if (this.selectionTarget) {
      const eventData: { [key: string]: Object } = this.scheduleObj.getEventDetails(this.selectionTarget) as { [key: string]: Object };
      let currentAction: CurrentAction;
      if (!isNullOrUndefined(eventData.RecurrenceRule) && eventData.RecurrenceRule !== '') {
        currentAction = args.target.classList.contains('e-delete-series') ? 'DeleteSeries' : 'DeleteOccurrence';
      }
      this.scheduleObj.deleteEvent(eventData, currentAction);
    }
  }

  public onCloseClick(): void {
    this.scheduleObj.quickPopup.quickPopupHide();
  }

  public onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor') {
      let statusElement: HTMLInputElement = args.element.querySelector('#EventType') as HTMLInputElement;
      if (!statusElement.classList.contains('e-dropdownlist')) {
        let dropDownListObject: DropDownList = new DropDownList({
          placeholder: 'Choose status', value: statusElement.value,
          dataSource: ['New', 'Requested', 'Confirmed']
        });
        dropDownListObject.appendTo(statusElement);
        statusElement.setAttribute('name', 'EventType');
      }
      let startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
      if (!startElement.classList.contains('e-datetimepicker')) {
        new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
      }
      let endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
      if (!endElement.classList.contains('e-datetimepicker')) {
        new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
      }
    }
  }
}
