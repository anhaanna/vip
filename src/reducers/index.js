import {combineReducers} from 'redux';
import MenuReducer from './MenuReducer';
import LangReducer from './LangReducer';
import SettingsReducer from "./SettingsReducer";
import CategoryReducer from './CategoryReducer';
import ArticleReducer from './ArticleReducer';
import LoadingPageReducer from './LoadingPageReducer';
import NavigateReducer from './NavigateReducer';
import BookingReducer from './BookingReducer';
import NotificationReducer from './NotificationReducer';
import GoogleAnanlyticsReducer from './GoogleAnanlyticsReducer';

const allReducers = combineReducers({
    LoadingPageReducer,
    MenuReducer,
    SettingsReducer,
    LangReducer,
    CategoryReducer,
    ArticleReducer,
    NavigateReducer,
    BookingReducer,
    NotificationReducer,
    GoogleAnanlyticsReducer
});

export default allReducers;
