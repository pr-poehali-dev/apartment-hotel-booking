import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface BookingCalendarProps {
  onDatesSelected?: (checkIn: Date | null, checkOut: Date | null) => void;
}

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const DAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const BOOKED_DATES: string[] = [
  '2026-04-05', '2026-04-06', '2026-04-07',
  '2026-04-12', '2026-04-13',
  '2026-04-20', '2026-04-21', '2026-04-22',
];

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function isBooked(date: Date): boolean {
  return BOOKED_DATES.includes(formatDate(date));
}

function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export default function BookingCalendar({ onDatesSelected }: BookingCalendarProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState<'checkin' | 'checkout'>('checkin');
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const handleDayClick = (date: Date) => {
    if (isPast(date) || isBooked(date)) return;

    if (selecting === 'checkin' || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
      setSelecting('checkout');
      onDatesSelected?.(date, null);
    } else {
      if (date <= checkIn!) {
        setCheckIn(date);
        setCheckOut(null);
        setSelecting('checkout');
        onDatesSelected?.(date, null);
      } else {
        setCheckOut(date);
        setSelecting('checkin');
        onDatesSelected?.(checkIn, date);
      }
    }
  };

  const isInRange = (date: Date): boolean => {
    if (!checkIn) return false;
    const end = checkOut || hoverDate;
    if (!end) return false;
    return date > checkIn && date < end;
  };

  const isSelected = (date: Date): boolean => {
    if (checkIn && formatDate(date) === formatDate(checkIn)) return true;
    if (checkOut && formatDate(date) === formatDate(checkOut)) return true;
    return false;
  };

  const isToday = (date: Date): boolean => {
    return formatDate(date) === formatDate(today);
  };

  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    return Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-hotel-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <Icon name="ChevronLeft" size={18} />
        </button>
        <h3 className="font-cormorant text-xl font-semibold text-foreground">
          {MONTHS_RU[viewMonth]} {viewYear}
        </h3>
        <button onClick={nextMonth} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
          <Icon name="ChevronRight" size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_RU.map(day => (
          <div key={day} className="text-center text-xs text-muted-foreground font-golos font-semibold py-1 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(viewYear, viewMonth, i + 1);
          const disabled = isPast(date) || isBooked(date);
          const selected = isSelected(date);
          const inRange = isInRange(date);
          const todayDay = isToday(date);
          const booked = isBooked(date);

          return (
            <div
              key={i}
              className={`calendar-day font-golos text-sm
                ${disabled ? 'calendar-day-disabled' : ''}
                ${selected ? 'calendar-day-selected' : ''}
                ${inRange && !selected ? 'calendar-day-range' : ''}
                ${todayDay && !selected ? 'calendar-day-today' : ''}
                ${booked ? 'opacity-30' : ''}
              `}
              onClick={() => handleDayClick(date)}
              onMouseEnter={() => setHoverDate(date)}
              onMouseLeave={() => setHoverDate(null)}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex gap-4 text-xs font-golos">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gold" />
          <span className="text-muted-foreground">Выбрано</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full opacity-30 bg-muted-foreground" />
          <span className="text-muted-foreground">Занято</span>
        </div>
      </div>

      {(checkIn || checkOut) && (
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <div className="flex justify-between text-sm font-golos">
            <span className="text-muted-foreground">Заезд:</span>
            <span className="text-gold font-semibold">
              {checkIn ? checkIn.toLocaleDateString('ru-RU') : '—'}
            </span>
          </div>
          <div className="flex justify-between text-sm font-golos">
            <span className="text-muted-foreground">Выезд:</span>
            <span className="text-gold font-semibold">
              {checkOut ? checkOut.toLocaleDateString('ru-RU') : '—'}
            </span>
          </div>
          {getNights() > 0 && (
            <div className="flex justify-between text-sm font-golos">
              <span className="text-muted-foreground">Ночей:</span>
              <span className="text-foreground font-semibold">{getNights()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
