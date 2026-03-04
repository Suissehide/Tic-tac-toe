import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(timezone)
dayjs.extend(utc)

export const timeStringToDate = (timeStr: string): Date => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number)
  return new Date(1970, 0, 1, hours, minutes, seconds, 0)
}

export const combineDateAndTime = (
  date: Date | string,
  time: Date | string,
): Date => {
  const baseDate = dayjs.utc(date)
  const baseTime = dayjs.utc(time)

  return baseDate
    .hour(baseTime.hour())
    .minute(baseTime.minute())
    .second(baseTime.second())
    .millisecond(baseTime.millisecond())
    .toDate()
}
