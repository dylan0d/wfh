import { differenceInCalendarWeeks, getDay, addDays, subDays, addWeeks, format } from 'date-fns';
import deskAllocations from '../assets/deskAllocation.json';

const offset = 3;
const day1 = new Date(2019, 10, 4);
const forecastAmount = 5;

export function calculateDayOff(deskNumber, date) {
    const gap = Math.abs(differenceInCalendarWeeks(day1, date));
    const dayOffThatWeek = ((deskNumber - 1 + (gap * offset)) % 5);
    const difference = dayOffThatWeek - (getDay(date) - 1);
    const calculatedDate = addDays(date, difference);
    const nextDays = getNext(dayOffThatWeek, calculatedDate);
    return { calculatedDate, nextDays };
}

function getNext(currentDay, startingWeek) {
    let i;
    const nextDays = []
    for(i=1; i<=forecastAmount; i++) {
      const thisMonday = subDays(startingWeek, (currentDay));
      nextDays.push(formatDate(addDays(addWeeks(thisMonday, i), (currentDay + (i*offset)) % 5)))
    }
    return nextDays;
}

export function formatDate(date, withYear) {
    return format(date, `EEEE 'the' do 'of' MMMM${withYear ? ' yyyy': ''}`)
}

export function findAll(date) {
    const peopleOff = [];
    deskAllocations.forEach((person) => {
      const gap = Math.abs(differenceInCalendarWeeks(day1, date));
      const theirDayOff = ((person.desk - 1 + (gap * offset)) % 5);
      if (theirDayOff === getDay(date) - 1) {
        peopleOff.push(person);
      }
    })
    return peopleOff
  }
