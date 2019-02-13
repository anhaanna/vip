import {
    setCategory,
    setArticle
} from "../actions/actionInitialData";

const MenuMiddlewere = state => next => action => {
    switch (action.type){
        case 'SET_ACTIVE_MENU':
            let category = action.payload.child.Category;
            let article = action.payload.child.Article;
            if(category !== undefined && category.child) {
                let categoryPayload = {
                    child : category.child,
                    lang : category.lang,
                    htmlClasses: category.html_classes
                };
                next(setCategory(categoryPayload));
            }else {
                let categoryPayload = {
                    child : [],
                    lang : [],
                    htmlClasses : null
                };
                next(setCategory(categoryPayload));
            }
            if(article !== undefined) {
                next(setArticle(article));
            }
            break;
        default :
            next(action);
    }
};

export default MenuMiddlewere;