import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class NavPage extends React.Component {

    generatePageNav = () => {
        let lang  = this.props.activeLang.code;
        let {
            article,
            headerMenu,
            footerMenu,
            urlParams
        } = this.props;
        let url = '';
        let data = [{
                url : '/' + lang,
                name : 'Home'
            }];
        headerMenu.map(val => {
            if( val.alias === urlParams.menu ){
                data.push({
                    url : urlParams.menu,
                    name : val[lang].title
                });
            }
            return true;
        });

        footerMenu.map(val => {
            if( val.alias === urlParams.menu ){
                let flag = true;
                for(let i=0; i< data.length; i++){
                    if( data[i].url === urlParams.menu ){
                        flag = false;
                    }
                }
                if( flag ) {
                    data.push({
                        url : urlParams.menu,
                        name : val[lang].title
                    });
                }
            }
            return true;
        });

        if( article.alias && urlParams.article ) {
            data.push({
                url : article.alias,
                name : article.lang[lang].title
            });
        }
        return data.map( (val, key) => {
            url += val.url + '/';
            return <span key = {val.url}>{key > 0 && '➥'}<Link to={ url }>{val.name}</Link></span>;
        });
    };


    render() {
        if( !this.props.isShow ) {
            return null;
        }
        return (
            <div className="containerFluid">
                <div className="container">
                    <h5 className="pageNavigation">
                        {this.generatePageNav()}
                    </h5>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => (
    {
        headerMenu : state.MenuReducer.header,
        footerMenu : state.MenuReducer.footer,
        article : state.ArticleReducer.article,
        activeLang : state.LangReducer.activeLang,
        urlParams : state.NavigateReducer.urlParams

    }
);
export default connect(mapStateToProps)(NavPage);