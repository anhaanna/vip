import React from 'react';
import { I18n } from 'react-i18nify';

class Select2 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showList: false,
            filter: '',
            selected : {
                id: this.props.value,
                label: ''
            }
        }
    }

    componentWillReceiveProps(nextProps) {
       if(this.state.selected.id !== nextProps.value) {
           if( !nextProps.value ) {
               this.setState({
                   selected : {
                       id: '',
                       label: ''
                   }
               });
               return;
           }
           let ln = ( this.props.options || [] ).length;
           for(let i = 0; i < ln; i++ ) {
               if(this.props.options[i].id === nextProps.value){
                   this.setState({
                       selected : {
                           id: this.props.options[i].id,
                           label: this.props.options[i].label
                       }
                   });
                   break;
               }
           }
       }
    }


    filter = (event) => {
        let { value } = event.target;
        this.setState({
            filter: value ? value : ''
        });
    };

    hideSelect = () => this.setState({showList : false, filter : ''});

    showSelectList = () => {
        if( !this.state.showList ) {
            document.addEventListener('click', this.closeMenu, true);
        }
        this.setState({
            showList : !this.state.showList
        });
    };

    selectOption = (event) => {
        if(typeof this.props.onChange === 'function') {
            this.props.onChange(event);
        }

        if(event === null) {
            this.setState({
                filter: '',
                selected : {
                    id: null,
                    label: ''
                }
            });
        } else {
            this.setState({selected : event});
        }
        this.showSelectList();
    };

    generateSelectList = () => {
        let options = JSON.parse(JSON.stringify(this.props.options));
        let optionResult;

        if(this.state.filter){
            optionResult = options.filter(value => {
                let val = value.label.toLowerCase();
               let res = val.search(this.state.filter.toLowerCase());
               return res !== -1 ;
           });
        } else {
            optionResult = options;
        }

        if (!optionResult.length){
            return <ul><li className="selectNotResutl">noResultFound</li></ul>;
        }

        let result =  optionResult.map((val, key) => {
            if(this.state.selected.id) {
               this.setState({
                   selected: {
                       id: val.id,
                       label: val.label
                   }
               })
            }
            let icon = val.icon ? <span className="selectIcons"><img src={val.icon} alt={val.label}/></span> : '';
            return <li key={key} onClick={() => this.selectOption(val)} title={val.label}>{icon}{val.label}</li>;
        });

        return <ul>{ result } </ul>;
    };

    closeMenu = (event) => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.hideSelect();
        }
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.closeMenu);
    }

    setWrapperRef = (node) => {
        this.wrapperRef = node;
    };

    render() {
        let {placeholder, clearable} = this.props;
        return (
            <div className="customSelect" ref={this.setWrapperRef}>
                <div className={clearable ? 'selectControl clear' : 'selectControl'} onClick={this.showSelectList}>
                    <input
                        type="text"
                        placeholder={placeholder || I18n.t('Select')+'...'}
                        disabled={true}
                        value={this.state.selected.label}/>
                        <i className="fa fa-times" onClick={()=>this.selectOption(null)}> </i>
                </div>
                { this.state.showList &&
                    <div className="selectList">
                        {!this.props.disebleSearch &&
                        <div className="filterBlock">
                            <input className="selectFilterInput" type="text" value={this.state.filter}
                                   onChange={this.filter}/>
                        </div>
                        }
                        <div className="selectListBlock">
                            {this.generateSelectList()}
                        </div>
                    </div>
                }
            </div>
        )
    }

}

export default Select2;