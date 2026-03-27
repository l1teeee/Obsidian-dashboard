import DateTimePicker from '../shared/DateTimePicker';

interface SchedulePickerProps {
  scheduleDate: Date;
  onDateChange: (d: Date) => void;
}

export default function SchedulePicker({ scheduleDate, onDateChange }: SchedulePickerProps) {
  return (
    <div data-editor-section className="space-y-3 pb-10">
      <label className="text-[11px] uppercase tracking-widest text-[#988d9c] font-bold">
        Distribution Schedule
      </label>

      <DateTimePicker value={scheduleDate} onChange={onDateChange} />

      <p className="text-[10px] text-[#c5d247] font-medium flex items-center gap-2 px-2">
        <span className="material-symbols-outlined text-[13px]">bolt</span>
        System suggested based on audience activity peak.
      </p>
    </div>
  );
}
