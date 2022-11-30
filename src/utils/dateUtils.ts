
/**
 * @author <Aniket.P>
 * @description Date utils
 * @copyright Supra International, inc
 */

import { ObjectFactory } from "./objectFactory";
import moment from 'moment-timezone';
import momentTime from 'moment';
export class DateUtils {

    public static readonly FORMAT_DATETIME_AM_PM_12 = 'MM/DD/YYYY hh:mm a z';
    public static readonly FORMAT_DATETIME_MONTH_AM_PM_12 = 'MMM DD, YYYY hh:mm a z';
    public static readonly FORMAT_DATETIME_MONTH = 'MMM DD, YYYY';


    public static getCurrentTimeInMillis(): number {
        const timeInMillis = new Date().getTime();
        return timeInMillis;
    }

    public static formatDate(date: any, format?: string, timezone?: string): string {
        if (!timezone) {
            const context = ObjectFactory.getContext();
            if (context.sessionInfo) {
                timezone = context.sessionInfo.timezone;
            }
        }
        if (!format) {
            format = DateUtils.FORMAT_DATETIME_AM_PM_12;
        }
        return moment.tz(date, timezone as any).format(format);
    }

    public static formatTime(time: any, format?: string, timezone?: any) {
        if (!timezone) {
            const context = ObjectFactory.getContext();
            if (context.sessionInfo) {
                timezone = context.sessionInfo.timezone;
            }
        }
        if (!format) {
            format = 'hh:mm:ss';
        }
        const timeFormat = momentTime(time, format, true).format(format);
        return timeFormat;
    }

    public static getDurationText(totalMinutes: number) {
        let durationText = `${totalMinutes} Minutes`;
        if (totalMinutes >= 60) {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            let hourText = 'Hours';
            let minutesText = 'Minutes';
            if (hours === 1) {
                hourText = 'Hour';
            }
            if (minutes === 1) {
                minutesText = 'Minute';
            }
            durationText = `${hours} ${hourText}`;
            if (minutes > 0) {
                durationText += ` and ${minutes} ${minutesText}`;
            }
        }
        return durationText;
    }

    public static convertMinutesToMillis(minutes: number): number {
        return minutes ? Math.floor(minutes * 60 * 1000) : 0;
    }

    public static convertMillisToMinutes(millis: number): number {
        return millis ? Math.floor(millis / 60000) : 0;
    }
}
