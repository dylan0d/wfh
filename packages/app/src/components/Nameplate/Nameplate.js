import React from "react";
import './Nameplate.css';
import SwapVert from '@material-ui/icons/SwapVert';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

export default class Nameplate extends React.Component {
    constructor() {
        super()
        this.state = {modalOpen: false}
    }
    handleOpen = () => {
        // this.setState({modalOpen: true});
    };
    
    handleClose = () => {
        this.setState({modalOpen: false});
    };

    classes = makeStyles((theme) => ({
        paper: {
          position: 'absolute',
          width: 400,
          border: '2px solid #000',
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
        },
    }));


    render() {
        console.log('ahhhhh', this.state);
        return (
            <>
            <div className="nameplate">
                <div className="nameAndButton">
                <div className="spacer">
                    spacer
                </div>
                    <div className="name">
                        {this.props.name}
                    </div>
                    <IconButton color='secondary' onClick={this.handleOpen}>
                        <SwapVert/>
                    </IconButton>
                </div>
                {
                    this.props.hasSwapped ? <div> swapped with {this.props.oldName} </div> : null
                }
            </div>
            <Modal
                open={this.state.modalOpen}
                onClose={this.handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style = {{
                    top: `${70}%`,
                    left: `${70}%`,
                    transform: `translate(-${70}%, -${70}%)`,
                }}
                className={this.classes.paper}>
                    heyyyyy
                </div>
            </Modal>
            </>
        )
    }
}