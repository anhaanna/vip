import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import {fetchData, post} from "../services/RequestService";
import { getOrder } from "../actions/actionInitialData";
import ReCAPTCHA from "react-google-recaptcha";
import ReactGA from 'react-ga';

import  {GaPurchase}  from './dump/SetReactGA';


class Confirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            captcha: null,
            selected: { ...this.props.bookings.step5 }
        }
    }

    componentWillReceiveProps() {
        this.setState({
            selected: { ...this.props.bookings.step5 }
        });
    }

    getPrices = () => {
        return (this.props.carType.prices || [])
            .filter( val  => val.id === this.props.carInfo.tb_currency_id)
            .map(val => <span key={val.id}><b>{val.price + ' ' + val.title}</b></span>);
    };

    getReturnPrices = () => {
        return (this.props.carType.return_prices || [])
            .filter( val  => val.id === this.props.carInfo.tb_currency_id)
            .map(val => <span key={val.id}><b>{val.price + ' ' + val.title}</b></span>);
    };




    getFrom = () => {
        let { carInfo } = { ...this.props };
        return (carInfo.route.pickup.fields || []).map( ( val, key ) => {
            if(carInfo.pickup_details[key] === undefined){
                return null;
            }
            return  <div className="paymentInfo" key={val.title}>
                        <span> {val.title} </span>
                        <span><b> { carInfo.pickup_details[key].value } </b></span>
                    </div>
        });
    };

    getTo = () => {
        let { carInfo } = { ...this.props };
        return (carInfo.route.dropoff.fields || []).map( ( val, key ) => {
            return  <div className="paymentInfo" key={val.title}>
                        <span> {val.title} </span>
                        <span><b>{ carInfo.dropoff_details !== null && carInfo.dropoff_details[key] ? carInfo.dropoff_details[key].value : '-' }</b></span>
                    </div>
        });
    };

    getExtras = () => {
        let { extra_fields } = this.props.carInfo;
        return (extra_fields || [] ).map( extra => {
            return <div className="infoDetails" key={extra.title}>
                <span><i id={'extra_'+ extra.id} className="fa" aria-hidden="true"></i>{ extra.title }</span>
                <span>{extra.count || '-'}</span>
            </div>;
        })
    };

    getExtraSum = (onlyPrice) => {
        if(this.props.carType === undefined  ) return 0;
        let extra_fields = [ ...this.props.carType.extra_fields ];
        let {extra} = this.props.bookings.step4;
        let {carInfo} = this.props;
        let price = 0;
        let currency = '';
        Object.keys(extra).forEach( key => {
            let count = extra[key].value || 0;
            extra_fields.forEach(val => {
                if(val.id === Number(key)) {
                    for(let i = 0; i < val.prices.length; i++ ){
                        if(val.prices[i].id === this.state.selected.tb_currency_id){
                            currency = val.prices[i].title;
                            price += val.prices[i].price * count ;
                            break;
                        }
                    }
                }
            })
        });
        if(+carInfo.returntrip === 1) {
            price = Number(price) * 2;
        }

        if(onlyPrice){
            return Number(price);
        }
        return price ?
            <div className="infoDetails">
                <span><i className="fa fa-tag" aria-hidden="true"></i>
                { I18n.t('extraPrice') } </span>
                <span>{price + ' ' + currency}</span>
            </div>: false;
    };

    getCurrentTotalPrice = () => {
        let currencyId = this.state.selected.tb_currency_id || this.props.carInfo.tb_currency_id;
        let {carInfo} = this.props;
        let price = {...(this.props.carType.prices || []).filter( val =>  val.id === currencyId)[0]};
        let return_prices = {...(this.props.carType.return_prices || []).filter( val =>  val.id === currencyId)[0]};
        if(+carInfo.returntrip === 1) {
            price.price = Number(price.price) + Number(return_prices.price);
        }

        return Number(price.price) + this.getExtraSum('onlyPrice') + ' ' + price.title;
    };

    componentWillMount() {
        if(this.props.carInfo === undefined || Object.keys(this.props.carInfo).length === 0) {
            this.props.dispatch(fetchData({
                method: "GET",
                url: "getorder",
                callback: getOrder,
                callbacks: [(data) => this.props.checkForRedirect(data, 'extras')]
            }))
        }
    }

    makeBooking = () => {
        let data = {
            tb_currency_id: this.props.carInfo.tb_currency_id,
            captcha: this.state.captcha,
            from: this.props.carInfo.route.pickup.title,
            to: this.props.carInfo.route.dropoff.title,
            total_price: this.getCurrentTotalPrice(),
            total_price_currency: this.getCurrentTotalPrice().split(" ", 2),
            transaction_number: this.props.transactionNumber
        };


        var time = Date.now();

        this.props.dispatch(post({
            method: "POST",
            url: "saveorder",
            data: data,
            callbacks : [(data) => {
                if(data.message && data.message && data.message.status === "success"){

                    if(this.props.transactionNumber &&  this.props.carType &&   this.props.carInfo){
                        let route_from=this.props.carInfo.route.pickup.title
                        let route_to=this.props.carInfo.route.dropoff.title
                        let transactionNumber=this.props.transactionNumber

                        GaPurchase(data.order,transactionNumber,route_from,route_to)
                    }


                    setTimeout(()=> {
                        if(data.message.redirect_url === "") {
                            window.location.href = window.location.origin;
                        } else {
                            window.location.href = data.message.redirect_url;
                        }

                    },500)
                }
            }]
        }));
    };

    render() {
        let {carType, carInfo} = this.props;
        let showReturnDate = Number(carInfo && carInfo.returntrip) === 1;

        return (
            <div className="container">
                { carType !== undefined &&
                <div>
                    <h3 className="bookingRoute">{ I18n.t('transferServiceOfferFrom') } <b>{carInfo.route.pickup.title}</b> { I18n.t('to') } <b>{carInfo.route.dropoff.title} ({carInfo.route.distance} KM)</b></h3>
                    <div className="carDetails">
                        <div>
                            <p>{carType.title}</p>
                            <div className="carDetailsImg">
                                <img
                                    src={'https://api.alptransfer.com/storage/tbcartypes/' + carType.image}
                                    alt={carType.title}/>
                            </div>
                            <div className="firstInfoStyle">
                                <div className="infoDetails">
                                    <span><i className="fa fa-calendar-o" aria-hidden="true"></i> 
                                    { I18n.t('travelDate') }</span>
                                    <span className="twoRow">
                                        <p className="noMargin">{carInfo.pickup_date_time}</p>
                                        <span className="textRight">{ carInfo.pickup_time !== null && carInfo.pickup_time }</span>
                                    </span>
                                </div>
                                {
                                    showReturnDate &&
                                    <div className="infoDetails">
                                        <span><i className="fa fa-calendar-o" aria-hidden="true"></i> 
                                        { I18n.t('returnDate') }</span>
                                        <span className="twoRow">
                                            <p className="noMargin">{carInfo.return_date_time}</p>
                                            <span className="textRight">{ carInfo.return_time !== null && carInfo.return_time }</span>
                                        </span>
                                    </div>
                                }
                                <div className="infoDetails">
                                    <span><i className="fa fa-clock-o" aria-hidden="true"></i>
                                    { I18n.t('journeyDuration') }</span>
                                    <span>{carType.duration || 0}</span>
                                </div>
                                <div className="borderDetails"> </div>
                                <div className="infoDetails">
                                    <span><i className="fa fa-male" aria-hidden="true"></i>
                                    { I18n.t('adults') }</span>
                                    <span>{carInfo.adults || '-'}</span>
                                </div>
                                <div className="infoDetails">
                                    <span><i className="fa fa-child" aria-hidden="true"></i>
                                    { I18n.t('children') }</span>
                                    <span>{carInfo.medium_children + carInfo.small_children || '-'}</span>
                                </div>
                                <div className="borderDetails"> </div>
                                <div className="infoDetails">
                                    <span><i className="fa fa-briefcase" aria-hidden="true"></i>
                                    { I18n.t('smallLuggage') }</span>
                                    <span>{carInfo.small_suitcase || '-'}</span>
                                </div>
                                <div className="infoDetails">
                                    <span><i className="fa fa-suitcase" aria-hidden="true"></i>
                                    { I18n.t('mediumLuggage') }</span>
                                    <span>{carInfo.medium_suitcase || '-'}</span>
                                </div>
                                <div className = "extraDiv"> 
                                    { this.getExtras() } </div>
                                <div className="borderDetails"> </div>
                                <div className="infoDetails" >
                                    <span><i className="fa fa-tag" aria-hidden="true"></i>
                                    { I18n.t('carPrice') }</span>
                                   { this.getPrices() }
                                </div>
                                { +carInfo.returntrip === 1 &&
                                    <div className="infoDetails">
                                        <span><i className="fa fa-tag" aria-hidden="true"></i>
                                        {I18n.t('returnPrice')}</span>
                                        {this.getReturnPrices()}
                                    </div>
                                }
                                { this.getExtraSum() }
                                <div className="borderDetails"> </div>
                                <div className="infoDetails">
                                    <span><i className="fa fa-tags" aria-hidden="true"></i>
                                    <b>{ I18n.t('totalPrice') }</b> </span>
                                    <span><b>{ this.getCurrentTotalPrice() }</b></span>
                                </div>
                            </div>
                        </div>
                        <div className="width66">
                            <div className="firstInfoStyle">
                                <div className="infoDetails">
                                    <span>{ I18n.t('personalInformation') }</span>
                                    <span />
                                </div>
                                <div className="paymentInfo">
                                    <span>{ I18n.t('name') } *</span>
                                    <span><b>{ carInfo.name }</b></span>
                                </div>
                                <div className="paymentInfo">
                                    <span>{ I18n.t('surname') } *</span>
                                    <span><b>{ carInfo.surname }</b></span>
                                </div>
                                <div className="paymentInfo">
                                    <span>{ I18n.t('email') } *</span>
                                    <span><b>{ carInfo.email }</b></span>
                                </div>
                                <div className="paymentInfo">
                                    <span>{ I18n.t('mobilePhoneNumber') } *</span>
                                    <span><b>{ carInfo.phone }</b></span>
                                </div>
                                <div className="paymentInfo">
                                    <span>{ I18n.t('country') } *</span>
                                    <span><b>{ carInfo.country }</b></span>
                                </div>
                                <div className="paymentInfo">
                                    <span>{ I18n.t('city') } *</span>
                                    <span><b>{ carInfo.city }</b></span>
                                </div>
                                <div className="paymentInfo">
                                    <span>{ I18n.t('postcode') } *</span>
                                    <span><b>{ carInfo.postcode }</b></span>
                                </div>
                                <div className="paymentInfo">
                                    <span>{ I18n.t('address') } *</span>
                                    <span><b>{ carInfo.address }</b></span>
                                </div>
                                <div className="paymentBorder" />
                                <div className="infoDetails">
                                    <span className="lineHeightNormal">{ I18n.t('from') }</span>
                                    <span className="lineHeightNormal textLeft"><b>{ carInfo.route.pickup.title }</b></span>
                                </div>
                                { this.getFrom() }
                                { carInfo.pickup_address !== null &&
                                <div className="paymentInfo">
                                    <span>{ I18n.t('pickupAddress') }*</span>
                                    <span><b>{ carInfo.pickup_address }</b></span>
                                </div>
                                }
                                <div className="paymentBorder"/>
                                <div className="infoDetails">
                                    <span className="lineHeightNormal">{ I18n.t('to') }</span>
                                    <span className="lineHeightNormal textLeft"><b>{ carInfo.route.dropoff.title }</b></span>
                                </div>
                                { this.getTo() }
                                { carInfo.dropoff_address !== null &&
                                <div className="paymentInfo">
                                    <span>{ I18n.t('dropOffAddress') }*</span>
                                    <span><b>{ carInfo.dropoff_address }</b></span>
                                </div>
                                }

                                <div className="infoDetails">
                                    <div className="paymentInfo">
                                        <span>{ I18n.t('messageOptional') }</span>
                                        <span>{ this.state.selected.message }</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="floatLeft">
                                        <ReCAPTCHA
                                            ref="recaptcha"
                                            sitekey="6Ld1IGUUAAAAAEjAvQ7JhQGmKdQrklD0I2IRK5Z7"
                                            onChange={ data => { this.setState({captcha : data})} }
                                        />
                                    </div>
                                    <div className="textRight floatRight marginTop30">
                                        <button className="btn red" onClick={this.makeBooking }>{ I18n.t('makeBooking') } ></button>
                                    </div>
                                    <div className="clear" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        activeLang: state.LangReducer.activeLang,
        bookings: state.BookingReducer.bookings,
        carInfo: state.BookingReducer.infoAndPayment.carInfo,
        carType: state.BookingReducer.infoAndPayment.carType,
        transactionNumber:state.GoogleAnanlyticsReducer.transactionNumber

    }
};

export default connect(mapStateToProps)(Confirmation);