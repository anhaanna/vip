let initialData = {
    loadingPage : true
};

const LoadingPageReducer = (state = initialData, action) => {
    switch (action.type) {
        case 'LOADING_PAGE' :
            return {
                ...state,
                loadingPage: action.payload
            };
        default :
            return state;
    }
};

export default LoadingPageReducer;