import React from 'react';
import { I18n } from 'react-i18nify';

class FirstSection extends React.Component{
    render() {
        return (
            <div className="container-fluid">
                <div className="container">
                    <h1 className="pageBigText">{ I18n.t("transferFranceSwitzerlandZurichGenevaBernBaselLyon") }</h1>
                    <div className="flex marginBottom100">
                        <div className="flex_item animation marginBottom50Mobile">
                            <div className="animationFrom">
                                <span className="_icon carH" />
                                <div>
                                    { I18n.t('airport') }
                                    <p><b>{ I18n.t('meetAndGreet') }</b></p>
                                </div>
                            </div>
                            <div className="animationTo">{ I18n.t('yourExpertDriverWillGreetYouRightAtTheAirport') }</div>
                        </div>
                        <div className="flex_item animation marginBottom50Mobile">
                            <div className="animationFrom">
                                <span className="_icon airplane" />
                                <div><b>{ I18n.t("flightMonitoring") }</b> <p>{ I18n.t("included") }</p></div>
                            </div>
                            <div className="animationTo">{ I18n.t("weMonitorYourFlightToAdjustTheTransferAtTheExactTime") }</div>
                        </div>
                        <div className="flex_item animation marginBottom50Mobile">
                            <div className="animationFrom">
                                <span className="_icon noCar" />
                                <div>{ I18n.t("free") } <p><b>{ I18n.t("cancelation") } </b></p></div>
                            </div>
                            <div className="animationTo">{ I18n.t("justContactUs48HoursBeforeForYourFullRefund") }</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default FirstSection;