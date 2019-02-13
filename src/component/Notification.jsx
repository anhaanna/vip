import React from 'react'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import 'react-notifications/lib/notifications.css';

class Notification extends React.Component {
    createNotification = (type = '', message = '') => {
        switch (type) {
            case 'info':
                NotificationManager.info(message, 'Info message');
                break;
            case 'success':
                NotificationManager.success(message, 'Success message');
                break;
            case 'warning':
                NotificationManager.warning(message, 'Warning message');
                break;
            case 'error':
                NotificationManager.error( message , 'Error message');
                break;
            default :
                NotificationManager.error( message, 'Error message');
        }
    };

    showNotification = () => {
        let notificationList = this.props.notification || [];

        return notificationList.map( val => {

            if( typeof val !== "string" && typeof val.result !== 'string' ) {
                return Object.keys(val.result).map( key => this.createNotification(val.status, val.result[key]))
            } else if(typeof val !== "string"){
                return this.createNotification(val.status, val.result);
            } else {
                return this.createNotification(false , val);
            }
        });
    };


    render() {
        return (
            <div>
                { this.showNotification() }
                <NotificationContainer/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        notification : state.NotificationReducer.notification
    }
};

export default connect(mapStateToProps)(Notification);