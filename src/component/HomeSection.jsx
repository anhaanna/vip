import React from 'react';
import {connect} from 'react-redux';
import { generateNavigation } from "../actions/actionInitialData";
import FirstSection from './FirstSection';
import EasyBooking from './EasyBooking';
import FleetSection from './FleetSection';


class HomeSection extends React.Component{
    constructor(props) {
        super(props);
        this.props.dispatch(generateNavigation(this.props.match.params));
    }

    render(){
        return (
            <div>
                <FirstSection/>
                <EasyBooking/>
                <FleetSection/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        store : state
    }
};

export default connect(mapStateToProps)(HomeSection);