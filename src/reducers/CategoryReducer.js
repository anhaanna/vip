let initialData = {
    category : [],
    info : {},
    htmlClasses : null
};

const CategoryReducer = (state = initialData , action) => {
    switch (action.type){
        case 'SET_CATEGORY':
            return {
                ...state,
                category : [ ...action.payload.child ],
                info : { ...action.payload.lang },
                htmlClasses:  action.payload.htmlClasses
            };
        default :
            return state
    }
};

export default CategoryReducer;