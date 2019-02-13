import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import moment from 'moment';
import history from "../history";
import { I18n } from 'react-i18nify';
import { fetchData, post } from '../services/RequestService';
import ReactGoogleMapLoader from 'react-google-maps-loader';
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import {
    getOrder,
    setBookingStep5,
    setInfoAndPayment, setNotification,setTransactionNumber
} from '../actions/actionInitialData';
import {
    NavLink
} from 'react-router-dom';

import  {EcommerceReactGAUrl,addToCart,beginCheckout,checkoutProgress}  from './dump/SetReactGA';

class InfoAndPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            required: [],
            showPaymentForm: false,
            selected: this.props.bookings.step5,
            card: {
                card_type: "master_card",
                card_name: "",
                card_number: "",
                valid_month: 1,
                valid_year:  moment().year(),
                card_cvv: "",
            },
            pickup: "",
            dropoff: "",
            pickupValue: "",
            dropoffValue: "",
            isGoing:0
        };



    }

    /**
     * set initial state
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: { ...nextProps.bookings.step5 }
        });
    };

    /**
     * get extras list
     * @returns {any[]}
     */
    getExtras = () => {
        let { extra_fields } = this.props.carInfo;
        return (extra_fields || [] ).map( extra => {
            return <div className="infoDetails" key={extra.title}>
                        <span><i id={'extra_'+ extra.id} className="fa" aria-hidden="true"></i>{ extra.title }</span>
                        <span>{extra.count || '-'}</span>
                    </div>;
        })
    };

    /**
     * change price
     * @param event
     */
    changePrice = event => {
        let selected = { ...this.state.selected };
        selected.tb_currency_id = event === null ? null : event.value;
        selected.tb_currency_id_return = event === null ? null : event.value;
        this.setState({ selected });
    };


    changeReturnPrice = (event) => {

        let selected = { ...this.state.selected };
        selected.tb_currency_id_return = event === null ? null : event.value;
        selected.tb_currency_id = event === null ? null : event.value;
        this.setState({selected : selected});
    };



    /**
     * set selected currency
     * @param id
     */
    setPrice = id => {
        let selected = { ...this.state.selected };
        selected.tb_currency_id = id || null;
        this.setState({ selected });
    };

    setPriceReturn = (id) => {
        let selected = { ...this.state.selected };
        selected.tb_currency_id_return = id;
        this.setState({selected : selected});
    };

    /**
     * get prices and set default currency
     * @returns {{value: *, label: string}[]}
     */
    getPrices = () => {
        if( this.state.selected.tb_currency_id === null && this.props.carInfo.tb_currency_id !== null ) {
            this.setPrice(this.props.carInfo.tb_currency_id);
        }
        return (this.props.carType.prices || []).map((val) => {
            return {
                value : val.id,
                label : val.price + ' ' + val.title
            };
        });
    };

    getReturnPrices = () => {
        if( this.state.selected.tb_currency_id_return === null  || this.state.selected.tb_currency_id_return === undefined ) {
            this.setPriceReturn(this.props.carInfo.tb_currency_id);
        }
        return (this.props.carType.return_prices || []).map((val) => {
            return {
                value : val.id,
                label : val.price + ' ' + val.title
            };
        });
    };





    /**
     * change return trip
     * @param event
     */
    changeReturntrip = (event) => {
        let selected = { ...this.state.selected };
        console.log(selected);
        selected.isGoing = event.target.checked ? 1 : 0;

        this.setState({
            selected
       })
    };

    /**
     * get payments
     * @returns {any[]}
     */
    getPayments = () => {
        let { payment_methods } = this.props.carInfo;
        return ( payment_methods || [] ).map( payment => {
            //let isChecked = Number(this.state.selected.tb_payment_method_id) ===  payment.id;
            let isChecked = true;
            return <label
                        className="radioStyle"
                        key={payment.title }>
                        <input
                            type="radio"
                            checked={isChecked}
                            name="tb_payment_method_id"
                            value={ payment.id }
                            onChange={ this.changeInput }
                        />
                        <span className="checkmark"> </span>
                        <span>{ payment.title }</span>
                        <span className="small-font">
                            { (payment.tax > 0 ? '('+I18n.t('include_fee') + ' ' + payment.tax + '%)' : '') }
                        </span>
                    </label>;
        });
    };

    /**
     * check email valid or not
     * @param email
     * @returns {boolean}
     */
    validateEmail = (email) => {
        var re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    /**
     * set order step
     */
    setStep5 = () => {
        let required = [];
        let info = { ...this.props.carInfo };
        let selected = { ...this.state.selected };
        delete info.extra_cost;
        delete info.extra_fields;
        delete info.payment_methods;
        delete info.route;
        let data = {
            ...info,
            ...selected,
            ...this.state.card
        };
        if (!data.isGoing) {
        	required.push('isGoing');
        }
        if(!data.name || data.name === null){
            required.push('name');
        }
        if(!data.surname || data.surname === null){
            required.push('surname');
        }
        if(!data.country || data.country === null){
            required.push('country');
        }
        if(!data.city || data.city === null){
            required.push('city');
        }
        if(!data.postcode || data.postcode === null){
            required.push('postcode');
        }
        if(!data.address || data.address === null){
            required.push('address');
        }
        if(!data.email || data.email === null || !this.validateEmail(data.email)){
            required.push('email');
        }
        if(!data.phone || data.phone === null || data.phone.match(/^\+?\d+[0-9]{6,13}$/) === null ){
            required.push('phone');
        }
        if(data.tb_payment_method_id !== "1" && data.tb_payment_method_id !== 1) {
            if (!data.card_name || data.card_name === null) {
                required.push('card_name');
            }
            if (!data.card_number || (data.card_number + "").length !== 16) {
                required.push('card_number');
            }

            if (!data.card_cvv || !((data.card_cvv + "").length === 3 || (data.card_cvv + "").length === 4)) {
                required.push('card_cvv');
            }
        }

        if(required.length) {
            this.setState({
                required
            });
            let errorMessageList = required.map((val) => {
                let message;
                switch (val) {
                    case 'email':
                        message = (!data.email || data.email === null)? I18n.t('errorMessageEmail') : I18n.t('errorMessageEmailFormat');
                        break;
                    case 'phone':
                        message = (!data.phone || data.phone === null)? I18n.t('errorMessagePhone') : I18n.t('errorMessagePhoneFormat');
                        break;
                    default :
                        message = I18n.t('errorMessage'+val.charAt(0).toUpperCase() + val.slice(1));

                }
                return message;
            });
            this.props.dispatch(setNotification([{
                status: 'error',
                result: errorMessageList
            }]));

            setTimeout(() => {
                let errorItem = document.querySelectorAll('.errorForm')[0];
                errorItem.scrollIntoView();
            }, 100);
            return;
        }

        this.props.dispatch(setBookingStep5({ ...this.state.selected }));
        let lang = this.props.activeLang.code;
        this.props.dispatch(post({
            method: 'POST',
            url: 'confirmation',
            data: data,
            callback:setInfoAndPayment,
            callbacks: [(data => {
                if(data && data.redirect) {
                    history.push('/' + lang + '/' + data.redirect );
                }

                if(data && data.booking_data) {
                    const gtag = window.gtag;
                    gtag('event', 'click', {
                        'event_category': 'button',
                        'event_label': 'infoPayment',
                    });

                    if(this.props.transactionNumber &&  this.props.carType &&   this.props.carInfo){

                        let route_from=this.props.carInfo.route.pickup.title
                        let route_to=this.props.carInfo.route.dropoff.title
                        let price_USD=this.props.carType.prices[2].price
                        let transactionNumber=this.props.transactionNumber
                        addToCart(transactionNumber,price_USD,route_from,route_to)
                        beginCheckout(transactionNumber,price_USD,route_from,route_to)
                        checkoutProgress(transactionNumber,price_USD,route_from,route_to)
                    }


                    history.push('/' + lang + '/booking/confirmation/' );
                }
            })]
        }));

    };

    /**
     * get years
     * @returns {Array}
     */
    getYear = () => {
      let arr = [];
      let year = moment().year();
      for(let i = year; i < year+30; i++ ) {
          arr.push({
              name: 'valid_year',
              value: i,
              label: i
          });
      }
      return arr;

    };

    /**
     * get months
     * @returns {Array}
     */
    getMonth = () => {
      var arr = [];
      for(let i = 1; i < 13; i++ ) {
          arr.push({
              name: 'valid_month',
              value: i,
              label: i
          });
      }
      return arr;

    };

    /**
     * change car input select
     * @param event
     */
    changeCardInputSelect = (event) => {
        let { name , value } = event;
        let card = {...this.state.card};
        card[name] = value;
        this.setState({
            ...this.state,
            card,
        });
    };

    /**
     * change car input
     * @param event
     */
    changeCardInput = (event) => {
        let { name , value } = event.target;
        let card = {...this.state.card};
        if(name === "card_name") {
            card[name] = value;
        } else {
            card[name] = value === "" ? "" : Number(value);
        }

        this.setState({
            ...this.state,
            card,
        });
    };

    /**
     * set input value
     * @param key
     * @param e
     */
    handleInputChange = (key, e) => {
        let selected = { ...this.state.selected };
        selected[key+'_address'] = e.target.value;
        this.setState({
            ...this.state,
            selected,
            [key]: e.target.value,
            [key+'Value']: e.target.value
        });
    };

    /**
     * set suggest
     * @param key
     * @param suggest
     */
    handleSelectSuggest = (key, suggest) => {
        let selected = { ...this.state.selected };
        selected[key+'_address'] = suggest.formatted_address;
        this.setState({
            ...this.state,
            selected,
            [key]: "",
            [key+'Value']: suggest.formatted_address
        });
    };


    /**
     * change address
     * @param key
     * @param obj
     */
    changeAddress = (key, obj) => {
        let selected = { ...this.state.selected };
        if(obj === undefined) {
            let { name , value } = key.target;
            selected[name] = value;
        } else {
            selected[key+'_address'] = obj.formatted_address;
        }
        this.setState({
            ...this.state,
            selected
        });
    };

    /**
     * change inputs
     * @param event
     */
    changeInput = (event) => {
        let showPaymentForm = false;
        let { name , value, attributes } = event.target;
        let parent = attributes['data-parent'] ? attributes['data-parent'].value : null;
        let selected = { ...this.state.selected };
        let required = [...this.state.required].filter(val => val !== name);

        if( parent === null ) {
            selected[name] = value;
        } else {
            if( typeof name === "string"){
                selected[parent][name] = value;
            }else{
                selected[parent][name.toString()] = value;
            }

        }

        if( selected.tb_payment_method_id && +selected.tb_payment_method_id !== 1 ) {
            showPaymentForm = true;
        } else {
            showPaymentForm = false
        }

        this.setState({
            selected,
            required,
            showPaymentForm
        });

    };

    /**
     * get from inputs for fill
     * @param fromOrTo
     * @returns {*}
     */
    getFromTo = (fromOrTo = 'pickup') => {
        let obj  = { ...this.props.carInfo.route[fromOrTo] };

        if(obj.address && obj.address.name ) {
            return <div className="infoDetails">
                        { this.state.selected[obj.address.name] && <div className="inputHideLabel"><span>{  obj.address.title  }</span></div> }
                    <ReactGoogleMapLoader
                        params={{
                            key:'AIzaSyCaq4cT914XwAVFcpwWuJZbNRiUzyxHH88',
                            libraries: "places,geocode",
                        }}
                        render={googleMaps =>
                            googleMaps && (
                                <div>
                                    <ReactGooglePlacesSuggest
                                        autocompletionRequest={{input: this.state[fromOrTo]}}
                                        googleMaps={googleMaps}
                                        onSelectSuggest={(suggest) => this.handleSelectSuggest(fromOrTo, suggest)}
                                    >
                                        <input
                                            className="input-80"
                                            type="text"
                                            value={this.state[fromOrTo+'Value']}
                                            placeholder={obj.address.title}
                                            onChange={(e) => this.handleInputChange(fromOrTo, e)}
                                        />
                                    </ReactGooglePlacesSuggest>
                                </div>
                            )
                        }
                    />
                    </div>;
        }

        return (obj.fields || []).map(( field )=> {
            return <div className="infoDetails" key={field.name}>
                { this.state.selected[fromOrTo + "_details"] && this.state.selected[fromOrTo + "_details"][field.name] && <div className="inputHideLabel"><span>{  field.title  }</span></div> }
                <input
                    data-parent={fromOrTo + "_details"}
                    onChange={this.changeInput}
                    className="confirmInputStyle"
                    type="text"
                    name={field.name}
                    placeholder={field.title}
                    value={ this.state.selected[fromOrTo + "_details"] ? this.state.selected[fromOrTo + "_details"][field.name] : '' }
                />
            </div>;
        });
    };

    /**
     * get extrea sum whit jsx or only price
     * @param onlyPrice
     * @param currencyKey
     * @returns {*}
     */
    getExtraSum = (onlyPrice, currencyKey) => {
        if(this.props.carType === undefined  ) return 0;
        let extra_fields = [ ...this.props.carType.extra_fields ];
        let { extra } = this.props.bookings.step4;
        let { carInfo }= this.props;
        let price = 0;
        let returntrip = +carInfo.returntrip;
        let listExtra = [...this.props.carType.prices];
        let flag = true;
        Object.keys(extra).forEach( key => {
            let count = extra[key].value || 0;
            extra_fields.forEach(val => {
                if(val.id === Number(key)) {
                    for(let i = 0; i < val.prices.length; i++ ){
                        if(flag){
                            listExtra[i] = {
                                price: 0,
                                title: val.prices[i].title,
                                id: val.prices[i].id
                            };
                        }

                        if( currencyKey ) {
                            if(val.prices[i].title === currencyKey){
                                price += val.prices[i].price * count ;
                            }
                        }else {
                            if(val.prices[i].id === this.state.selected.tb_currency_id){
                                price += val.prices[i].price * count ;
                            }
                        }
                        listExtra[i] = {
                            price: listExtra[i].price + val.prices[i].price * count,
                            title: val.prices[i].title,
                            id: val.prices[i].id
                        };
                    }
                    flag = false;
                }
            })
        });

        if(onlyPrice){
            return Number(returntrip === 1 ? price * 2 : price);
        }

        let select = <Select
            clearable={false}
            onChange={this.changePrice}
            name="price"
            value={this.state.selected.tb_currency_id}
            options={listExtra.map(val => { return {value: val.id, label: returntrip === 1 ? val.price * 2 + ' ' + val.title : val.price + ' ' + val.title};})}
        />;

        return price ?
            <div className="infoDetails">
                <span><i className="fa fa-tag" aria-hidden="true"></i>
                { I18n.t('extraPrice') } </span>
                <span>{select}</span>
            </div>
            : false;
    };

    /**
     * get total price
     * @returns {*}
     */
    getCurrentTotalPrice = () => {
        let {carInfo} = this.props;
        let priceObj = {};
        let prices =[...(this.props.carType.prices || [])];
        let return_prices =[...(this.props.carType.return_prices || [])];
        let returntrip = +carInfo.returntrip;
        for(let i = 0; i < prices.length; i++ ) {
            priceObj[prices[i].title] = {
                id: prices[i].id,
                title: prices[i].title,
                price: (returntrip === 1 ? Number(prices[i].price) + Number(return_prices[i].price)  : Number(prices[i].price)) + this.getExtraSum('onlyPrice', prices[i].title)
            };
        }

        let options = Object.keys(priceObj).map(val => {
            return {
                value: priceObj[val].id,
                label: priceObj[val].price + ' ' + priceObj[val].title
            }
        });

        return <Select
            clearable={false}
            onChange={this.changePrice}
            name="price"
            value={this.state.selected.tb_currency_id}
            options={ options }
        />;
    };

    /**
     * set initial data
     */
    componentDidMount() {
        if(this.props.carInfo === undefined || Object.keys(this.props.carInfo).length === 0) {
            this.props.dispatch(fetchData({
                method: "GET",
                url: "getorder",
                callback: getOrder,
                callbacks: [(data) => this.props.checkForRedirect(data, 'infoAndPayment')]
            }))
        }


        let transactionNumber='WWW'+ new Date().getTime();
        this.props.dispatch( setTransactionNumber(transactionNumber));
        this.setTransactionNumberInStore(transactionNumber);
    }





    setTransactionNumberInStore = (transactionNumber) => {

        if(transactionNumber &&  this.props.carType &&    this.props.carInfo){
            const route_from=this.props.carInfo.route.pickup.title
            const route_to=this.props.carInfo.route.dropoff.title
            let price_USD=this.props.carType.prices[2].price


            EcommerceReactGAUrl(transactionNumber,price_USD,route_from,route_to)
        }
    }

    render() {
        let {carType, carInfo} = this.props;
        let showReturnDate = Number(carInfo && carInfo.returntrip) === 1;

        let lang  = this.props.activeLang.code;

        return (           
            <div className="container">
                { carType !== undefined &&
                <div>
                    <h1 className="bookingRoute">{ I18n.t('transferServiceOfferFrom') } <b>{carInfo.route.pickup.title}</b> { I18n.t('to') } <b>{carInfo.route.dropoff.title} ({carInfo.route.distance} KM)</b></h1>
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
                                    <span><i><b>&asymp; {carType.duration || 0}</b></i></span>
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
                                <div>
                                    <div className="borderDetails"> </div>
                                    <div className="infoDetails">
                                        <span><i className="fa fa-tag" aria-hidden="true"></i>
                                        { I18n.t('carPrice') }</span>
                                        <span>
                                            <Select
                                                clearable={false}
                                                onChange={this.changePrice}
                                                name="price"
                                                value={this.state.selected.tb_currency_id}
                                                options={this.getPrices()}
                                            />
                                        </span>
                                    </div>
                                    { +carInfo.returntrip === 1 &&
                                        <div className="infoDetails">
                                            <span><i className="fa fa-tag" aria-hidden="true"></i>
                                            {I18n.t('carPrice')}</span>
                                            <span>
                                                <Select
                                                    clearable={false}
                                                    onChange={this.changeReturnPrice}
                                                    name="price"
                                                    value={this.state.selected.tb_currency_id_return}
                                                    options={this.getReturnPrices()}
                                                />
                                            </span>
                                        </div>
                                    }
                                    {  this.getExtraSum()  }
                                    <div className="borderDetails"> </div>
                                    <div className="infoDetails">
                                        <span><i className="fa fa-tags" aria-hidden="true"></i>
                                        <b>{ I18n.t('totalPrice') }</b></span>
                                        <span><b>{ this.getCurrentTotalPrice() }</b></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="width66">
                            <div className="firstInfoStyle">
                                <div className="infoDetails">
                                    <span>{ I18n.t('personalInformation') }</span>
                                    <span> </span>
                                </div>
                                <div className={this.state.required.indexOf('name') === -1 ? 'infoDetails' : 'errorForm infoDetails'} >
                                    { this.state.selected.name && <div className="inputHideLabel"><span>{ I18n.t('name') + "*" }</span></div> }
                                    <input
                                        className="confirmInputStyle"
                                        name="name"
                                        type="text"
                                        placeholder={ I18n.t('name') + "*" }
                                        value={ this.state.selected.name || '' }
                                        onChange={ this.changeInput }
                                    />
                                </div>
                                <div className={this.state.required.indexOf('surname') === -1 ? 'infoDetails' : 'errorForm infoDetails'}>
                                    { this.state.selected.surname && <div className="inputHideLabel"><span>{ I18n.t('surname') + "*"  }</span></div> }
                                    <input
                                        className="confirmInputStyle"
                                        name="surname"
                                        type="text"
                                        placeholder={ I18n.t('surname') + "*" }
                                        value={ this.state.selected.surname || '' }
                                        onChange={ this.changeInput }
                                    />
                                </div>
                                <div className={this.state.required.indexOf('email') === -1 ? 'infoDetails' : 'errorForm infoDetails'}>
                                    { this.state.selected.email && <div className="inputHideLabel"><span>{ I18n.t('email') + "*"  }</span></div> }
                                    <input
                                        className="confirmInputStyle"
                                        name="email"
                                        type="text"
                                        placeholder={ I18n.t('email') + "*" }
                                        value={ this.state.selected.email || ""}
                                        onChange={ this.changeInput }
                                    />
                                </div>
                                <div className={this.state.required.indexOf('phone') === -1 ? 'infoDetails' : 'errorForm infoDetails'}>
                                    { this.state.selected.phone && <div className="inputHideLabel"><span>{ I18n.t('mobilePhoneNumber') + "*"  }</span></div> }
                                    <input
                                        className="confirmInputStyle"
                                        name="phone"
                                        type="text"
                                        placeholder={ I18n.t('mobilePhoneNumber') + "*" }
                                        value={ this.state.selected.phone || "" }
                                        onChange={ this.changeInput }
                                    />
                                </div>
                                <div className={this.state.required.indexOf('country') === -1 ? 'infoDetails' : 'errorForm infoDetails'}>
                                    { this.state.selected.country && <div className="inputHideLabel"><span>{ I18n.t('country') + "*"  }</span></div> }
                                    <input
                                        className="confirmInputStyle"
                                        name="country"
                                        type="text"
                                        placeholder={ I18n.t('country') + "*" }
                                        value={ this.state.selected.country || '' }
                                        onChange={ this.changeInput }
                                    />
                                </div>
                                <div className={this.state.required.indexOf('city') === -1 ? 'infoDetails' : 'errorForm infoDetails'}>
                                    { this.state.selected.city && <div className="inputHideLabel"><span>{ I18n.t('city') + "*"  }</span></div> }
                                    <input
                                        className="confirmInputStyle"
                                        name="city"
                                        type="text"
                                        placeholder={ I18n.t('city') + "*" }
                                        value={ this.state.selected.city || '' }
                                        onChange={ this.changeInput }
                                    />
                                </div>
                                <div className={this.state.required.indexOf('postcode') === -1 ? 'infoDetails' : 'errorForm infoDetails'}>
                                    { this.state.selected.postcode && <div className="inputHideLabel"><span>{ I18n.t('postcode') + "*"  }</span></div> }
                                    <input
                                        className="confirmInputStyle"
                                        name="postcode"
                                        type="text"
                                        placeholder={ I18n.t('postcode') + "*" }
                                        value={ this.state.selected.postcode || '' }
                                        onChange={ this.changeInput }
                                    />
                                </div>
                                <div className={this.state.required.indexOf('address') === -1 ? 'infoDetails' : 'errorForm infoDetails'}>
                                    { this.state.selected.address && <div className="inputHideLabel"><span>{ I18n.t('address') + "*"  }</span></div> }
                                    <input
                                        className="confirmInputStyle"
                                        name="address"
                                        type="text"
                                        placeholder={ I18n.t('address') + "*" }
                                        value={ this.state.selected.address || '' }
                                        onChange={ this.changeInput }
                                    />
                                </div>
                                <div className="paymentBorder margin60-0" />
                                <div className="infoDetails">
                                    <span className="widthAuto">{ I18n.t('from') }</span>
                                    <span>{carInfo.route.pickup.title}</span>
                                </div>

                                { this.getFromTo('pickup') }
                                <div className="paymentBorder margin60-0" />
                                <div className="infoDetails">
                                    <span className="widthAuto">{ I18n.t('to') }</span>
                                    <span>{carInfo.route.dropoff.title}</span>
                                </div>

                                { this.getFromTo('dropoff') }
                                <div className="infoDetails">
                                    { this.state.selected.message && <div className="inputHideLabel"><span>{   I18n.t('message')  }</span></div> }
                                    <textarea
                                        name="message"
                                        value={ this.state.selected.message || ''}
                                        placeholder={ I18n.t('message') }
                                        onChange={ this.changeInput }
                                    />
                                </div>
                                <div className={this.state.selected.isGoing === 1 ? 'infoDetails' : 'errorForm infoDetails'}>
                                     <input
                                         name="isGoing"
                                         type="checkbox"
                                         id="agree"
                                         checked={this.state.selected.isGoing === 1}
                            			 onChange={ this.changeReturntrip } />
                                     <label htmlFor="agree" className = "agreeLabel">{ I18n.t('agree') } &nbsp;  
                                        <NavLink
                                              to={'/' + lang  + '/terms-conditions/'}
                                              target = "_blank"
                                              activeClassName="active">{ I18n.t('termsConditions') }
                                        </NavLink>

                                     </label>
                                </div>
                                <div className="paymentBorder margin60-0"/>
                                <div>
                                    <div className="radioBlock">
                                        { this.getPayments() }
                                    </div>
                                </div>
                                {
                                    this.state.showPaymentForm &&
                                    <div>
                                        <div>
                                            <Select
                                                clearable={false}
                                                onChange={this.changeCardInputSelect}
                                                name="card_type"
                                                value={this.state.card.card_type}
                                                options={[
                                                    {
                                                        name: "card_type",
                                                        value: "master_card",
                                                        label: I18n.t("masterCard")
                                                    },
                                                    {
                                                        name: "card_type",
                                                        value: "visa",
                                                        label: I18n.t("visa")
                                                    }
                                                ]}
                                            />
                                        </div>
                                        <div className={this.state.required.indexOf('card_name') === -1 ? 'infoDetails' : 'errorForm infoDetails'}>
                                            <input
                                                className="confirmInputStyle"
                                                name="card_name"
                                                type="text"
                                                placeholder={ I18n.t('cardholderName') + "*" }
                                                value={ this.state.card.card_name}
                                                onChange={ this.changeCardInput }
                                            />
                                        </div>
                                        <div className={this.state.required.indexOf('card_number') === -1 ? 'infoDetails' : 'errorForm infoDetails'}>
                                            <input
                                                className="confirmInputStyle"
                                                name="card_number"
                                                maxLength={16}
                                                type="text"
                                                placeholder={ I18n.t('cardNumber') + "*" }
                                                value={ this.state.card.card_number}
                                                onChange={ this.changeCardInput }
                                            />
                                        </div>
                                        <div className="flex treeColumn">
                                            <div>
                                                <Select
                                                    clearable={false}
                                                    onChange={this.changeCardInputSelect}
                                                    name="valid_month"
                                                    placeholder={ I18n.t('expiryMonth') + "*" }
                                                    value={this.state.card.valid_month}
                                                    options={this.getMonth()}
                                                />
                                            </div>
                                            <div>
                                                <Select
                                                    clearable={false}
                                                    onChange={this.changeCardInputSelect}
                                                    name="valid_year"
                                                    placeholder={ I18n.t('expiryYear') + "*" }
                                                    value={this.state.card.valid_year}
                                                    options={this.getYear()}
                                                />
                                            </div>
                                            <div className={this.state.required.indexOf('card_cvv') === -1 ? '' : 'errorForm'}>
                                                <input
                                                    className="confirmInputStyle input52"
                                                    name="card_cvv"
                                                    maxLength={4}
                                                    minLength={3}
                                                    type="text"
                                                    placeholder={ I18n.t('cvc2cvv2code') + "*" }
                                                    value={ this.state.card.card_cvv}
                                                    onChange={ this.changeCardInput }
                                                />
                                            </div>
                                        </div>

                                    </div>

                                }
                                <div className="textRight marginTop100">
                                    <button className="btn red" onClick={this.setStep5 }>Continue ></button>
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
        bookings: state.BookingReducer.bookings,
        activeLang: state.LangReducer.activeLang,
        carType: state.BookingReducer.extras.carType,
        carInfo: state.BookingReducer.extras.carInfo,
        transactionNumber: state.GoogleAnanlyticsReducer.transactionNumber
    }
};

export default connect(mapStateToProps)(InfoAndPayment);