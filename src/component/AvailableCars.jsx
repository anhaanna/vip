import React from 'react';
import moment from "moment/moment";
import history from '../history';
import Car from './Car';
import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import { fetchData } from "../services/RequestService";
import CustomDatePicker from "./dump/CustomDatePicker";
import {
    getOrder,
    setCarTypes,
    setCarType, setNotification
} from "../actions/actionInitialData";


class AvailableCars extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            return_date_time : moment(),
            selected: { ...this.props.bookings.step2 },
            showBuses : false,
            required : false
        }
    }

    /**
     * set initial State
     */
    componentWillReceiveProps() {
        this.setState({
            selected: { ...this.props.bookings.step2 }
        });
    }

    /**
     * divaidet car types buses and car
     * @param isBusses
     * @returns {any[]}
     */
    getCarTypes = (isBusses) => {
        let { carTypes } = this.props.carTypes;
        if(carTypes === undefined) return;

        if(isBusses) {
            return (carTypes.buses || []).map(val => {
                return <Car key={ val.image } data={val} getDetails={this.getDetails} />
            });
        }
        return (carTypes.cars || []).map(val => {
            return <Car key={ val.image } data={val} getDetails={this.getDetails} />
        });

    };

    /**
     * get car Details
     * @param currencyId
     * @param carId
     */
    getDetails = (currencyId , carId) => {
        let params = {
            tb_currency_id: currencyId,
            returntrip: this.state.selected.returntrip,
            pickup_id: this.state.selected.pickup_id,
            dropoff_id: this.state.selected.dropoff_id
        };
        if(+this.state.selected.returntrip === 1) {
            if( !this.state.selected.return_date_time ) {
                this.setState({ required : true });
                this.props.dispatch(setNotification([{
                    status: 'error',
                    result: I18n.t('errorMessageReturnDataTime')
                }]));
                return ;
            }
            if (this.state.selected.return_date_time < this.state.selected.pickup_date_time) {
                this.setState({
                    selected: {
                        ...this.state.selected,
                        return_date_time: this.state.selected.pickup_date_time
                    }

                });
            }
            params.return_date_time = this.state.selected.return_date_time.format('Y-MM-DD')

        }
        let lang = this.props.activeLang.code;
        this.props.dispatch(fetchData({
            method: 'GET',
            url: 'cartype/'+carId,
            callback: setCarType,
            params: params,
            callbacks: [(data => {
                if(data && data.redirect) {
                    history.push('/' + lang + '/' + data.redirect );
                }

                if(data && data.booking_data) {
                    history.push('/' + lang + '/booking/details/');
                }
            })]
        }));
    };

    /**
     * function get initial CarList when ural have alias
     * @param urlStr
     */
    getCarsByAlias = (urlStr) => {
        this.props.dispatch(fetchData({
            method: "GET",
            url: 'booking/' + urlStr,
            callback: setCarType,
            callbacks: [()=> this.getInitialCars()]
        }));
    };

    /**
     * function for get initial car list and setOrder current state
     */
    getInitialCars = () => {
        let { carTypes, carInfo } = this.props.carTypes;
        let {dropoff_id, pickup_id} = this.props.bookings.step2;
        if( dropoff_id === null || carTypes === undefined || dropoff_id !== carInfo.route.dropoff.id || pickup_id !== carInfo.route.pickup.id) {
            let thad = this;
            this.props.dispatch(fetchData({
                method: "GET",
                url: "getorder",
                callback: getOrder,
                callbacks: [(data) => this.props.checkForRedirect(data, 'details'), function (data) {
                    thad.props.dispatch(fetchData({
                        method: 'GET',
                        url: 'cartypes/',
                        callback: setCarTypes,
                        params : {
                            pickup_date_time: data.booking_data.pickup_date_time,
                            pickup_id: data.booking_data.route.pickup.id,
                            dropoff_id: data.booking_data.route.dropoff.id,
                        }
                    }));
                }]
            }));
        }
    };

    componentWillMount() {
        let { urlStr } = this.props;
        if(urlStr) {
            this.getCarsByAlias(urlStr);
        } else {
            this.getInitialCars();
        }

    }

    /**
     * change return trip for order
     * @param event
     */
    changeReturntrip = (event) => {
        let selected = { ...this.state.selected };
        selected.returntrip = event.target.checked ? '1' : 0;

        if (selected.returntrip === '1' && selected.return_date_time === undefined) {
            selected.return_date_time = moment(selected.pickup_date_time);
        }

        this.setState({
            selected
       })
    };

    /**
     * set or update return Date
     * @param date
     */
    changeReturnTime = (date) => {
        let selected = { ...this.state.selected };
        selected.return_date_time = date;
        selected.returntrip = date === null ? 0 : '1';


        this.setState({
            selected
        });
    };

    render() {
        let { carInfo } = this.props.carTypes;
        let minDate = new Date(Date.now());
        if(carInfo !== undefined){
            let arr = carInfo.pickup_date_time.split('-');
            minDate = new Date(arr[2], arr[1]-1, arr[0], '00', '00');
        }
        return (
            <div className="container">
                {
                    carInfo !== undefined &&
                    <h1 className="bookingRoute">{ I18n.t('transferServiceOfferFrom') } <b>{carInfo.route.pickup.title}</b> { I18n.t('to') } <b>{carInfo.route.dropoff.title} ({carInfo.route.distance} KM)</b></h1>
                }
                <div className="returnDate">
                    <div className="floatLeft flex dateCheckBox">
                        <input
                            name="isGoing"
                            type="checkbox"
                            id="return_tr_checkbox"
                            checked={this.state.selected.returntrip === '1'}
                            onChange={ this.changeReturntrip } />
                        <label htmlFor="return_tr_checkbox">{ I18n.t('addReturnTransfer') }</label>
                        <i className="fa fa-refresh marginLeft10"> </i>
                    </div>
                    <div className={this.state.required ? 'floatLeft flex relative marginLeft40 errorForm' : 'floatLeft flex relative marginLeft40'}>
                        <label htmlFor="returndate">
                            <span className="returnName">{ I18n.t('returnDate') }</span>
                        </label>
                        <CustomDatePicker id="returndate"
                            dateFormat="DD-MM-YYYY"
                            minDate={minDate}
                            selected={this.state.selected.return_date_time && this.state.selected.return_date_time > minDate ? moment(this.state.selected.return_date_time) : moment(this.state.selected.pickup_date_time) }
                            onChange={this.changeReturnTime}
                        />
                        <label htmlFor="returndate">
                            <i className="fa fa-calendar iconCalendar" aria-hidden="true"> </i>
                        </label>
                    </div>
                    <div className="clear"> </div>
                </div>
                {this.getCarTypes()}
                {
                    this.state.showBuses ?  this.getCarTypes(true) :
                        <div className="textCenter">
                            <button className="btn red marginBottom50" onClick={()=>this.setState({showBuses : true})}>{ I18n.t('moreV') }</button>
                        </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        activeLang : state.LangReducer.activeLang,
        carTypes : state.BookingReducer.carTypes,
        bookings : state.BookingReducer.bookings
    };
};
export default connect(mapStateToProps)(AvailableCars);
