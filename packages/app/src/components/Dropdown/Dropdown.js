import React from "react";
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { FormControl } from "@material-ui/core";
import './Dropdown.css'

export default class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {chosenName: ''};
    }
    render() {
        const options = this.props.options;
        const valKey = this.props.valKey;
        const displayKey = this.props.displayKey;
        const handleChange = this.props.handleChange;

        const onChange = name => event => {
            this.setState({chosenName: event.target.value})
            handleChange(event.target.value)
        };
        return (
        <>
        <div className = 'dropdown'> 
            <FormControl fullWidth>
                <InputLabel htmlFor="age-native-simple">Team Member Name</InputLabel>
                <Select
                    native
                    onChange={onChange()}
                    value={this.state.chosenName}
                >
                <option value=""/>
                {
                    options.map(el => <option value={el[valKey]} key={el[valKey]}> {el[displayKey]}</option>)
                }
                </Select>
            </FormControl>
        </div>
        </>
        )
    } 
}