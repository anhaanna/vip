import moment from 'moment';
import {
    setBookingStep2,
    setBookingStep3,
    setBookingStep4,
    setBookingStep5,
    setCarType,
    setDetails,
    setExtras,
    setInfoAndPayment
} from '../actions/actionInitialData';
const BookingMiddlewere = store => next => action => {
    switch (action.type) {
        case 'SET_STEPS':
            let payload = action.payload.booking_data;
            if(payload.step > 1) {
                let step2 = {
                    pickup_date_time: payload.pickup_date_time === null ? moment() : moment(payload.pickup_date_time, ['DD-MM-YYYY']),
                    return_date_time: payload.return_date_time === null ? moment() : moment( payload.return_date_time, ['DD-MM-YYYY']),
                    returntrip: payload.returntrip,
                    pickup_id: payload.route.pickup.id,
                    dropoff_id: payload.route.dropoff.id,
                    tb_currency_id: payload.tb_currency_id
                };
                next(setBookingStep2(step2));
                next(setCarType(action.payload));
            }
            if(payload.step > 2) {
                let step3 = {
                    adults: payload.adults,
                    medium_children: payload.medium_children,
                    small_children: payload.small_children,
                    small_suitcase: payload.small_suitcase,
                    medium_suitcase: payload.medium_suitcase,
                    pickup_time: payload.pickup_time === null ? null : moment(payload.pickup_time, ['h:m a', 'H:m']),
                    return_time: payload.return_time === null ? null : moment( payload.return_time, ['h:m a', 'H:m']),
                    tb_currency_id: payload.tb_currency_id
                };
                next(setBookingStep3(step3));
                next(setCarType(action.payload));
            }
            if(payload.step > 3) {
                let step4 = {
                    adults: payload.adults,
                    medium_children: payload.medium_children,
                    small_children: payload.small_children,
                    small_suitcase: payload.small_suitcase,
                    medium_suitcase: payload.medium_suitcase,
                    pickup_time: payload.pickup_time === null ? null : moment(payload.pickup_time, ['h:m a', 'H:m']),
                    return_time: payload.return_time === null ? null : moment( payload.return_time, ['h:m a', 'H:m']),
                    tb_currency_id: payload.tb_currency_id,
                    extra: {}
                };
                let selected = {};

                if(payload.extra_fields && payload.extra_fields.length){
                    let extraLength = payload.extra_fields.length;
                    for(let i = 0; i < extraLength; i++) {
                        selected[payload.extra_fields[i].id] = {
                            value: payload.extra_fields[i].count,
                            name: payload.extra_fields[i].id
                        }
                    }
                    step4.extra = selected
                }

                next(setBookingStep4(step4));
                next(setDetails(action.payload));
            }

            if(payload.step > 4) {
                let step5 = {
                    name: payload.name,
                    surname: payload.surname,
                    email: payload.email,
                    phone: payload.phone,
                    message: payload.message,
                    country: payload.country,
                    city: payload.city,
                    postcode: payload.postcode,
                    address: payload.address,
                    pickup_address: payload.pickup_address,
                    dropoff_address: payload.dropoff_address,
                    dropoff_details: {},
                    pickup_details: {},
                    isGoing:0,
                    tb_currency_id: payload.tb_currency_id,
                    tb_payment_method_id : payload.payment_method.id ? payload.payment_method.id : 1
                };

                if(payload.dropoff_details && payload.dropoff_details.length) {
                    let ln = payload.dropoff_details.length;
                    for(let i = 0;i < ln; i++) {
                        step5.dropoff_details[payload.dropoff_details[i].name] = payload.dropoff_details[i].value;
                    }
                }
                if(payload.pickup_details && payload.pickup_details.length) {
                    let ln = payload.pickup_details.length;
                    for(let i = 0;i < ln; i++) {
                        step5.pickup_details[payload.pickup_details[i].name] = payload.pickup_details[i].value;
                    }
                }
                next(setBookingStep5(step5));
                next(setExtras(action.payload));
            }

            if(payload.step > 5) {
                next(setInfoAndPayment(action.payload))
            }

            break;
        default:
            next(action);
    }
};

export default BookingMiddlewere;