let initialData = {
    header: [],
    footer:[]
};

const MenuReducer = (state = initialData, action) => {
    switch (action.type) {
        case 'SET_MENU':
            let menuHeader = [];
            let menuFooter = [];
            let length = (action.payload || []).length;
            for (let i=0; i< length; i++) {
                let item = action.payload[i];
                let menuItem = {
                    id : item.id,
                    alias : item.alias,
                    child_rel : item.child_rel
                };
                for (let key in item.lang){
                    menuItem[key] = item.lang[key];
                }

                item.header === '1' && menuHeader.push(menuItem);
                item.footer === '1' && menuFooter.push(menuItem);
            }



           return {
                    ...state,
                    header: [...menuHeader],
                    footer: [...menuFooter]

                };
        default :
            return state;
    }
};
export default MenuReducer;