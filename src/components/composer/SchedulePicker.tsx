import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface PickerInputProps {
  value?:   string;
  onClick?: () => void;
}

const DateInput = forwardRef<HTMLButtonElement, PickerInputProps>(({ value, onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    type="button"
    className="flex items-center gap-4 bg-[#1c1b1b] border border-[#4c4450]/30 rounded-2xl p-4 hover:border-[#d394ff]/50 transition-colors w-full text-left cursor-pointer"
  >
    <span className="material-symbols-outlined text-[#d394ff] text-[18px] shrink-0">event</span>
    <div className="flex flex-col">
      <span className="text-[10px] text-[#988d9c] font-bold uppercase tracking-tighter">Date</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
    <span className="material-symbols-outlined text-[#988d9c] ml-auto text-[16px]">expand_more</span>
  </button>
));
DateInput.displayName = 'DateInput';

const TimeInput = forwardRef<HTMLButtonElement, PickerInputProps>(({ value, onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    type="button"
    className="flex items-center gap-4 bg-[#1c1b1b] border border-[#4c4450]/30 rounded-2xl p-4 hover:border-[#d394ff]/50 transition-colors w-full text-left cursor-pointer"
  >
    <span className="material-symbols-outlined text-[#d394ff] text-[18px] shrink-0">schedule</span>
    <div className="flex flex-col">
      <span className="text-[10px] text-[#988d9c] font-bold uppercase tracking-tighter">Time</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
    <span className="material-symbols-outlined text-[#988d9c] ml-auto text-[16px]">expand_more</span>
  </button>
));
TimeInput.displayName = 'TimeInput';

interface SchedulePickerProps {
  scheduleDate:    Date;
  onDateChange:    (d: Date) => void;
}

export default function SchedulePicker({ scheduleDate, onDateChange }: SchedulePickerProps) {
  return (
    <div data-editor-section className="space-y-3 pb-10">
      <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">Distribution Schedule</label>
      <div className="grid grid-cols-2 gap-4">
        <DatePicker
          selected={scheduleDate}
          onChange={(date: Date | null) => date && onDateChange(date)}
          dateFormat="MMM d, yyyy"
          minDate={new Date()}
          customInput={<DateInput />}
          popperPlacement="top-start"
          portalId="dp-portal"
        />
        <DatePicker
          selected={scheduleDate}
          onChange={(date: Date | null) => date && onDateChange(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          customInput={<TimeInput />}
          popperPlacement="top-end"
          portalId="dp-portal"
        />
      </div>
      <p className="text-[10px] text-[#c5d247] font-medium flex items-center gap-2 px-2">
        <span className="material-symbols-outlined text-[13px]">bolt</span>
        System suggested based on audience activity peak.
      </p>
    </div>
  );
}
