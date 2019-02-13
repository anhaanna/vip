import React from 'react';
import { connect } from 'react-redux';
import Extras from './Extras';
import CarDetails from './CarDetails';
import AvailableCars from './AvailableCars';
import ChooseTransfer from './ChooseTransfer';
import InfoAndPayment from './InfoAndPayment';
import Confirmation from './Confirmation';
import history from '../history';
import SetMetaTag from "./SetMetaTag";
import logo from './../img/Alp-logo.svg';
import { I18n } from 'react-i18nify';
import { fetchData } from "../services/RequestService";
import { NavLink } from 'react-router-dom';

class Booking extends React.Component {

    constructor(props) {
        super(props);
        this.props.hideOther(true);
    }

    /**
     * function for page chack if current step false redirect current step page
     * @param data
     * @param page
     */
    checkForRedirect = ( data, page ) => {
        let lang = this.props.activeLang.code;
        let list = ['','/','/booking/availableCars/','/booking/details/','/booking/extras/','/booking/infoAndPayment/'];
        let { params } = this.props.match;
        let route = {
            chooseTransfer: 1,
            availableCars: 2,
            details: 3,
            extras: 4,
            infoAndPayment: 5,
            confirmation: 6
        };

        if(data.length === 0 || (data.booking_data && data.booking_data.step === 0)) {
            history.push('/' + lang + '/');
        } else if(data.booking_data) {
            if(data.booking_data.step < route[page] ) {
                let currentPage = params.step + '/';
                if( !(currentPage === list[data.booking_data.step] || '/booking/'+currentPage === list[data.booking_data.step]) ) {
                    history.push('/' + lang + list[data.booking_data.step]);
                }

            }
        }
    };

    /**
     * clear session for order
     */
    clearSession = () => {
        this.props.dispatch(fetchData({
            url: 'crearorder'
        }));
    };

    /**
     * custom router for bookings
     * @returns {*}
     */
    switchComponent = () => {
        let urlStr = this.props.location && this.props.location.pathname ? this.props.location.pathname.split('availableCars/')[1] : '';
        switch (this.props.match.params.step) {
            case 'chooseTransfer':
                return  <ChooseTransfer checkForRedirect={this.checkForRedirect} />;
            case 'availableCars':
                return  <AvailableCars checkForRedirect={this.checkForRedirect} urlStr={urlStr} />;
            case 'details':
                return  <CarDetails checkForRedirect={this.checkForRedirect} />;
            case 'extras' :
                return <Extras checkForRedirect={this.checkForRedirect} />;
            case 'infoAndPayment' :
                return <InfoAndPayment checkForRedirect={this.checkForRedirect} />;
            case 'confirmation' :
                return <Confirmation checkForRedirect={this.checkForRedirect} />;
            default :
                return <ChooseTransfer checkForRedirect={this.checkForRedirect} />
        }
    };

    /**
     * str replacer by indificator
     * @param str
     * @param indificator
     * @returns {string}
     */
    replaceStr = (str, indificator = '-') => {
        return str === undefined ? '' : str.split(indificator).join(' ');
    };

    componentWillUnmount() {
        this.props.hideOther(true);
    }

    render() {
        window.scrollTo(0, 0);
        let lang = this.props.activeLang.code;
        let str = this.props.location && this.props.location.pathname ? this.props.location.pathname.split('availableCars/')[1] : '';
        let titileArr = str ? str.split('/') : '';
        let title = (titileArr || []).length === 2 ? {
            page_title :  (`From  ${this.replaceStr(titileArr[0])} to ${this.replaceStr(titileArr[1])} Transfer - France and Switzerland | Alp Transfer`).toUpperCase()
        } : false;

        return (
            <div className={"containerFluid minHeigthWindow " + this.props.match.params.step}>
                <div className="container">
                    <div className="mobileCenterText">
                        <a href='/' onClick={this.clearSession}>
                            <img id="bookingPageLogo" src={logo} alt="Alp transfer"/>
                        </a>
                    </div>
                    {
                        this.props.match.params.step !== "chooseTransfer" &&
                        <div className="bookingMenu">
                            <ul>
                                <li className={this.props.match.params.step === 'chooseTransfer' ? "nextMenu" : ''}>
                                    <NavLink
                                        to={'/'}
                                        activeClassName="active">{ I18n.t('chooseTransfer') }
                                    </NavLink>
                                </li>
                                <li className={this.props.match.params.step === 'availableCars' ? "nextMenu" : ''}>
                                    <NavLink
                                        to={'/' + lang + '/booking/availableCars/'}
                                        activeClassName="active">{ I18n.t('availableCars') }
                                    </NavLink>
                                </li>
                                <li className={this.props.match.params.step === 'details' ? "nextMenu" : ''}>
                                    <NavLink
                                        to={'/' + lang + '/booking/details/'}
                                        activeClassName="active">{ I18n.t('datelis') }
                                    </NavLink>
                                </li>
                                <li className={this.props.match.params.step === 'extras' ? "nextMenu" : ''}>
                                    <NavLink
                                        to={'/' + lang + '/booking/extras/'}
                                        activeClassName="active">{ I18n.t('extras') }
                                    </NavLink>
                                </li>
                                <li className={this.props.match.params.step === 'infoAndPayment' ? "nextMenu" : ''}>
                                    <NavLink
                                        to={'/' + lang + '/booking/infoAndPayment/'}
                                        activeClassName="active">{ I18n.t('infoAndPayment') }
                                    </NavLink>
                                </li>
                                <li className={this.props.match.params.step === 'confirmation' ? "nextMenu" : ''}>
                                    <NavLink
                                        to={'/' + lang + '/booking/confirmation/'}
                                        activeClassName="active">{ I18n.t('confirmation') }
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    }
                </div>
                {this.switchComponent()}
                {
                    title && <SetMetaTag data={title} />

                }
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        activeLang : state.LangReducer.activeLang
    };
};
export default connect(mapStateToProps)(Booking);
