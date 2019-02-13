import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import allReducers from './reducers/index';
import { init } from  './helpers/bootstrap';
import App from './component/App';
import InitialMiddlewere from './middleware/InitialMiddlewere';
import MenuMiddlewere from './middleware/MenuMiddlewere';
import BookingMiddlewere from './middleware/BookingMiddlewere';
import registerServiceWorker from './registerServiceWorker';


const middleware = [thunk, InitialMiddlewere, MenuMiddlewere, BookingMiddlewere ];
const store = createStore(allReducers,applyMiddleware(...middleware));

init(store);
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
