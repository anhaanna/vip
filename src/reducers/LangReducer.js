let initialData = {
    lang: [],
    activeLang: {
        name: "English",
        code: "en",
        icon: "gb"
    }
};

const LangReducer = (state = initialData, action) => {
    switch (action.type) {
        case 'SET_LANGUAGE':
            return {
                ...state,
                lang : action.payload
            };
        case 'CHANGE_LANG':
            return {
                ...state,
                activeLang : {...action.payload}
            };
        default :
            return state;
    }
};
export default LangReducer;
