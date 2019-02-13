import * as React from 'react';
import moment from 'moment';
import Select from 'react-select';
import history from '../history';
import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import FlagIconFactory from 'react-flag-icon-css';
import { fetchData } from "./../services/RequestService";
import CustomDatePicker from "./dump/CustomDatePicker";
import {
    NavLink,
    Link
} from 'react-router-dom';
import {
    changeLang,
    SetDestinationList,
    setBookingStep2,
    setCarTypes
} from '../actions/actionInitialData';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import HtmlRender from  'react-render-html';
import logo from './../img/Alp-logo.svg';
import  {SetReactGAUrl}  from './dump/SetReactGA';


const FlagIcon = FlagIconFactory(React, { useCssModules: false });

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showMenu : false,
            pickup_date_time: moment(),
            required: [],
            selected : {
                pickup_id : '',
                dropoff_id : ''
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
    }

    changeLang = (lang) => {
        I18n.setLocale(lang.code);
        let current = window.location.pathname.split('/').filter((val) => val && val !== '');
        current[0] = lang.code;
        let url = current.join('/');
        if(url !== lang.code) {
            history.push('/' + url);
        }
        localStorage.setItem('lang', JSON.stringify(lang));
        this.props.dispatch(changeLang(lang));
    };

    getMenu = () => {
        let lang  = this.props.activeLang.code;
        return this.props.headerMenu.map((val) => (
           <li key={val.alias}>
               {
                   val.alias ?
                       <NavLink
                           to={'/' + lang + '/' + val.alias}
                           activeClassName="active">{val[lang].title}
                       </NavLink>
                       :
                       <Link to={'/'}>{val[lang].title}</Link>
               }
           </li>
        ));
    };

    getPickupList = () => {
        return this.props.pickupList.map(item => {

            let icon= '<img src='+item.icon+ '>' + item.title;

            let htmlRender = HtmlRender;
            return {
                value : item.id,
                label : htmlRender(icon),
                icon : item.icon
            }
        });
    };

    getDestinationList = () => {
        return (this.props.destinationList[0] || []).map(item => {
            let icon= '<img src='+item.icon+ '>' + item.title;    

            return {
                value : item.id,
                label : HtmlRender(icon),
                icon : item.icon
            }
        });
    };

    setStep1 = () => {
        let data = this.state.selected;
        let required = [];

        data.pickup_date_time = this.state.pickup_date_time === null ? null : this.state.pickup_date_time.format('Y-MM-DD');
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
        this.props.dispatch(setBookingStep2(data));
        this.props.dispatch(fetchData({
            method: 'GET',
            url: 'cartypes/',
            callback: function (data) {
                let redirect = '/' + this.props.activeLang.code + '/booking/availableCars/';
                history.push(redirect);
                return setCarTypes(data);
            }.bind(this),
            params : data
        }));
        const gtag = window.gtag;
        gtag('event', 'click', {
            'event_category': 'button',
            'event_label': 'homePage',
        });


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
                dropoff_id : value
            },
            required
        });
    };

    getLang = () => {
        return this.props.langs.map((ln) =>
            <li
                className={this.props.activeLang.code === ln.code ? 'mobile' : ''}
                key={ln.code}
                onClick={this.changeLang.bind(this, ln)}>
                <FlagIcon code={ln.icon} size="2x"/>
            </li>
        )
    };



    showMenu = () => {
        if( !this.state.showMenu ){
            document.addEventListener('click', this.showMenu);
        } else {
            document.removeEventListener('click', this.showMenu);
        }
        this.setState({showMenu : !this.state.showMenu});
    };

    clickOutside() {
        this.refs.picker.cancelFocusInput();
        this.refs.picker.setOpen(false);
    }

    render(){

        var  history_url = history.location.pathname


        if(history_url != this.props.currentUrl){
            SetReactGAUrl(history_url)
        }

        let homePage = this.props.urlParams.menu || this.props.urlParams.article ? 'other' : 'home';
        let lang  = this.props.activeLang.code;


        if( !this.props.isShow ) {
            return null;
        }

        return (
            <div className={'containerFluid header ' + homePage}>
           			<div className = "book_now">
                       <Link to="/">{ I18n.t('bookYourTransfer') }
                       		<i className="fa fa-car" aria-hidden="true"></i>
                       </Link>
                   </div>
                <header>
                    <div className="container">
                        <div id="logo">
                            <Link to="/"><img src={logo} alt="Alp transfer"/></Link>
                        </div>
                        <div className="mobile menuButton">
                            <span onClick={this.showMenu}>
                                <hr/>
                                <hr/>
                                <hr/>
                            </span>
                        </div>
                        <div className="menu mobileHide">
                            <nav>
                                <ul>
                                    {this.getMenu()}
                                </ul>
                            </nav>
                        </div>
                        <div id="lang">
                            <span className="mobileHide">
                                <FlagIcon code={this.props.activeLang.icon} size="lg" />
                            </span>
                            <ul>
                                {this.getLang()}
                            </ul>
                        </div>

                        <div className={ this.state.showMenu ? 'show menu mobile' : 'menu mobile'}>
                            <nav>
                                <ul>
                                    {this.getMenu()}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </header>
                {
                    homePage === 'home' &&
                    <div className="filterHome">
                        <div className={this.state.required.indexOf('pickupId') === -1 ? '' : 'errorForm'}>
                            <span>{ I18n.t('pickupLocation') }</span>
                            <Select
                                onChange={this.changePickup}
                                name="form-field-name"
                                value={this.state.selected.pickup_id}
                                noResultsText={<span>Not Found? <a style={{color:'#539a5b'}} href={lang+'/contact-form'}> Contact Us</a></span>}
                                options={this.getPickupList()}
                            />
                        </div>
                        <div className={this.state.required.indexOf('dropOffId') === -1 ? '' : 'errorForm'}>
                            <span>{ I18n.t('destination') }</span>
                            <Select
                                onChange={this.changeDestination}
                                name="form-field-name"
                                value={this.state.selected.dropoff_id}
                                noResultsText={<span>Not Found? <a style={{color:'#539a5b'}} href={lang+'/contact-form'}> Contact Us</a></span>}
                                options={this.getDestinationList()}
                            />
                        </div>
                        <div className={this.state.required.indexOf('pickupDateTime') === -1 ? 'dataPickerStyle' : 'errorForm dataPickerStyle'}>
                            <span>{ I18n.t('date') }</span>
                            <CustomDatePicker
                                dateFormat="DD-MM-YYYY"
                                minDate={new Date(Date.now())}
                                monthsShown={2}
                                selected={this.state.pickup_date_time}
                                onChange={this.handleChange}
                                fixedHeight

                            />
                        </div>
                        <div>
                            <span></span>
                            <button className="carIcon" onClick={this.setStep1}/>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        headerMenu : state.MenuReducer.header,
        langs : state.LangReducer.lang,
        activeLang : state.LangReducer.activeLang,
        category : state.CategoryReducer.category,
        article : state.ArticleReducer.article,
        urlParams : state.NavigateReducer.urlParams,
        pickupList : state.BookingReducer.pickupList,
        destinationList : state.BookingReducer.destinationList,
        currentUrl : state.GoogleAnanlyticsReducer.currentUrl

    };
};
export default connect(mapStateToProps)(Header);
