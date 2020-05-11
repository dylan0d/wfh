import React from 'react';
import Dropdown from "./components/Dropdown/Dropdown";
import DatePicker from './components/DatePicker/DatePicker';
import AllOffList from './components/AllOffList/AllOffList';
import AppBar from '@material-ui/core/AppBar';
import { appBarTheme } from "./style/theme";
import './App.css';
import deskAllocations from './assets/deskAllocation.json';
import { calculateDayOff, findAll, formatDate } from './services/DateCalculatorService'
import { format }  from 'date-fns';
import { ThemeProvider } from '@material-ui/styles';
import axios from 'axios';

let noSwapsError = '';

export default class App extends React.Component {
  constructor() {
    super();
    this.state =  { 
                    dayOffThatWeek: '', 
                    chosenDate: new Date(), 
                    allOff: [], 
                    nextDays: [], 
                    swaps: [],
                    person: null
                  };
    this.getSwaps(this.state.chosenDate);
  }

  async getSwaps(date) {
    const formattedDate = format(date, "yyyy-MM-dd")
    const swaps = (await axios.get(`http://localhost:5001/swapsOnDate?date=${formattedDate}`)).data;
    this.setState({swaps: swaps})
  }

  componentDidMount() { 
    console.log('mounted');
    this.setState({
      allOff: findAll(this.state.chosenDate)
    })
  }

  handleNameSelect(selectedEntity) {
    if(selectedEntity) {
      const person = deskAllocations.find((x) => x.desk === parseInt(selectedEntity))
      const {calculatedDate, nextDays} = calculateDayOff(person.desk, this.state.chosenDate);
      this.setState({nextDays, person, dayOffThatWeek: formatDate(calculatedDate, true)})
    } else {
      this.setState({
        person: null
      })
    }
  }

  async handleDateChosen(date) {
    this.setState({chosenDate: date})
    try {
      await this.getSwaps(date)
    } catch {
      noSwapsError = 'Swaps could not be retrieved :('
    }
    if(this.state.person) {
      const {calculatedDate, nextDays} = calculateDayOff(this.state.person.desk, date);
      this.setState({nextDays, chosenDate: date, dayOffThatWeek: formatDate(calculatedDate, true)})
    }
    this.setState({
      allOff: findAll(date)
    })
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
          <Dropdown options = {deskAllocations} 
                    valKey = 'desk' 
                    displayKey = 'name' 
                    handleChange = {this.handleNameSelect.bind(this)}
          />
          <DatePicker handleChange = {this.handleDateChosen.bind(this)} label = 'Date to check'/>
        {
          this.state.person && this.state.dayOffThatWeek ? 
          <>
          <div className='bordered'>
            <h3>
              {this.state.person.name}'s WFH day that week is
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
            <AllOffList 
              chosenDate={this.state.chosenDate} 
              swaps={this.state.swaps} 
              allOff={this.state.allOff}
            />
          </div>
          </> : null
        }
      </div>
    );
  }
}
