let initialData = {
    article : {}
};

const ArticleReducer = (state = initialData, action) => {
    switch (action.type) {
        case 'SET_ARTICLE' :
            return {
                ...state,
                article: action.payload
            };
        default :
            return state;
    }
};

export default ArticleReducer;