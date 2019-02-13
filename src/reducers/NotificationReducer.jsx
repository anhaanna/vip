const initialData = {
    notification : []
};

const NotificationReducer = (state = initialData, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return {
                notification: [ ...action.payload ]
            };
        default :
            return state;
    }
};

export default NotificationReducer;