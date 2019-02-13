import moment from "moment/moment";

let initialData = {
    pickupList: [],
    destinationList : [],
    availableCars:[],
    bookings: {
        step1: {
            pickup_id: '',
            dropoff_id: '',
            pickup_date_time: moment()
        },
        step2: {
            pickup_date_time: moment(),
            return_date_time: null,
            returntrip: null,
            pickup_id: null,
            dropoff_id: null,
            tb_currency_id: null
        },
        step3: {
            adults: null,
            medium_children: null,
            small_children: null,
            small_suitcase: null,
            medium_suitcase: null,
            pickup_time: null,
            return_time: null,
            tb_currency_id : null,
            tb_currency_id_return:null
        },
        step4: {
            adults: null,
            medium_children: null,
            small_children: null,
            small_suitcase: null,
            medium_suitcase: null,
            pickup_time: null,
            return_time: null,
            tb_currency_id: null,
            extra : {}
        },
        step5: {
            name: null,
            surname: null,
            email: null,
            phone: null,
            message: null,
            country: null,
            city: null,
            postcode: null,
            address: null,
            dropoff_details: {},
            dropoff_address: null,
            pickup_details: {},
            pickup_address: null,
            tb_currency_id: null,
            tb_currency_id_return: null,
            tb_payment_method_id: 1,
            isGoing:0
        }
    },
    carTypes: {},
    carType: {},
    detalis: {},
    extras: {},
    infoAndPayment: {}

};

const BookingReducer = (state = initialData, action) => {
    switch (action.type) {
        case 'SET_PICKUP_LIST' :
            return {
                ...state,
                pickupList: [ ...action.payload ]
            };
        case 'SET_DESTINATION_LIST' :
            return {
                ...state,
                destinationList: [ action.payload ]
            };
        case 'SET_BOOKING_STEP_1':
            let step1 = { ...state.bookings };
                step1.step1 = action.payload;
            return {
                ...state,
                bookings: step1
            };
        case 'SET_BOOKING_STEP_2':
            let step2 = { ...state.bookings };
                step2.step2 = action.payload;
            return {
                ...state,
                bookings: step2
            };
        case 'SET_BOOKING_STEP_3':
            let step3 = { ...state.bookings };
            step3.step3 = action.payload;
            return {
                ...state,
                bookings: step3
            };
        case 'SET_BOOKING_STEP_4':
            let step4 = { ...state.bookings };
            step4.step4 = action.payload;
            return {
                ...state,
                bookings: step4
            };
        case 'SET_BOOKING_STEP_5':
            let step5 = { ...state.bookings };
            step5.step5 = action.payload;
            return {
                ...state,
                bookings: step5
            };
        case 'SET_CAR_TYPES':
            return {
                ...state,
                carTypes: {
                    carTypes: { ...action.payload.booking_data.cartypes },
                    carInfo: {
                        pickup_date_time: action.payload.booking_data.pickup_date_time,
                        route: action.payload.booking_data.route
                    }
                }
            };
        case 'SET_CAR_TYPE':
            return {
                ...state,
                carType: {
                    carType: { ...action.payload.booking_data.cartype },
                    carInfo: {
                        pickup_date_time: action.payload.booking_data.pickup_date_time,
                        return_date_time: action.payload.booking_data.return_date_time,
                        returntrip: action.payload.booking_data.returntrip,
                        tb_currency_id : action.payload.booking_data.tb_currency_id,
                        tb_currency_id_return : action.payload.booking_data.tb_currency_id_return ,
                        route: action.payload.booking_data.route
                    }
                }
            };
        case 'SET_DETAILS':
            let carInfo = { ...action.payload.booking_data };
            delete carInfo.cartype;
            return {
                ...state,
                detalis: {
                    carType: { ...action.payload.booking_data.cartype },
                    carInfo: { ...carInfo }
                }
            };
        case 'SET_EXTRAS':
            let data = { ...action.payload.booking_data };
            delete data.cartype;
            return {
                ...state,
                extras: {
                    carType: { ...action.payload.booking_data.cartype },
                    carInfo: { ...data }
                }
            };
        case 'SET_INFO_AND_PAYMENT':
            let info = { ...action.payload.booking_data };
            delete info.cartype;
            return {
                ...state,
                infoAndPayment: {
                    carType: { ...action.payload.booking_data.cartype },
                    carInfo: { ...info }
                }
            };
        default :
            return state;
    }
};

export default BookingReducer;