import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { I18n } from 'react-i18nify';


class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isScroll : '',
            intervalId: 0
        };
    }

    getMenu = () => {
        let lang  = this.props.activeLang.code;
        return this.props.footerMenu.map((val) => (
            <li key={val.alias}>
                <NavLink
                    to={'/' + lang + '/' + val.alias}
                    activeClassName="active">{val[lang].title}
                </NavLink>
            </li>
        ));
    };

    handleScroll = () => {
        let doc = document.documentElement;
        let scrollPositon = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0) > 100;

        this.setState({
            isScroll : scrollPositon ? 'isScroll' : ''
        })
    };

    componentDidMount = () => {
        window.addEventListener('scroll', this.handleScroll);
    };

    scrollStep = () => {
        if (window.pageYOffset === 0) {
            clearInterval(this.state.intervalId);
        }
        window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
    };

    scrolling = () => {

        let intervalId = setInterval(this.scrollStep.bind(this), this.props.delayInMs);
        this.setState({ intervalId: intervalId });
    };

    render() {
        if( !this.props.isShow ) {
            return null;
        }
        let lang  = this.props.activeLang.code;
        return (
            <div className="container-fluid footer">
                <div className="container">
                    <div className="box1">
                        <div className="moduletable">
                            <h3>{ I18n.t("quickLinks") }</h3>

                            <ul>
                                {this.getMenu()}
                                <li>
                                    <a target="_blank" rel='noreferrer noopener' href="http://partner.alptransfer.com/login">{ I18n.t("partnerLogin") }</a>
                                </li>
                                <li>
                                    <a target="_blank" rel='noreferrer noopener' href="https://driver-app.alptransfer.com/en/login">{ I18n.t("driverLogin") }</a>
                                </li>
                                <li>
                                    <Link to={'/' + lang  + '/destinations'}>{ I18n.t("destinations") }</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="box2">
                        <div className="moduletable">
                            <h3 className="textCenter">{ I18n.t("discoverUs") }</h3>
                            <div id="discover" >
                                <a href="https://switzerland-tour.com/" target="_blank" rel='noreferrer noopener'>
                                    <span id="disc-swiss"> </span>
                                </a>
                                <a href="https://transfer-airports.com/" target="_blank" rel='noreferrer noopener'>
                                    <span id="disc-trans"> </span>
                                </a>
                                <a href="http://vip-transfers.ch/" target="_blank" rel='noreferrer noopener'>
                                    <span id="disc-vip"> </span>
                                </a>
                                <a href="https://www.tripadvisor.com/Attraction_Review-g315924-d10136887-Reviews-Alptransfer-Fribourg_Canton_of_Fribourg.html" target="_blank" rel='noreferrer noopener'>
                                  <span id="trip-advisor"></span>
                                </a>
                                <a href="https://www.trustpilot.com/review/alptransfer.com" target="_blank" rel='noreferrer noopener'>
                                    <span id="trust_pilot"> </span>
                                </a>
                                <a href="https://www.myswitzerland.com/en-gb/aratours-incoming.html" target="_blank" rel='noreferrer noopener'>
                                    <span id="disc-ms-en"> </span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="box3">
                        <div className="moduletable">
                            <h3>{ I18n.t("contactUs") }</h3>
                            <div className="custom">
                                <ul>
                                    <li>Tel CH: +41 22 777 0001</li>
                                    <li>E-mail: info@alptransfer.com</li>
                                    <li>AlpTransfer Office: Fribourg</li>
                                    <li>AlpTransfer Fleet in
                                        <ul className="alp_fleet">
                                            <li><Link to={'/' + lang  + '/airports/zurich-airport'}>Zurich Airport</Link></li>
                                            <li><Link to={'/' + lang  + '/airports/geneva-airport'}>Geneva Airport</Link></li>
                                            <li><Link to={'/' + lang  + '/airports/bern-airport'}>Bern Airport</Link></li>
                                            <li><Link to={'/' + lang  + '/airports/basel-airport'}>Basel Airport</Link></li>
                                        </ul>
                                    </li>                                   
                                </ul>
                                <div className="custom social">
                                  <a href="https://www.facebook.com/alptransfercom/" target="_blank" rel='noreferrer noopener'>
                                    <i className="fa fa-facebook fa-2x" aria-hidden="true"></i>
                                  </a> 
                                  <a href="https://twitter.com/Alptransfer" target="_blank" rel='noreferrer noopener'>
                                    <i className="fa fa-twitter fa-2x" aria-hidden="true"></i>
                                  </a> 
                                  <a href="https://www.instagram.com/alptransfercom/" target="_blank" rel='noreferrer noopener'>
                                    <i className="fa fa-instagram fa-2x" aria-hidden="true"></i>
                                  </a>
                                   <a href="https://vk.com/alptransfercom" target="_blank" rel='noreferrer noopener'>
                                    <i className="fa fa-vk fa-2x" aria-hidden="true"></i>
                                  </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pr_police textCenter">
                    <p> © 2019 alptransfer.com | <Link className="privacy" to={'/' + lang  + '/privacy-policy'}>{ I18n.t("privacyPolicy") }</Link>
                    </p>
                </div>
                <span id="gotop" className={ this.state.isScroll } onClick={this.scrolling}>
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <g data-name="2-Arrow up" id="_2-Arrow_up">
                            <circle className="cls-1" cx="16" cy="16" r="15" />
                            <polyline className="cls-1" points="9 19 16 12 23 19" />
                        </g>
                    </svg>
                </span>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch : (obj) => dispatch(obj)
    }
};

const mapStateToProps = (state) => {
    return {
        footerMenu : state.MenuReducer.footer,
        activeLang : state.LangReducer.activeLang
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);