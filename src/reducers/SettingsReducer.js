const initialData = {
    settings : {}
};

const SettingsReducer = (state = initialData, action) => {
    switch (action.type) {
        case 'SET_SETTINGS':
            return {
                settings: { ...action.payload }
            };
        default :
            return state;
    }
};

export default SettingsReducer;