import React from "react";

export default class Nameplate extends React.Component {
    render() {
        return (
            !this.props.hasSwapped ? 
                <h1>{this.props.name}</h1> : 
                <div> 
                    <h1 >{this.props.name}</h1> 
                    <p> Swapped with {this.props.oldName} </p> 
                </div>
        )
    }
}