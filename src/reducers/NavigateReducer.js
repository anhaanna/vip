const initialData = {
    urlParams : {}
};

const NavigateReducer = (state = initialData, action) => {
    switch (action.type ){
        case 'GENERATE_PAGE_NAVIGATION':
            return {
                ...state,
                urlParams: {...action.payload}
            };
        default :
            return state;

    }
};

export default NavigateReducer;