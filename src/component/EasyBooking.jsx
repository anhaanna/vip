import React from 'react';
import { I18n } from 'react-i18nify';

class EasyBooking extends React.Component {
    render() {
        return (
            <div className="containerFluid easyBooking">
                <div className="container">
                    <h2 className="h1_white textCenter">{ I18n.t('easyBooking') }</h2>
                    <ul className="flex-container">
                        <li className="flex-item">
                            <span id="easy_1" />
                            <p><b> 1 </b>{ I18n.t('check_price') }</p>
                        </li>
                        <li className="flex-item">
                            <span id="easy_2" />
                            <p><b> 2 </b>{ I18n.t('choose_car') }</p>
                        </li>
                        <li className="flex-item">
                            <span id="easy_3" />
                            <p><b> 3 </b> { I18n.t('sign_register') }</p>
                        </li>

                        <li className="flex-item">
                            <span id="easy_4" />
                            <p><b> 4 </b> { I18n.t('choose_payment') }</p>
                        </li>
                        <li className="flex-item">
                            <span id="easy_5" />
                            <p><b>5 </b>{ I18n.t('email_confirmation') }</p>
                        </li>
                    </ul>
                </div>
            </div>
         )
    }
}

export default EasyBooking;
