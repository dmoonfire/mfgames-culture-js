import * as path from "path";
import * as fs from "fs";
const expect = require("expect");
import * as Promise from "bluebird";
import { Calendar, CalendarData, CultureData, CultureDataProvider, Culture, CultureProvider, HashCultureDataProvider } from "../index";
import * as data from "mfgames-culture-data";
import Big = require("big.js");

// Set up the basic provider used for all the tests.
var dataProvider = new HashCultureDataProvider(data.combined);
var provider = new CultureProvider(dataProvider);

/**
 * Calculates the Julian Date Number from a given year, month, day.
 */
export function getJulian(
    year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0,
    second: number = 0)
    : any {
    // Figure out the data using the formula from Wikipedia.
    var a = Big(Math.floor((14 - month) / 12));
    var y = Big(year).plus(4800).minus(a);
    var m = Big(month).plus(Big(12).times(a)).minus(3);
    var t = Big(hour).div(24).plus(Big(minute).div(24).div(60)).plus(Big(second).div(24).div(60).div(60));
    var jdn = Big(day).plus(Math.floor(Number(m.times(153).plus(2).div(5)))).plus(y.times(365)).plus(Math.floor(Number(y.div(4)))).minus(Math.floor(Number(y.div(100)))).plus(Math.floor(Number(y.div(400)))).minus(32045).plus(t);
    return jdn.minus(0.5);

    //var a = Math.floor((14 - month) / 12);
    //var y = year + 4800 - a;
    //var m = month + 12 * a - 3;
    //var t = hour / 24 + minute / 24 / 60 + second / 24 / 60 / 60;
    //var jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 + t;
    //return jdn - 0.5;

    //// This was the original answer, but it is wrong.
    //var date = new Date(Date.UTC(year, month, day));
    //var time = date.getTime();
    //var jd = (time / 86400000) + 2440587.5 - 31;
    //return jd;
}

export function getJulianTime(
    hour: number = 0,
    minute: number = 0,
    second: number = 0)
    : number {
    // Figure out the data using the formula from Wikipedia.
    var t = hour / 24 + minute / 24 / 60 + second / 24 / 60 / 60;
    return t - 0.5;
}

export function getCalendar(id: string): Promise<Calendar> {
    return provider.getCalendarPromise(id);
}

export function getCulture(id: string): Promise<Culture> {
    return provider.getCulturePromise(id);
}
