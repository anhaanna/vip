import React from 'react';

class Fleet extends React.Component {
    render() {
        let { field_1, field_2, field_3 } = this.props.fleetList;
        return (
            <div className="fleetRound">
                { field_1 &&
                    <div>
                        <span className="_icon fleet1" />
                        <span className="round">{field_1}</span>
                    </div>
                }
                { field_2 &&
                    <div>
                        <span className="_icon fleet2" />
                        <span className="round">{field_2}</span>
                    </div>
                }
                {
                    field_3 &&
                    <div>
                        <span className="_icon fleet3" />
                        <span className="round">{field_3}</span>
                    </div>
                }
            </div>
        )
    }
}

export default Fleet;