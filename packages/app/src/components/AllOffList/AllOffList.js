import React from "react";
import { format } from 'date-fns';
import deskAllocations from '../../assets/deskAllocation.json';
import Nameplate from '../Nameplate/Nameplate';

export default class AllOffList extends React.Component {
    render() {
        return (
            <>
            <h3>
              On {format(this.props.chosenDate, "EEEE 'the' do 'of' MMMM yyyy")}: 
            </h3>
            {
              this.props.allOff.map(
                (el) => {
                  let name = el.name
                  let oldName = '';
                  let hasSwapped = false;
                  this.props.swaps.forEach((swap) => {
                    if(el.desk === swap.oldPerson) {
                      hasSwapped = true;
                      name = deskAllocations.find((x) => x.desk === swap.newPerson).name;
                      oldName = el.name
                    }
                  })
                  return <Nameplate hasSwapped={hasSwapped} key={name} name={name} oldName={oldName}></Nameplate>
                }
              )
            }
            <h3>
              may be working from home
            </h3>
            </>
        )
    }
}