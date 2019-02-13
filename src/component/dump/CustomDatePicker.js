import DatePicker from "react-datepicker";

class CustomDatePicker extends DatePicker {
    deferFocusInput = () => {
        this.cancelFocusInput();
    }
}

export default CustomDatePicker;