import React from 'react';
import { connect } from 'react-redux';
import  {SetReactGAUrl}  from './dump/SetReactGA';
import history from "../history";
import {bindActionCreators} from "redux";
import {setUrlInStore} from "../actions/actionInitialData";

class Loading extends React.Component {
    render() {



        var  url = history.location.pathname;
        if(this.props.currentUrl != url ){
            this.props.setUrl(url);
            SetReactGAUrl(url)
        }
        return (
            <div>
                {this.props.isLoading && <div className="loadingPage">Loading ...</div>}
            </div>
        )
    }
}

const MapStateToProps = (state) => {
    return {
        isLoading : state.LoadingPageReducer.loadingPage,
        currentUrl : state.GoogleAnanlyticsReducer.currentUrl
    }
};
const matchDispatchToProps =(dispach)=>{
    return bindActionCreators({setUrl:setUrlInStore},dispach)
}

export default  connect(MapStateToProps,matchDispatchToProps)(Loading)