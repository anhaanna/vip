import React from 'react';
import {Link} from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import { I18n } from 'react-i18nify';


class FleetSection extends React.Component{
    render() {
        let lang = this.props.activeLang.code;
        return (
            <div className="containerFluid fleet">
                <div className="container">
                    <h2 className="green textCenter">{ I18n.t("fleet") }</h2>
                    <ul className="flex-container">
                        <li className="flex-item">
                            <Link to={'/' + lang + '/fleet/tesla-model-x-44'}>
                                <img src="https://alptransfer.com/images/cars/tesla/tesla_x.jpg" alt="price" />
                            </Link>
                            <p>
                                <Link to={'/' + lang + '/fleet/tesla-model-x-44'} > <b>Tesla Model X</b></Link>
                            </p>
                            { I18n.t("from") } 500 EUR

                        </li>
                        <li className="flex-item">
                            <Link to={'/' + lang + '/fleet/mercedes-benz-v-class'} >
                                <img src="https://alptransfer.com/images/cars/vclass-br/Mercedes_ Benz_V _class_Brown.jpg" alt="car" />
                            </Link>
                            <p>
                                <Link to={'/' + lang + '/fleet/mercedes-benz-v-class'} >
                                    <b> Mercedes V Class </b>
                                </Link>
                            </p> { I18n.t("from") } 500 EUR
                        </li>
                        <li className="flex-item">
                            <Link to={'/' + lang + '/fleet/mercedes-benz-sprinter'} >
                                <img src="https://alptransfer.com/images/cars/sprinter/Mercedes_Benz_Sprinter.jpg" alt="sign" />
                            </Link>
                            <p>
                                <Link to={'/' + lang + '/fleet/mercedes-benz-sprinter'} >
                                    <b> Mercedes Sprinter </b>
                                </Link>
                            </p>
                            { I18n.t("from") } 750 EUR
                        </li>

                    </ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        activeLang : state.LangReducer.activeLang,
    };
};
export default connect(mapStateToProps)(FleetSection);
