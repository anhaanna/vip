const initialData = {
    currentUrl : null,
    transactionNumber: null,

};

const GoogleAnanlyticsReducer = (state = initialData, action) => {

    switch (action.type) {
        case 'SET_CURRENT_URL':
                return {
                    ...state,
                    currentUrl: action.payload
                };
        case 'SET_TRANSACTION_NUMBER':
            return {
                ...state,
                transactionNumber: action.payload
            };

        default :
            return state;
    }
};

export default GoogleAnanlyticsReducer;