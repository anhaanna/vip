import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { I18n } from 'react-i18nify';
import {fetchData} from "../services/RequestService";
import {
    SetDestinationList,
    setArticle,
    setCategory,
    setBookingStep2, setCarTypes
} from "../actions/actionInitialData";
import moment from "moment";

class Destinations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter : ''
        }
    }

    filterDestinstion = (event) => this.setState({filter : event.target.value});

    getPickupIdByAlias = (alias) => {
        let pickupList = [...this.props.pickupList];
        let pickupLength = pickupList.length;
        let id = null;

        for(let i = 0; i < pickupLength; i++ ) {
            if(pickupList[i].alias === alias) {
                id = pickupList[i].id;
                break;
            }
        }
        return id;
    };

    getCars = (item) => {
        let lang = this.props.activeLang.code;
        let data = {
            pickup_id: this.getPickupIdByAlias(this.props.match.params.alias),
            dropoff_id: item.id,
            pickup_date_time: moment().format('Y-MM-DD')
        };

        this.props.dispatch(setBookingStep2(data));
        this.props.dispatch(fetchData({
            method: 'GET',
            url: 'cartypes/',
            callback: function (data) {
                this.props.history.push({ pathname: '/' + lang + '/booking/availableCars/' + this.props.match.params.alias + '/' + item.alias });
                return setCarTypes(data);
            }.bind(this),
            params : data
        }));
    };

    getPickupList = () => {
        let pickupList = [...this.props.pickupList];
        let lang = this.props.activeLang.code;
        let filter = this.state.filter;
        return pickupList.filter(item => {
            return item.title.toUpperCase().indexOf(filter.toUpperCase()) > -1;
        }).map(item => {
            return <li key={item.alias}><Link to={ '/' + lang + '/destinations/' + item.alias}><img src={item.icon} alt={ item.title } />{ item.title }</Link></li>
        });
    };

    getDestinationList = () => {
        let destinationList = this.props.destinationList[0] || [];
        return destinationList.map(item => <li className="pointer" key={item.alias} onClick={this.getCars.bind(this, item)}><span>{ item.title } </span></li> );
    };

    componentDidMount() {
        let { alias } = this.props.match.params;
        if(alias === undefined ) return;

        this.props.dispatch(fetchData({
            method: 'GET',
            url: 'points/' + alias,
            callback : SetDestinationList
        }));
    }

    componentWillMount() {
        this.props.dispatch(setArticle({}));
        this.props.dispatch(setCategory({
            child : [],
            lang: {}
        }));
    }


    render() {
        let { alias } = this.props.match.params;
        return (
            <div className="container-fluid">
                <div className="container">
                    <h1 className="pageTitle">Transfer - France & Switzerland - Zurich, Geneva, Bern, Basel, Lyon</h1>

                    {
                        alias === undefined &&
                        <input
                            className="destFilter"
                            type="text"
                            placeholder={I18n.t("filterDestination") + '...'}
                            value={this.state.filter}
                            onChange={this.filterDestinstion}/>
                    }
                        <ul className="addList">
                            { alias === undefined ? this.getPickupList() : this.getDestinationList() }
                        </ul>

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
    };
};
export default connect(mapStateToProps)(Destinations)