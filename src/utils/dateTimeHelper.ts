import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDateByTimezone = (
    date: string | Date,
    timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    format: string = 'MMM D, YYYY [at] HH:mm'
): string => {
    if (!date) {
        return 'invalid date';
    }

    return dayjs(date).tz(timezone).format(format);
};