import React from 'react';
import Select from 'react-select';
import history from "../history";
import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import {
    setBookingStep4,
    getOrder,
    setExtras
} from "../actions/actionInitialData";
import {
    fetchData,
    post
} from "../services/RequestService";

class Extras extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            extra_fields: [],
            selected: { ...this.props.bookings.step4 },
            tb_currency_id: null
        };
    }

    /**
     *  set initial state
     */
    componentWillReceiveProps() {
        this.setState({
            selected: { ...this.props.bookings.step4 }
        });
    }

    /**
     * get initial data
     */
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

    /**
     * change extras
     * @param event
     */
    changeExtra = (event) => {
        let selected = { ...this.state.selected };

        selected.extra[event.extra.id] = {
            name : event.extra.id || null,
            value: event.value || null
        };
        this.setState({
            selected : selected
        })
    };

    /**
     * get select option
     * @param obj
     * @param min
     * @returns {Array}
     */
    getSelectOption = (obj, min) => {
        let resetTrue = true || this.state.selected[obj.id].value !== null;
        let selectOption = [];
        let i = min ? min : resetTrue ? 0 : 1;
        for(i; i <= obj.maximum_count; i++ ) {
            selectOption.push({
                value : i,
                label : i,
                extra : {...obj}
            });
        }
        return selectOption;
    };

    /**
     * get extras list
     * @returns {any[]}
     */
    getExtras = () => {
      if(this.props.carType === undefined  ) return;
      let extra_fields = [ ...this.props.carType.extra_fields ];
      return ( extra_fields || [] ).map( val => {
          return <div className="marginTop20" key={val.id.toString()} title={(this.state.selected[val.id] && this.state.selected[val.id].value) ? val.title : '' }>
                 { !!this.state.selected.extra[val.id] && !!this.state.selected.extra[val.id].value &&
                    <div className="inputHideLabel"><span>{ val.title }</span></div>}
                  <Select
                      clearable={false}
                      onChange={this.changeExtra}
                      name="extra_filds[]"
                      value={ this.state.selected.extra[val.id] ? this.state.selected.extra[val.id].value : null }
                      options={this.getSelectOption(val)}
                      placeholder={val.title}
                  />
              </div>;
      })
    };

    /**
     * get extra sum whit jsx or only price
     * @param onlyPrice
     * @param currencyKey
     * @returns {*}
     */
    getExtraSum = (onlyPrice, currencyKey) => {
        if(this.props.carType === undefined  ) return 0;
        let extra_fields = [ ...this.props.carType.extra_fields ];
        let { carInfo }= this.props;
        let {extra} = this.state.selected;
        let price = 0;
        let returntrip = +carInfo.returntrip;
        let listExtra = [...this.props.carType.prices];
        let flag = true;
        Object.keys(extra).forEach( key => {
            let count = Number(extra[key].value || 0);

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
                            if(val.prices[i].id === this.state.tb_currency_id){
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
                value={this.state.tb_currency_id}
                options={listExtra.map(val => { return {value: val.id, label: returntrip === 1 ? val.price * 2 + ' ' + val.title : val.price + ' ' + val.title};})}
            />;

        return price ?
            <div className="infoDetails">
                <span><i className="fa fa-tag" aria-hidden="true"></i> { I18n.t('extraPrice') } </span>
                <span>{select}</span>
            </div>
            : false;
    };

    /**
     * get current total price
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
                price: (returntrip === 1 ? Number(prices[i].price)+Number(return_prices[i].price): Number(prices[i].price)) + this.getExtraSum('onlyPrice', prices[i].title)
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
            value={this.state.tb_currency_id}
            options={ options }
        />;
    };

    /**
     * get extra prices
     * @param extra
     * @param defaultCount
     * @returns {*}
     */
    getExtraPrice = (extra, defaultCount) => {
        let flag = defaultCount !== undefined;
        defaultCount = defaultCount !== undefined ? 0 : 1 ;
        if( extra.price === "0" || extra.price === "0.00" ) return 'Free';
        let prices = extra.prices;
        let price;
        let count = this.state.selected.extra[extra.id] ? this.state.selected.extra[extra.id].value || defaultCount : defaultCount;
        if(flag){
            return count === 0 || count === null ? '-' : count;
        }
        for(let i = 0; i < prices.length; i++ ){
            if(prices[i].id === this.state.tb_currency_id){
                price = (count === null ? +prices[i].price : +prices[i].price * count);
                if(!flag){
                    price = '+' + price + ' ' + prices[i].title;
                }
                break;
            }
        }

        return price;
    };

    /**
     * show extra lists
     * @returns {any[]}
     */
    showExtras = () => {
        if(this.props.carType === undefined  ) return;
        let extra_fields = [ ...this.props.carType.extra_fields ];


        return ( extra_fields || [] ).map( val => {
            return <div className="infoDetails" key={val.id.toString()}>
                    <span><i id={'extra_'+ val.id.toString()} className="fa" aria-hidden="true"></i> { I18n.t(val.title) }</span>
                    <span>{ this.getExtraPrice(val, 0) }</span>

                </div>;
        });

    };

    /**
     * generate prices
     * @returns {any[]}
     */
    generatePrices = () => {
        if(this.props.carType === undefined  ) return;
        let extra_fields = [ ...this.props.carType.extra_fields ];

        return ( extra_fields || [] ).map( val => {
            return <div className="infoDetails marginTop15" key={val.id.toString()}>
                        <span  className="extraGin">{this.getExtraPrice(val)}</span>
                        <span> </span>
                    </div>;
        });
    };

    /**
     * set booking step 4
     */
    setStep4 = () => {
      let { extra } = this.state.selected;
      let arrKeys = Object.keys(extra);
      let data = {
          extra_fields:[]
      };

      for(let i = 0; i < arrKeys.length; i++ ) {
        let key = arrKeys[i];
        if(extra[key].value !== null && extra[key].name !== null ) {
            data.extra_fields.push({
                name : 'extra_fields['+ extra[key].name +']',
                value : extra[key].value
            })
        }
      }
      data.tb_currency_id = this.state.tb_currency_id;
      data.tb_currency_id_return = this.state.tb_currency_id_return;
      this.props.dispatch(setBookingStep4({ ...this.state.selected }));
      let lang = this.props.activeLang.code;
      this.props.dispatch(post({
          method: 'POST',
          url: 'extras/',
          callback: setExtras,
          data : data,
          callbacks: [(data => {
              if(data && data.redirect) {
                  history.push('/' + lang + '/' + data.redirect );
              }

              if(data && data.booking_data) {
                  const gtag = window.gtag;
                  gtag('event', 'click', {
                      'event_category': 'button',
                      'event_label': 'extra',
                  });
                  history.push('/' + lang + '/booking/infoAndPayment/' );
              }
          })]
      }));


    };

    /**
     * change price
     * @param event
     */
    changePrice = event => this.setState({tb_currency_id : event === null ? null : event.value,tb_currency_id_return : event === null ? null : event.value});

    changeReturnPrice = (event) => this.setState({tb_currency_id_return : event === null ? null : event.value,tb_currency_id : event === null ? null : event.value});

    /**
     * set price
     * @param id
     */
    setPrice = id => this.setState({tb_currency_id : id});

    setPriceReturn = (id) => this.setState({tb_currency_id_return : id});

    /**
     * get prices
     * @returns {{value: *, label: string}[]}
     */
    getPrices = () => {
        if( this.state.tb_currency_id === null && this.props.carInfo.tb_currency_id !== null ) {
            this.setPrice(this.props.carInfo.tb_currency_id);
        }
        return (this.props.carType.prices || []).map( val => ({
            value: val.id,
            label: val.price + ' ' + val.title
        }));
    };

    getReturnPrices = () => {
        if(this.state.tb_currency_id_return === null  || this.state.tb_currency_id_return === undefined ) {
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
     * get price
     * @returns {string}
     */
    getPrice = () => {
        let returntrip = +this.state.tb_currency_id;
        let price =  (this.props.carType.prices || []).filter( val => +val.id === returntrip);

        return price.length ?  price[0].price + ' ' +price[0].title : '';
    };

    render() {
        let {carType, carInfo} = this.props;
        let showReturnDate = Number(carInfo && carInfo.returntrip) === 1;

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
                                    <span>
                                        <i className="fa fa-calendar-o" aria-hidden="true"></i> 
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
                                    <span>
                                        <i className="fa fa-clock-o" aria-hidden="true"></i>
                                        { I18n.t('journeyDuration') }</span>
                                        <span><i><b>&asymp; {carType.duration || 0}</b></i></span>
                                </div>
                                <div className="borderDetails"> </div>
                                <div className="infoDetails">
                                    <span>
                                        <i className="fa fa-male" aria-hidden="true"></i>
                                        { I18n.t('adults') }</span>
                                    <span>{carInfo.adults || '-'}</span>
                                </div>
                                <div className="infoDetails">
                                    <span>
                                        <i className="fa fa-child" aria-hidden="true"></i>
                                        { I18n.t('children') }</span>
                                    <span>{carInfo.medium_children + carInfo.small_children || '-'}</span>
                                </div>
                                <div className="borderDetails"> </div>
                                <div className="infoDetails">
                                    <span>
                                        <i className="fa fa-briefcase" aria-hidden="true"></i>
                                        { I18n.t('smallLuggage') }</span>
                                    <span>{carInfo.small_suitcase || '-'}</span>
                                </div>
                                <div className="infoDetails">
                                    <span>
                                        <i className="fa fa-suitcase" aria-hidden="true"></i>
                                        { I18n.t('mediumLuggage') }</span>
                                    <span>{carInfo.medium_suitcase || '-'}</span>
                                </div>

                                <div className = "extraDiv"> 
                                    { this.showExtras() } </div>
                                <div className="borderDetails"> </div>
                                <div className="infoDetails">
                                    <span>
                                        <i className="fa fa-tag" aria-hidden="true"></i>
                                        { I18n.t('carPrice') }</span>
                                    <span>
                                        <Select
                                            clearable={false}
                                            onChange={this.changePrice}
                                            name="price"
                                            value={this.state.tb_currency_id}
                                            options={this.getPrices()}
                                        />
                                    </span>
                                </div>
                                {
                                    +carInfo.returntrip === 1 &&
                                    <div className="infoDetails">
                                        <span>
                                            <i className="fa fa-tag" aria-hidden="true"></i>
                                            { I18n.t('returnPrice') }</span>
                                        <span>
                                            <Select
                                                clearable={false}
                                                onChange={this.changeReturnPrice}
                                                name="price"
                                                value={this.state.tb_currency_id_return}
                                                options={this.getReturnPrices ()}
                                            />
                                        </span>
                                    </div>
                                }
                                {  this.getExtraSum()  }
                                <div className="borderDetails"> </div>
                                <div className="infoDetails">
                                    <span>
                                        <i className="fa fa-tags" aria-hidden="true"></i>
                                        <b>{ I18n.t('totalPrice') } </b></span>
                                    <span><b>{ this.getCurrentTotalPrice() }</b></span>
                                </div>
                            </div>
                        </div>
                        <div className="extraField">
                            <div className="firstInfoStyle">
                                <div className="infoDetails">
                                    <span>{ I18n.t('extras') }</span>
                                    <span> </span>
                                </div>
                            </div>

                            {
                               this.getExtras()
                            }
                        </div>
                        <div className="extraPricefield">
                            <div className="firstInfoStyle">
                                <div className="infoDetails">
                                    <span>{ I18n.t('extraPrice') }</span>
                                    <span> </span>
                                </div>
                                {
                                    this.generatePrices()
                                }
                                
                            </div>
                            <div className="marginTop100">
                                <button className="btn red" onClick={this.setStep4 }>{ I18n.t('continue') } ></button>
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
      carType: state.BookingReducer.detalis.carType,
      carInfo: state.BookingReducer.detalis.carInfo
  }
};
export default connect(mapStateToProps)(Extras);
