import {
    loadingPage,
    setNotification
} from "../actions/actionInitialData";

const config = {
    requestPath : 'https://api.alptransfer.com/api/'
};

export function fetchData (data) {
    data = data ? data : {
        method : "GET",
        url : ''
    };
    if( data.params ) {
        let params = '?';
        Object.keys(data.params).forEach((key) => {
            params += key + '=' + data.params[key] + '&';
        });
        data.url = data.url + params.substring(0,params.length - 1);
    }
    return function (dispatch) {
        dispatch(loadingPage(true));
        fetch(config.requestPath + data.url)
            .then((response) => {return response.json()})
            .then((responseJson) => {
                if(responseJson.messages || responseJson.message) {
                    let response = responseJson.messages || responseJson.message;
                    dispatch(setNotification([response]));
                    if( typeof data.callbacks === "object" && Array.isArray(data.callbacks) ) {
                        for(let i = 0; i< data.callbacks.length; i++) {
                            data.callbacks[i](responseJson);
                        }
                    }
                } else {
                    if( Array.isArray(responseJson) && responseJson.length === 0 ) {
                        if( typeof data.callbacks === "object" && Array.isArray(data.callbacks) ) {
                            for(let i = 0; i< data.callbacks.length; i++) {
                                data.callbacks[i](responseJson);
                            }
                        }
                    } else {
                        if(typeof data.callback === 'function') {
                            dispatch(data.callback(responseJson));
                        }

                        if( typeof data.callbacks === "object" && Array.isArray(data.callbacks) ) {
                            for(let i = 0; i< data.callbacks.length; i++) {
                                data.callbacks[i](responseJson);
                            }
                        }
                    }

                }
                dispatch(loadingPage(false));
            })
            .catch((error) => {
                console.error(error);
                dispatch(loadingPage(false));
            });
    };
}

export function postReq(data) {
    
    let requestData =  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: data.data,
    };
    return function (dispatch) {
        dispatch(loadingPage(true));
        fetch(config.requestPath + data.url, requestData)
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                if(responseJson.messages || responseJson.message) {
                    let response = responseJson.messages || responseJson.message;
                    dispatch(setNotification([response]));
                    if( typeof data.callbacks === "object" && Array.isArray(data.callbacks) ) {
                        for(let i = 0; i< data.callbacks.length; i++) {
                            data.callbacks[i](responseJson);
                        }
                    }
                } else {
                    if ( typeof data.callback === 'function' ) {
                        data.callback(responseJson);
                    }
                    if( typeof data.callbacks === "object" && Array.isArray(data.callbacks) ) {
                        for(let i = 0; i< data.callbacks.length; i++) {
                            data.callbacks[i](responseJson);
                        }
                    }
                }
                dispatch(loadingPage(false));
            })
            .catch(error => {
                console.error(error);
                dispatch(loadingPage(false));
            });
    }

}

export function post(data) {
    let params = '' ;
    if( data.data ) {
        if(data.data.extra_fields) {
            for(let i =0; i < data.data.extra_fields.length; i++) {
                params += `extra_fields[${i}][name]=${data.data.extra_fields[i].name}&extra_fields[${i}][value]=${data.data.extra_fields[i].value}&`;
            }
            delete data.data.extra_fields;
        }
        if(data.data.dropoff_details) {
            let arrDrop = Object.keys(data.data.dropoff_details);
            let dropList = data.data.dropoff_details;
            for(let i =0; i < arrDrop.length; i++) {
                let key = arrDrop[i];
                params += `dropoff_details[${i}][name]=${key}&dropoff_details[${i}][value]=${dropList[key]}&`;
            }
            delete data.data.dropoff_details;
        }
        if(data.data.pickup_details) {
            let arrPick = Object.keys(data.data.pickup_details);
            let PickList = data.data.pickup_details;
            for(let i =0; i < arrPick.length; i++) {
                let key = arrPick[i];
                params += `pickup_details[${i}][name]=${key}&pickup_details[${i}][value]=${PickList[key]}&`;
            }
            delete data.data.pickup_details;
        }

        Object.keys(data.data).forEach((key) => {
            params += `${key}=${data.data[key]}&`;
        });
    }

    let requestData =  {
        method: 'POST',
        body: params.substring(0,params.length - 1),
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
    };

    return function (dispatch) {
        dispatch(loadingPage(true));
        fetch(config.requestPath + data.url, requestData)
            .then( response => response.json())
            .then( responseJson => {
                if(responseJson.messages || responseJson.message) {
                    let response = responseJson.messages || responseJson.message;
                    dispatch(setNotification([response]));
                    if( typeof data.callbacks === "object" && Array.isArray(data.callbacks) ) {
                        for(let i = 0; i< data.callbacks.length; i++) {
                            data.callbacks[i](responseJson);
                        }
                    }
                } else {
                    if(typeof data.callback === 'function') {
                        dispatch(data.callback(responseJson));
                    }
                    if( typeof data.callbacks === "object" && Array.isArray(data.callbacks) ) {
                        for(let i = 0; i< data.callbacks.length; i++) {
                            data.callbacks[i](responseJson);
                        }
                    }
                }
                dispatch(loadingPage(false));

            })
            .catch(error => {
                console.error(error, 'Line 119 on file RequestService.js');
                dispatch(loadingPage(false));
            });
    }

}