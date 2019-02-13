import {fetchData} from "./../services/RequestService";
import {getInitialData, SetPickupList} from './../actions/actionInitialData';
export function init (store) {
    /*
    * @param redux store object
    * function for cunfigure initial data
    * */

    store.dispatch(fetchData({
        method : 'GET',
        url : 'main/',
        callback : getInitialData
    }));

    store.dispatch(fetchData({
        method: 'GET',
        url : 'points/',
        callback: SetPickupList
    }));
}
