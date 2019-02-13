import React from 'react';
import { connect } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { I18n } from 'react-i18nify';
import Header from './Header';
import NavPage from './NavPage';
import HomeSection from './HomeSection';
import NewsSignIn from './NewsSignIn';
import Menu from './Menu';
import Footer from './Footer';
import Loading from './Loading';
import Booking from './Booking';
import Notification from './Notification';
import Destinations from './Destinations'
import languages from '../locale/languanges';
import history from '../history';
import SetMetaTag from "./SetMetaTag";

let tr = languages;
const translation = () => tr;
I18n.setTranslationsGetter(translation);



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow : true,
        };
    }

    hideOther = (isShow) => {
        if(isShow !== undefined) {
            this.setState({
                isShow : true
            });
        }
        if(!this.state.isShow) return;
        this.setState({
            isShow : false
        });
    };

    render () {
        return (
            <Router path="/(:locale)" history={history}>
                <div>
                    <Notification/>
                    <SetMetaTag />
                    <Route path="/:lang/booking/:step/" render={ (props) => { return <Booking {...props } hideOther = {this.hideOther} /> ;} }/>

                    <Header isShow = {this.state.isShow} />
                    <NavPage isShow = {this.state.isShow} />
                    <Route exact path="/" component={ HomeSection } />
                    <Route exact path="/:lang" component={ HomeSection } />
                    <Route exact path="/:lang/:menu" component={ Menu } />
                    <Route exact path="/:lang/:menu/:article" component={ Menu } />
                    <Route exact path="/:lang/destinations/" component={Destinations}/>
                    <Route exact path="/:lang/destinations/:alias/" component={Destinations}/>
                    <NewsSignIn isShow = {this.state.isShow} />
                    <Footer isShow = {this.state.isShow} />
                    <Loading/>
                </div>
            </Router>
        )
    }

}

const mapStateToProps = (state) => (
    {
        activeLang : state.LangReducer.activeLang
    }
);

export default connect(mapStateToProps)(App);