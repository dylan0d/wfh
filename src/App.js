import React from 'react';
import Dropdown from "./components/Dropdown/Dropdown";
import DatePicker from './components/DatePicker/DatePicker';
import AppBar from '@material-ui/core/AppBar';
import { appBarTheme } from "./style/theme";
import './App.css';
import deskAllocations from './assets/deskAllocation.json';
import { differenceInCalendarWeeks, format, getDay, addDays }  from 'date-fns';
import { ThemeProvider } from '@material-ui/styles';

const offset = 3;
const day1 = new Date(2019, 10, 4);
let deskNumber = 0;
let chosenDate = day1;
let calculatedDate = day1
let dayOffThatWeek = '';
let selectedName = '';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { dayOffThatWeek: '', chosenDate: new Date(), allOff: [] };
  }

  calculateDayOff() {
    const gap = Math.abs(differenceInCalendarWeeks(day1, chosenDate));
    dayOffThatWeek = ((deskNumber - 1 + (gap * offset)) % 5);
    const difference = dayOffThatWeek - (getDay(chosenDate) - 1);
    calculatedDate = addDays(chosenDate, difference);
    this.setState({dayOffThatWeek: format(calculatedDate, "EEEE 'the' do 'of' MMMM yyyy")})
  };

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
        peopleOff.push(person.name);
      }
    })
    console.log(peopleOff)
    this.setState({
      allOff: peopleOff
    })
  }

  handleDateChosen(date) {
    chosenDate = date
    console.log(chosenDate);
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
          </> : null
        }
        {
          this.state.allOff.length > 0 ?
          <>
          <div className='bordered'>
            <h3>
              On {format(calculatedDate, "EEEE 'the' do 'of' MMMM yyyy")}: 
            </h3>
            {this.state.allOff.map(el => <h1 key={el}>{el}</h1>)}
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
