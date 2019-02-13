import React from 'react';
import { connect } from 'react-redux';
import SetMetaTag from './SetMetaTag';
import Article from './Article';
import serialize from 'form-serialize';
import { generateNavigation, setCategory } from "../actions/actionInitialData";
import { fetchData, postReq } from "./../services/RequestService";
import { setActiveMenu, setArticle } from './../actions/actionInitialData';
import { I18n } from 'react-i18nify';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: { ...this.props.match.params }
        };
        this.metaTags = false;
    };


    getData = (alias) => {
        if(this.props.match.params.menu === "booking" || this.props.match.params.menu === "destinations" || alias === "destinations") return;
        this.props.dispatch(fetchData({
            method : 'GET',
            url : 'menu/' + alias,
            callback : setActiveMenu
        }));
    };

    getArticleData = (alias) => {
        if(this.props.match.params.menu === "booking" || this.props.match.params.menu === "destinations" || alias === "destinations") return;
        this.props.dispatch((fetchData({
            method : 'GET',
            url : 'article/' + alias,
            callback : setArticle
        })));
    };

    componentWillReceiveProps(nextProps) {
        this.props.dispatch(generateNavigation(this.props.match.params));
        if(this.props.match.params.article !== nextProps.match.params.article) {
            this.getArticleData(nextProps.match.params.article);
        }

        if( this.props.match.params.menu !== nextProps.match.params.menu) {
            this.getData( nextProps.match.params.menu );
        }
    }

    componentDidMount() {
        if(this.props.match.params.article) {
            this.getArticleData(this.props.match.params.article);
            return;
        }
        this.getData( this.props.match.params.menu );
    }

    tagWhenGetFromBackend = () => {
        let elems = document.querySelectorAll('.textBox a');
        let lang = this.props.activeLang;
        Array.from(elems).forEach(link => {
            link.addEventListener('click', event => {
                let param = event.currentTarget.attributes.href.nodeValue.replace('https://alptransfer.com/', '').replace('http://react.alptransfer.com/api/', '');
                let urlPratacol = param.split('://')[0];
                let i = param.indexOf(':');
                if(!(urlPratacol === 'http' || urlPratacol === 'https' || ( -1 !== i ) )) {
                    event.preventDefault();
                    let paramIndex = param.indexOf('/');
                    if( paramIndex === 0 ) {
                        param = param.replace('/', '');
                        param = param.replace('en/', '');
                    }
                    this.props.history.push({ pathname: '/' + lang.code + '/' + param });
                }
            });
        });
    };

    componentDidUpdate() {
        this.formControl();
        this.tagWhenGetFromBackend();
    }

    formControl = () => {
        let forms = document.querySelectorAll('.textBox form');
        let thad = this;

        if( forms.length === 0 )
            return;

        Array.from(forms).forEach(form => {
            let btn = form.querySelectorAll('button');
            btn[0].onclick = (event) => {
                event.preventDefault();
                let formNotValid = false;
                let elems = form.querySelectorAll('input, textarea');
                Array.from(elems).forEach(elem => {
                    let isRequired = elem.hasAttribute('required');
                    if( isRequired && !elem.value ) {
                        formNotValid = true;
                        elem.className = elem.className + ' error';
                        elem.onkeyup = () => {
                            elem.value && elem.classList.remove('error');
                        }
                    } else {
                        elem.classList.remove('error');
                    }
                });

                if( formNotValid ) {
                    setTimeout(() => {
                        let errorItem = document.querySelectorAll('.error')[0];
                        errorItem.scrollIntoView();
                    }, 100);
                    return;
                }

                let serializeResponce =  serialize(form);
                let action = form.attributes.action.nodeValue;
                let requestData = {
                    url: action.replace('https://api.alptransfer.com/api/', '').replace('http://react.alptransfer.com/api/', ''),
                    method : 'POST',
                    data : serializeResponce
                };
                thad.props.dispatch(postReq(requestData));
            };
        });
    };

    metaSeter = () => <SetMetaTag data={this.metaTags}/>;

    getArticle = () => {
        if(this.props.match.params.article !== undefined){
            return;
        }

        let lang  = this.props.activeLang.code;
        if(this.props.categoryInfo[lang]) {
            this.metaTags = this.props.categoryInfo[lang];
        }
        return this.props.category.map((val, key) => {
            let data = {
                image : val.image ? 'https://api.alptransfer.com/storage/' + val.image : false,
                description : val.lang[lang].description,
                title : val.lang[lang].title,
                alias : '/' + this.props.match.params.lang + '/' +this.props.match.params.menu + '/' + val.alias,
                rowEffect :  key % 2 === 0 ? '' : <div className="rowEffect"> </div>,
                fleetList : val.fleet
            };
            return <Article key={val.id} data = {data} />;
        });
    };

    showArticle = () => {
        let { article , categoryInfo } = this.props;
        let lang  = this.props.activeLang.code;

        if(!Object.keys(article).length) {
            if(!Object.keys(categoryInfo).length || categoryInfo[lang].content === null )
                return false;


            return <div>
                    <div dangerouslySetInnerHTML = {{__html: categoryInfo[lang].content}}/>
                    <div className="clear"> </div>
                </div>;

        }
        if(this.props.article.lang[lang]) {
            this.metaTags = this.props.article.lang[lang];
        }
        return <div className="showArticle">
            { this.metaSeter(article.lang[lang]) }
            <h1 className="pageTitle">{article.lang[lang].title}</h1>
            <div className="textBox" dangerouslySetInnerHTML = {{__html: article.lang[lang].content}}/>
            <div className="clear"> </div>
        </div>

    };

    componentWillUnmount() {
        this.props.dispatch(setArticle({}));
        this.props.dispatch(setCategory({
            child : [],
            lang: {}
        }));
    }


    render() {
    window.scrollTo(0, 0);
        let { article, match } = this.props;
        let htmlClass = article &&  article.html_classes !== null &&  article.html_classes !== undefined ? article.html_classes : this.props.htmlClasses !== null ? this.props.htmlClasses : '';

        return (
            <div className={"containerFluid " + htmlClass}>
                { this.showArticle() }
                <div className="container">
                    {
                        match.params.menu === "fleet" && !match.params.article &&
                        <div id="wifi">
                            <i className="fa fa-wifi"></i>
			    { I18n.t('fleetWiFi') }
                        </div>
                    }
                    { this.getArticle() }
                    { this.metaSeter() }
                </div>
            </div>
        )
    }


}


const mapStateToProps = (state) => (
    {
        category : state.CategoryReducer.category,
        categoryInfo : state.CategoryReducer.info,
        htmlClasses : state.CategoryReducer.htmlClasses,
        article : state.ArticleReducer.article,
        activeLang : state.LangReducer.activeLang
    }
);


export default connect(mapStateToProps)(Menu);




