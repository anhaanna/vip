import React from 'react';
import Select from 'react-select';
import CustomDatePicker from './dump/CustomDatePicker';
import history from "../history";
import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import { fetchData, post } from "../services/RequestService";
import { setNotification } from "../actions/actionInitialData";
import { setBookingStep3 } from "../actions/actionInitialData";
import { setDetails } from './../actions/actionInitialData';
import { getOrder } from "../actions/actionInitialData";
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import 'moment/locale/en-gb';

class CarDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            required: [],
            selected: { ...this.props.bookings.step3 }
        };
    }

    /**
     * set initial state
     */
    componentWillReceiveProps() {
        this.setState({
            selected: { ...this.props.bookings.step3 }
        });
    }

    /**
     * get select option
     * @param max
     * @param min
     * @param counter
     * @returns {Array}
     */
    getSelectOption = (max, min, counter ) => {
        let selectOption = [];
        let i = min || 1;

        if(counter) {
            let count = 0;
            let maxPassengers = this.props.carType.max_passengers;
            let { adults, medium_children, small_children } = this.state.selected ;

            if(counter !== "adults" && adults !== null && typeof adults === "number") {
                count += adults;
            }
            if(counter !== "medium_children" && medium_children !== null && typeof medium_children === "number") {
                count += medium_children;
            }
            if(counter !== "small_children" && small_children !== null && typeof small_children === "number") {
                count += small_children;
            }

            max = max  >= maxPassengers-count ? maxPassengers-count : max;
        }
        for(i; i <= max; i++ ) {
            selectOption.push({
                value : i,
                label : i
            });
        }
        return selectOption;
    };

    /**
     * change adults
     * @param event
     */
    changeAdults = (event) => {
        let value = event === null ? '' : event.value;
        this.setState({
            selected : {
                ...this.state.selected,
                adults : value
            },
            required : [ ...this.state.required ].filter(val => val !== 'adults')
        });
    };

    /**
     * change medium children
     * @param event
     */
    changeMediumChildern = (event) => {
        let value = event === null ? '' : event.value;
        this.setState({
            selected : {
                ...this.state.selected,
                medium_children : value
            }
        });
    };

    /**
     * change small children
     * @param event
     */
    changeSmallChildren = (event) => {
        let value = event === null ? '' : event.value;
        this.setState({
            selected : {
                ...this.state.selected,
                small_children : value
            }
        });
    };

    /**
     * change small suitcase
     * @param event
     */
    changeSmallSuitcase = (event) => {
        let value = event === null ? '' : event.value;
        this.setState({
            selected : {
                ...this.state.selected,
                small_suitcase : value
            }
        });
    };

    /**
     * change medium suitcase
     * @param event
     */
    changeMediumSuitcase = (event) => {
        let value = event === null ? '' : event.value;
        this.setState({
            selected : {
                ...this.state.selected,
                medium_suitcase : value
            }
        });
    };

    /**
     * change price
     * @param event
     */
    changePrice = (event) => {
        let selected = { ...this.state.selected };
        selected.tb_currency_id = event === null ? null : event.value;
        selected.tb_currency_id_return = event === null ? null : event.value;

        this.setState({selected : selected});

    };

     changeReturnPrice = (event) => {


        let selected = { ...this.state.selected };
        selected.tb_currency_id_return = event === null ? null : event.value;
        selected.tb_currency_id= event === null ? null : event.value;
        this.setState({selected : selected});
    };



    /**
     * set price
     * @param id
     */
    setPrice = (id) => {
        let selected = { ...this.state.selected };
        selected.tb_currency_id = id;
        this.setState({selected : selected});
    };

     setPriceReturn = (id) => {

        let selected = { ...this.state.selected };
        selected.tb_currency_id_return = id;
        this.setState({selected : selected});
    };





    /**
     * get all prices
     * @returns {{value: *, label: string}[]}
     */
    getPrices = () => {
        if( this.state.selected.tb_currency_id === null ) {
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
     * get current total price
     * @returns {{value: *, label: string}[]}
     */
    getCurrentTotalPrice = () => {
        let returntrip = this.props.carInfo.returntrip;

        let {return_prices}=this.props.carType;
        return (this.props.carType.prices || []).map( (val,index) =>  {
            return {
                value : val.id,
                label : (returntrip === '1' ? Number(val.price) + Number (return_prices[index].price)+' ' + val.title : Number(val.price) + ' ' + val.title)
            }
        });
    };

    /**
     * booking set step 3
     */
    setStep3 = () => {
      let data = { ...this.state.selected };
          data.pickup_date_time = this.props.carInfo.pickup_date_time;
          data.return_date_time = this.props.carInfo.return_date_time;
          data.returntrip = this.props.carInfo.returntrip;
          let required = [];

          if(data.pickup_time === null) {
              required.push('pickupTime');
          } else {
              data.pickup_time = data.pickup_time.format("HH:mm")
          }

          if( data.return_time !== null ) {
              data.return_time = data.return_time.format("HH:mm");
          } else if( +data.returntrip === 1){
              required.push('returnTime');
          }

          if( data.adults === null || data.adults === '' ) {
              required.push('adults');
          }

          if( required.length ) {
              this.setState({
                  required: [...this.state.required, ...required]
              });
              let errorMessageList = required.map((val) => {
                  return I18n.t('errorMessage'+val.charAt(0).toUpperCase() + val.slice(1));
              });
              this.props.dispatch(setNotification([{
                  status: 'error',
                  result: errorMessageList
              }]));


              return;
          }

          let lang = this.props.activeLang.code;

          let dispachData = {
                  adults: data.adults,
                  medium_children: data.medium_children,
                  small_children: data.small_children,
                  small_suitcase: data.small_suitcase,
                  medium_suitcase: data.medium_suitcase,
                  pickup_time: data.pickup_time === null ? null : moment(data.pickup_time, ['h:m a', 'H:m']),
                  return_time: data.return_time === null ? null : moment(data.return_time, ['h:m a', 'H:m']),
                  tb_currency_id: data.tb_currency_id
          };

          this.props.dispatch(post({
               method: 'GET',
               url: 'details/',
               callback: setDetails,
               data : data,
               callbacks: [(data => {
                   if(data && data.redirect) {
                       history.push('/' + lang + '/' + data.redirect );
                   }

                   if(data && data.booking_data) {
                       const gtag = window.gtag;
                       gtag('event', 'click', {
                           'event_category': 'button',
                           'event_label': 'details',
                       });
                       history.push('/' + lang + '/booking/extras/');
                   }
                   this.props.dispatch(setBookingStep3(dispachData));
               })]
          }));
    };

    /**
     * get initial data
     */
    componentWillMount() {
        if(this.props.carInfo === undefined || Object.keys(this.props.carInfo).length === 0) {
            this.props.dispatch(fetchData({
                method: "GET",
                url: "getorder",
                callback: getOrder,
                callbacks: [(data) => this.props.checkForRedirect(data, 'details')]
            }));
        }
    }

    render() {
        let {carType, carInfo} = this.props;
        let showReturnDate = Number(carInfo && carInfo.returntrip) === 1;
        let {
            adults,
            medium_children,
            medium_suitcase,
            pickup_time,
            return_time,
            small_children,
            small_suitcase,
            tb_currency_id,
            tb_currency_id_return,
        } = this.state.selected;

        return (
            <div className="container">
                { carType !== undefined && Object.keys(carType).length !== 0 &&
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
                                        <p className="noMargin">{carInfo.pickup_date_time }</p>
                                        <span className="textRight">
                                            { this.state.selected.pickup_time !== null && this.state.selected.pickup_time.format('HH:mm') }
                                        </span>
                                    </span>
                                </div>
                                {
                                    showReturnDate &&
                                    <div className="infoDetails">
                                        <span><i className="fa fa-calendar-o" aria-hidden="true"></i> 
                                        { I18n.t('returnDate') }</span>
                                        <span className="twoRow">
                                            <p className="noMargin">{ carInfo.return_date_time }</p>
                                            <span className="textRight">
                                                { return_time !== null && return_time.format('HH:mm') }
                                            </span>
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
                                    <span>{ adults || '-'}</span>
                                </div>
                                <div className="infoDetails">
                                    <span><i className="fa fa-child" aria-hidden="true"></i>
                                    { I18n.t('children') }</span>
                                    <span>{ medium_children + small_children || '-'}</span>
                                </div>
                                <div className="borderDetails"> </div>
                                <div className="infoDetails">
                                    <span><i className="fa fa-briefcase" aria-hidden="true"></i>
                                    { I18n.t('smallLuggage') }</span>
                                    <span>{ small_suitcase || '-'}</span>
                                </div>
                                <div className="infoDetails">
                                    <span><i className="fa fa-suitcase" aria-hidden="true"></i>
                                    { I18n.t('mediumLuggage') }</span>
                                    <span>{ medium_suitcase || '-'}</span>
                                </div>
                                <div className="borderDetails"> </div>
                                <div className="infoDetails">
                                    <span><i className="fa fa-tag" aria-hidden="true"></i>
                                    { I18n.t('carPrice') }</span>
                                    <span>
                                        <Select
                                            clearable={false}
                                            onChange={this.changePrice}
                                            name="price"
                                            value={ tb_currency_id}
                                            options={this.getPrices()}
                                        />
                                    </span>
                                </div>
                                {
                                    +carInfo.returntrip === 1 &&
                                    <div className="infoDetails">
                                        <span><i className="fa fa-tag" aria-hidden="true"></i>
                                        { I18n.t('returnPrice') }</span>
                                        <span>
                                            <Select
                                                clearable={false}
                                                onChange={this.changeReturnPrice}
                                                name="price"
                                                value={tb_currency_id_return}
                                                options={this.getReturnPrices()}
                                            />
                                        </span>
                                    </div>
                                }
                                <div className="borderDetails"> </div>
                                <div className="infoDetails">
                                    <span><i className="fa fa-tags" aria-hidden="true"></i>
                                    <b>{ I18n.t('totalPrice') }</b></span>
                                    <span>
                                        <Select
                                            clearable={false}
                                            onChange={this.changePrice}
                                            name="price"
                                            value={tb_currency_id}
                                            options={this.getCurrentTotalPrice()}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="firstInfoStyle">
                                <div className="infoDetails">
                                    <span><b>{ I18n.t('travelDate') }</b></span>
                                    <span><b>{carInfo.pickup_date_time}</b></span>
                                </div>
                                {
                                    showReturnDate &&
                                    <div className="infoDetails">
                                        <span><b>{ I18n.t('returnDate') }</b></span>
                                        <span><b>{carInfo.return_date_time}</b></span>
                                    </div>
                                }
                                <div className="infoDetails marginTop40">
                                    <span><b>Passengers</b></span>
                                    <span />
                                </div>
                                <div className={this.state.required.indexOf('adults') === -1 ? 'marginTop20' : 'errorForm marginTop20'}>
                                    { !!adults && <div className="inputHideLabel"><span>{ I18n.t('aduls10Years') }</span></div>}
                                    <Select
                                        className={adults === null || adults === '' ? 'errorForm' : ''} 
                                        onChange={this.changeAdults}
                                        name="adults"
                                        value={adults}
                                        options={this.getSelectOption(carType.max_passengers, carType.min_passengers, "adults")}
                                        placeholder={ I18n.t('aduls10Years') }
                                    />
                                </div>
                                <div className="marginTop20">
                                    { !!medium_children && <div className="inputHideLabel"><span>{ I18n.t('children2years') }</span></div>}
                                    <Select
                                        onChange={this.changeMediumChildern}
                                        name="medium_children"
                                        value={medium_children}
                                        options={this.getSelectOption(carType.medium_children, 1, "medium_children")}
                                        placeholder={ I18n.t('children2years') }
                                    />
                                </div>
                                <div className="marginTop20">
                                    { !!small_children && <div className="inputHideLabel"><span>{ I18n.t('infantsUnder2Years') }</span></div>}
                                    <Select
                                        onChange={this.changeSmallChildren}
                                        name="small_children"
                                        value={small_children}
                                        options={this.getSelectOption(carType.small_children, 1, "small_children")}
                                        placeholder={ I18n.t('infantsUnder2Years') }
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="dataPickerStyle">
                                <div className={this.state.required.indexOf('pickupTime') === -1 ? '' : 'errorForm'}>
                                  <div className={pickup_time === null || pickup_time === '' ? 'errorForm' : ''} >
                                      <CustomDatePicker
                                          selected={pickup_time}
                                          onChange={ date => {
                                              return this.setState({
                                                  selected : {
                                                      ...this.state.selected,
                                                      pickup_time : date
                                                  },
                                                  required : [ ...this.state.required ].filter(val => val !== 'pickupTime')
                                              })
                                          }}
                                          showTimeSelect
                                          showTimeSelectOnly
                                          timeIntervals={15}
                                          placeholderText={ I18n.t('pickupTime') }
                                          dateFormat="HH:mm"
                                          timeFormat="HH:mm"
                                          timeCaption="Time" />
                                  </div>
                                </div>
                                {
                                    showReturnDate &&
                                    <div className={this.state.required.indexOf('returnTime') === -1 ? 'marginTop20' : 'errorForm marginTop20'} >
                                        <CustomDatePicker
                                            selected={return_time}
                                            onChange={date => {
                                                return this.setState({
                                                    selected: {
                                                        ...this.state.selected,
                                                        return_time: date
                                                    },
                                                    required : [ ...this.state.required ].filter(val => val !== 'returnTime')
                                                })
                                            }}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            placeholderText={ I18n.t('returnTime') }
                                            dateFormat="HH:mm"
                                            timeFormat="HH:mm"
                                            timeCaption="Time"/>
                                    </div>
                                }
                            </div>
                            <div className="firstInfoStyle">
                                <div className="infoDetails marginTop40">
                                    <span><b>{ I18n.t('luggage') }</b></span>
                                    <span />
                                </div>
                                <div className="marginTop20">
                                    { !!small_suitcase && <div className="inputHideLabel"><span>{ I18n.t('smallLuggage') + " (55x40x23)" }</span></div>}
                                    <Select
                                        onChange={this.changeSmallSuitcase}
                                        name="small_suitcase"
                                        value={small_suitcase}
                                        options={this.getSelectOption(carType.small_suitcase)}
                                        placeholder={ I18n.t('smallLuggage') + " (55x40x23)" }
                                    />
                                </div>
                                <div className="marginTop20">
                                    { !!medium_suitcase && <div className="inputHideLabel"><span>{ I18n.t('mediumLuggage') + " (70x45x25)" }</span></div>}
                                    <Select
                                        onChange={this.changeMediumSuitcase}
                                        name="medium_suitcase"
                                        value={medium_suitcase}
                                        options={this.getSelectOption(carType.medium_suitcase)}
                                        placeholder={ I18n.t('mediumLuggage') + " (70x45x25)" }
                                    />
                                </div>
                            </div>
                            <div className="textRight marginTop100">
                                <button className="btn red" onClick={this.setStep3 }>{ I18n.t('continue') } ></button>
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
        bookings : state.BookingReducer.bookings,
        carType : state.BookingReducer.carType.carType,
        carInfo : state.BookingReducer.carType.carInfo,
        activeLang : state.LangReducer.activeLang
    };
};
export default connect(mapStateToProps)(CarDetails);
