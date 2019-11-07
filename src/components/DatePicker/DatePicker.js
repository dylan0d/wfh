import React from "react";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { isValid } from 'date-fns'

export default class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedDate: new Date()};
    }
    render() {
        const handleChange = this.props.handleChange;
        const label = this.props.label;
        const onChange = event => {
            if (isValid(event)) {
                this.setState({selectedDate: event});
                handleChange(event);
            }
        };
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disablePast
                    margin="normal"
                    id="date-picker-dialog"
                    label={label}
                    format="dd/MM/yyyy"
                    value={this.state.selectedDate}
                    onChange={onChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
        );
    }

}