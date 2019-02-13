import {I18n} from "react-i18nify";
import {
    changeLang,
    setLang,
    setMenu,
    setSettings
} from '../actions/actionInitialData';

const InitialMiddlewere = store => next => action => {
    switch (action.type){
        case 'GET_INITIAL_DATA' :
            let lang = store.getState().LangReducer.lang;
            let {payload} = action;

            if(lang.length === 0){
                let length = payload.menus.length;
                let navigationPayload = {};
                let payloadPerAlias = {};
                let i=0;
                let activeLang = {
                    name: "English",
                    code: "en",
                    icon: "gb"
                };
                let arrUrlParam = window.location.pathname.split('/');
                let languages = payload.languages;

                for(i; i<length; i++) {
                    delete payload.menus[i].deleted_at;
                    delete payload.menus[i].created_at;
                    delete payload.menus[i].updated_at;
                    delete payload.menus[i].location;
                    delete payload.menus[i].trans;
                    payloadPerAlias[payload.menus[i].align] = payload.menus[i];
                }

                if(Array.isArray(arrUrlParam) && arrUrlParam[1] !== "") {
                    activeLang = languages.filter( lang => lang.code === arrUrlParam[1])[0];
                }else {
                    try {
                        let langFromStorage = JSON.parse(localStorage.getItem('lang'));
                        if(langFromStorage !== null){
                            activeLang = langFromStorage;
                        }
                    }catch (e) {
                        activeLang = {
                            "name":"English",
                            "code":"en",
                            "icon":"gb"
                        };
                    }
                }

                navigationPayload[payload.menus[0].alias] = payload.menus[0].lang ;
                navigationPayload[payload.menus[0].alias].url = payload.menus[0].alias + '/' ;
                I18n.setLocale(activeLang.code);
                next(setLang(payload.languages));
                next(setMenu(payload.menus));
                next(setSettings(payload.settings));
                next(changeLang(activeLang));

            }
            break;
        default :
            next(action);
    }
};


export default InitialMiddlewere;