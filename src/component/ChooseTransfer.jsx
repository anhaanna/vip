import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { I18n } from 'react-i18nify';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import { fetchData } from "../services/RequestService";
import {
    SetDestinationList,
    setBookingStep2,
    setCarTypes
} from '../actions/actionInitialData';


class ChooseTransfer extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            redirect : false,
            pickup_date_time: this.props.step1.pickup_date_time,
            required: [],
            selected : {
                pickup_id : this.props.step1.pickup_id,
                dropoff_id : this.props.step1.dropoff_id
            }
        };
    };

    handleChange = (date) => {
        let required = [...this.state.required].filter(val => val !== 'pickupDateTime');
        this.setState({
            pickup_date_time: date,
            required
        });
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.destinationList.length) {
            this.getDestinationList();
        }
    };
    /*componentDidMount() {
        this.props.dispatch(fetchData({
            url: 'crearorder'
        }));
    }*/

    getPickupList = () => {
        return this.props.pickupList.map(item => {
            return {
                value : item.id,
                label : item.title,
                icon: item.icon
            }
        });
    };
    getDestinationList = () => {
        return (this.props.destinationList[0] || []).map(item => {
            return {
                value : item.id,
                label : item.title,
                icon: item.icon
            }
        });
    };

    setStep1 = () => {
        let data = this.state.selected;
        data.pickup_date_time = this.state.pickup_date_time;
        this.props.dispatch(setBookingStep2(data));
        data.pickup_date_time = this.state.pickup_date_time === null ? null : this.state.pickup_date_time.format('Y-MM-DD');
        let required = [];

        if(data.dropoff_id === null || !data.dropoff_id){
            required.push('dropOffId');
        }
        if(data.pickup_date_time === null){
            required.push('pickupDateTime');
        }
        if(data.pickup_id === null || !data.pickup_id){
            required.push('pickupId');
        }

        if(required.length) {
            this.setState({
                required: [...this.state.required, ...required]
            });
            return;
        }
        this.setState({redirect : 'booking/availableCars/'});
        this.props.dispatch(fetchData({
            method: 'GET',
            url: 'cartypes/',
            callback: setCarTypes,
            params : data
        }));
    };

    changePickup = (event) => {
        let value = event === null ? '' : event.value;
        let required = [...this.state.required].filter(val => val !== 'pickupId');
        this.setState({
            selected : {
                pickup_id: value,
                dropoff_id : ''
            },
            required
        });
        if(value === '') {
            return;
        }
        this.props.dispatch(fetchData({
            method: 'GET',
            url: 'points/' + value,
            callback : SetDestinationList
        }));
    };

    changeDestination = (event) => {
        let value = event === null ? '' : event.value;
        let required = [...this.state.required].filter(val => val !== 'dropOffId');
        this.setState({
            selected : {
                ...this.state.selected,
                dropoff_id : value,
            },
            required
        });
    };

    render() {
        if( this.state.redirect ) {
            return <Redirect to={'/' + this.props.activeLang.code + '/' + this.state.redirect}/>
        }

        return (
            <div className="filterHome">
                <div className={this.state.required.indexOf('pickupId') === -1 ? '' : 'errorForm'}>
                    <span>{ I18n.t('pickupLocation') }</span>
                    <Select
                        placeholder="Select..."
                        onChange={this.changePickup}
                        name="form-field-name"
                        value={this.state.selected.pickup_id}
                        options={this.getPickupList()}
                    />
                </div>
                <div className={this.state.required.indexOf('dropOffId') === -1 ? '' : 'errorForm'}>
                    <span>{ I18n.t('destination') }</span>
                    <Select
                        test={this.state.selected.dropoff_id}
                        onChange={this.changeDestination}
                        name="form-field-name"
                        value={this.state.selected.dropoff_id}
                        options={this.getDestinationList()}
                    />
                </div>
                <div className={this.state.required.indexOf('pickupDateTime') === -1 ? 'dataPickerStyle' : 'errorForm dataPickerStyle'}>
                    <span>{ I18n.t('date') }</span>
                    <DatePicker
                        dateFormat="DD-MM-YYYY"
                        minDate={new Date(Date.now())}
                        selected={this.state.pickup_date_time}
                        onChange={this.handleChange}
                    />
                </div>
                <div>
                    <span/>
                    <button
                        className="carIcon"
                        onClick={this.setStep1}>
                    </button>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        activeLang : state.LangReducer.activeLang,
        pickupList : state.BookingReducer.pickupList,
        destinationList : state.BookingReducer.destinationList,
        step1: state.BookingReducer.bookings.step1
    };
};
export default connect(mapStateToProps)(ChooseTransfer);