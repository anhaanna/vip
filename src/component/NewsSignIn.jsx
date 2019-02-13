import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import {setNotification} from "../actions/actionInitialData";
import {postReq} from "../services/RequestService";


class NewsSignIn extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            required: [],
            name: '',
            email: ''
        }
    }

    changeName = (event) => {
        let required = [...this.state.required].filter(val=>val !== 'name');
        this.setState({
            name: event.target && event.target.value ? event.target.value : '',
            required
        });
    };

    changeEmail = (event) => {
        let required = [...this.state.required].filter(val=>val !== 'email');
        this.setState({
            email: event.target && event.target.value ? event.target.value : '',
            required
        });
    };

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    handleClick = () => {
        let {name, email} = this.state;
        let required = [];

        if(name === ''){
            required.push('name');
        }

        if(email === '' || !this.validateEmail(email)){
            required.push('email');
        }

        if(required.length){
            this.setState({required});
            let errorMessageList = required.map((val) => {
                let message;
                switch (val) {
                    case 'email':
                        message = (email === '')? I18n.t('errorMessageEmail') : I18n.t('errorMessageEmailFormat');
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
            return;
        }

        this.props.dispatch(postReq({
            url: 'subscribe',
            method : 'POST',
            data : "name="+ name + '&email=' + email
        }));

    };


    render() {
        if( !this.props.isShow ) {
            return null;
        }
        let {name, email } = this.state;
        return (
            <div className="containerFluid newsSignIn">
                <div className="container">
                    <div className="newsSignInForm" >
                        <div><span>{ I18n.t("signUpForOurNewsletter") }</span></div>
                        <div><input className={this.state.required.indexOf('name') === -1 ? 'input-80' : 'borderRed input-80'} type="text" value={ name } onChange={ this.changeName } placeholder="Name"/></div>
                        <div><input className={this.state.required.indexOf('email') === -1 ? 'input-80' : 'borderRed input-80'} value={ email } onChange={ this.changeEmail } placeholder="E-mail"/></div>
                        <div><input className='input-80' value="" type="submit" onClick={this.handleClick}/></div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        state: state
    }
};

export default connect(mapStateToProps)(NewsSignIn);