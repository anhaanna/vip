import React from 'react';
import Select from 'react-select';
import { I18n } from 'react-i18nify';


class Car extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPrice : '',
            realPrice :''
        }



    }

    getPrices = () => {
        let thad = this;
        return this.props.data.prices.map((val) => {
            if(val.price === thad.props.data.price) {
                thad.setPrice(val.title);
            }
           return {
               value : val.title,
               label :  val.price + ' ' + val.title,
               realPrice : val.real_price + ' ' + val.title
           };
        });
    };

    setPrice = (price) => {
        if(this.state.selectedPrice !== '') return;
        this.setState({
            selectedPrice : price
        })
    };

    changePrice = (event) => {
        let value = event === null ? '' : event.value;
       this.realPrice (event.realPrice)
        this.setState({
            selectedPrice : value,
            realPrice : event.realPrice
        });
    };

    getDetails = () => {
        let currencyId;
        for(let i = 0; i < this.props.data.prices.length; i++) {
            let elem = this.props.data.prices[i];
            let selected = this.state.selectedPrice;
            if( elem.title === selected ) {
                currencyId = elem.id;
                 break;
            }
        }

        const gtag = window.gtag;
        gtag('event', 'click', {
            'event_category': 'button',
            'event_label': 'selectCar',
        });
        this.props.getDetails(currencyId, this.props.data.id);
    };

    realPrice =(value)=>{
        this.setState({
            realPrice:value
        })

    }
    render() {
        let {data} = this.props;

        let extraDescr = data.extra_charges.length !==0 ? data.extra_charges[Object.keys(data.extra_charges)[0]].description : null;

        let {realPrice} = this.state;
        if(!realPrice){
            realPrice =data.real_price + ' ' +this.state.selectedPrice;
        }
        if(data.real_price <= data.price ){
            realPrice='';
        }


        return (
            <div className="car">
                <div className="carImage">
                    <p>{data.title}</p>
                    <img src={'https://api.alptransfer.com/storage/tbcartypes/'+ data.image} alt={data.title}/>
                </div>
                <div className="carInfo">
                    
                    <div className="suitInfo">
                        <p>
                        <i className="fa fa-male booking_icons" aria-hidden="true"></i>
                         { I18n.t('upTo') } {data.max_passengers} { I18n.t('passengers') }</p>
                        <p>
                        <i className="fa fa-suitcase booking_icons" aria-hidden="true"></i>
                        { I18n.t('upTo') } {data.medium_suitcase} { I18n.t('suitcase') }</p>
                        <p>
                        <i className="fa fa-briefcase booking_icons" aria-hidden="true"></i>
                        { I18n.t('upTo') } {data.small_suitcase} { I18n.t('smallBagPerPerson') }</p>
                        <p>
                        <i className="fa fa-clock-o booking_icons" aria-hidden="true"></i>
                        &asymp; {data.duration || 0}</p>
                        <p className={extraDescr!== null ? 'extra_description' : 'no_extra'}>{extraDescr}</p>
                    </div>
                </div>
                <div className="carPrices">
                    <div className="bigPrice flex-container">

                            <div className='w30'>
                                <span> {realPrice} </span>
                            </div>
                            <div className='w70 '>
                                <Select
                                    clearable={false}
                                    onChange={this.changePrice}
                                    name="form-field-name"

                                    value={this.state.selectedPrice}
                                    options={this.getPrices()}
                                />
                            </div>




                    </div>
                    <div>
                        <p className="textRight">{ I18n.t('meetAndGreetServices') }
                            <i className="fa fa-check" aria-hidden="true"></i>
                        </p>
                        <p className="textRight">{ I18n.t('zeroFees') }
                            <i className="fa fa-check" aria-hidden="true"></i>
                        </p>
                        <p className="tooltip">{ I18n.t('freeWaitingTime') }
                            <i className="fa fa-check" aria-hidden="true"></i>
                            <span className="tooltiptext">{ I18n.t('freeWaitingTimeHours') }</span>
                            
                        </p>
                        <p className="tooltip">{ I18n.t('freeCancellation') }
                            <i className="fa fa-check" aria-hidden="true"></i>
                            <span className="tooltiptext">{ I18n.t('freeCancellationHours') }</span>
                            
                        </p>                        
                        
                    </div>
                    <div>
                        <button
                            className="btn red "
                             onClick={ this.getDetails }>{ I18n.t('selectThisCar') }
                        </button>
                    </div>
                </div>
                <div className="clear"> </div>
            </div>
        )
    }

}

export default Car;