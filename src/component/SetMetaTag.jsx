import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux'

class SetMetaTag extends React.Component {
    render() {
        let {settings} = this.props;
        let {data} = this.props;
        let lang = data && data.locale ? data.locale : 'en';
        let title = data && data.page_title ? data.page_title : settings.page_title || 'Private transfer services in Switzerland & France | AlpTransfer';
        let description = data ? data.meta_description : settings.meta_description || 'AlpTransfer provides private airport and city transfers from the airports of Zurich, Geneva, Bern, Basel in Switzerland, as well as from Lyon, Strasbourg and the Rhone-Alps region in France. Book your private transfer to your desired destination with AlpTransfer and travel with comfort and safety.';
        let keywords = data ? data.meta_keywords : settings.meta_keywords || 'alptransfer, transfer to alps, transfer to alps with cars, tours in alps, tours in switzerland, best places to visit in alps, transfer in switzerland with cars, cars excursion, door to door transfer in switzerland, airport transfer in switzerland, car diposal in switzerland, business cars transfer in switzerland, excursion in switzerland with cars, private airport transfers, airport transfers, private transfer, book transfer online, handicaped cars, cars for disabled, transporter, tours, travel, transfer, shuttle transfer, holiday transfer, business travel, buses';
        return (
            <Helmet htmlAttributes={{ lang : lang }} >
                <title>{title}</title>
                <meta name="keywords" content={keywords} />
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
            </Helmet>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        settings : state.SettingsReducer.settings
    };
};

export default connect(mapStateToProps)(SetMetaTag);
