import React from 'react';
import Fleet from './dump/Fleet';
import {Link} from 'react-router-dom';
import { I18n } from 'react-i18nify';

class Article extends React.Component {
    
    render() {
        window.scrollTo(0, 0);
        let { data } = this.props;
        let { field_1, field_2, field_3 } = data.fleetList;

        return (
            <article className="articles articleItem" >
                <h2><Link to={data.alias} >{data.title} </Link></h2>
                <div className="articleImage" >
                    {
                        data.image &&
                        <Link to={data.alias}>
                            <img src={data.image} alt={data.title}/>
                        </Link>
                    }
                    {
                        (field_1 || field_2 || field_3) &&
                        <Fleet fleetList={data.fleetList} />
                    }
                </div>
                <p className="description" dangerouslySetInnerHTML = {{__html: data.description}}></p>
                <p className="readMoreBtn"><Link to={data.alias} >{ I18n.t('readMore') }</Link></p>
            </article>
        )
    }
}

export default Article;
