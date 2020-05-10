import React from 'react';
import Dropdown from "./components/Dropdown/Dropdown";
import DatePicker from './components/DatePicker/DatePicker';
import AppBar from '@material-ui/core/AppBar';
import { appBarTheme } from "./style/theme";
import './App.css';
import deskAllocations from './assets/deskAllocation.json';
import { differenceInCalendarWeeks, format, getDay, addDays, subDays, addWeeks }  from 'date-fns';
import { ThemeProvider } from '@material-ui/styles';
import axios from 'axios';

const offset = 3;
const day1 = new Date(2019, 10, 4);
const forecastAmount = 5;
let noSwapsError = '';
let deskNumber = 0;
let chosenDate = new Date();
let calculatedDate = day1
let dayOffThatWeek = '';
let selectedName = '';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { dayOffThatWeek: '', chosenDate: new Date(), allOff: [], nextDays: [], swaps: [] };
    this.getSwaps(chosenDate);
  }

  async getSwaps(date) {
    const formattedDate = format(date, "yyyy-MM-dd")
    const swaps = (await axios.get(`http://localhost:5001/swapsOnDate?date=${formattedDate}`)).data;
    this.setState({swaps: swaps})
  }

  calculateDayOff() {
    const gap = Math.abs(differenceInCalendarWeeks(day1, chosenDate));
    dayOffThatWeek = ((deskNumber - 1 + (gap * offset)) % 5);
    const difference = dayOffThatWeek - (getDay(chosenDate) - 1);
    calculatedDate = addDays(chosenDate, difference);
    this.getNext(dayOffThatWeek, calculatedDate);
    this.setState({dayOffThatWeek: format(calculatedDate, "EEEE 'the' do 'of' MMMM yyyy")})
  };

  componentDidMount() { 
    console.log('mounted');
    this.findAll()
  }

  getNext(currentDay, startingWeek) {
    let i;
    const nextDays = []
    for(i=1; i<=forecastAmount; i++) {
      const thisMonday = subDays(startingWeek, (currentDay));
      nextDays.push(format(addDays(addWeeks(thisMonday, i), (currentDay + (i*offset)) % 5), "EEEE 'the' do 'of' MMMM"))
    }
    this.setState({nextDays});
  }

  handleNameSelect(selectedEntity) {
    const fullPerson = deskAllocations.find((x) => x.desk === parseInt(selectedEntity))
    deskNumber = fullPerson.desk;
    selectedName = fullPerson.name
    this.calculateDayOff();
  }

  findAll() {
    const peopleOff = [];
    deskAllocations.forEach((person) => {
      const gap = Math.abs(differenceInCalendarWeeks(day1, chosenDate));
      const theirDayOff = ((person.desk - 1 + (gap * offset)) % 5);
      if (theirDayOff === getDay(chosenDate) - 1) {
        peopleOff.push(person);
      }
    })
    this.setState({
      allOff: peopleOff
    })
  }

  async handleDateChosen(date) {
    chosenDate = date
    try {
      await this.getSwaps(chosenDate)
    } catch {
      noSwapsError = 'Swaps could not be retrieved :('
    }
    this.calculateDayOff();
    this.findAll();
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <ThemeProvider theme={appBarTheme}>
            <AppBar position="fixed">
              WFH Schedule
            </AppBar>
          </ThemeProvider>
        </div>
          <Dropdown options = {deskAllocations} valKey = 'desk' displayKey = 'name' handleChange = {this.handleNameSelect.bind(this)}/>
          <DatePicker handleChange = {this.handleDateChosen.bind(this)} label = 'Date to check'/>
        {
          selectedName && this.state.dayOffThatWeek ? 
          <>
          <div className='bordered'>
            <h3>
              {selectedName}'s WFH day that week is
            </h3> 
            <h1>
              { this.state.dayOffThatWeek }
            </h1> 
          </div>
          <div className='bordered'>
            <h3>Their next 5 WFH days are:</h3>
            {this.state.nextDays.map(el => <h2 key={el}>{el}</h2>)}
          </div>
          </> : null
        }
        {
          this.state.allOff.length > 0 ?
          <>
          <div className='bordered'>
            {noSwapsError ? <p> {noSwapsError} </p> : null}
            <h3>
              On {format(chosenDate, "EEEE 'the' do 'of' MMMM yyyy")}: 
            </h3>
            {
              this.state.allOff.map(
                (el) => {
                  let name = el.name
                  let oldName = '';
                  let hasSwapped = false;
                  this.state.swaps.forEach((swap) => {
                    if(el.desk === swap.oldPerson) {
                      hasSwapped = true;
                      name = deskAllocations.find((x) => x.desk === swap.newPerson).name;
                      oldName = el.name
                    }
                  })
                  return !hasSwapped ? <h1 key={name}>{name}</h1> : <div key={name}> <h1 >{name}</h1> <p> Swapped with {oldName} </p> </div>
                }
              )
            }
            <h3>
              may be working from home
            </h3>
          </div>
          </> : null
        }
      </div>
    );
  }
}
