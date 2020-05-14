import React from "react";
import './Nameplate.css';
import SwapVert from '@material-ui/icons/SwapVert';
import IconButton from '@material-ui/core/IconButton';

export default class Nameplate extends React.Component {
    render() {
        return (
            <div className="nameplate">
                <div className="nameAndButton">
                <div className="spacer">
                    spacer
                </div>
                    <div className="name">
                        {this.props.name}
                    </div>
                    <IconButton color='secondary'>
                        <SwapVert/>
                    </IconButton>
                </div>
                {
                    this.props.hasSwapped ? <p> swapped with {this.props.oldName} </p> : null
                }
            </div>
        )
    }
}