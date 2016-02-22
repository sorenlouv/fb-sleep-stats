var React = require('react');
var Highcharts = require('react-highcharts/bundle/highcharts');
var userService = require('../services/user');
var chartService = require('../services/chart');
var moment = require('moment');
Highcharts.Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

module.exports = React.createClass({
    getUser(userId) {
        var _this = this;
        userService.getActivity(userId)
            .then(function(timestamps) {
                _this.setState({
                    userId: userId,
                    config: chartService.getConfig(timestamps),
                    intervals: chartService.getSleepIntervals(timestamps),
                    count: timestamps.length
                });
            })
            .done();
    },
    getInitialState() {
        return {
            config: {},
            intervals: []
        };
    },
    componentWillReceiveProps(props) {
        this.getUser(props.params.userId);
    },
    componentDidMount() {
        this.getUser(this.props.params.userId);
    },
    render() {
        var intervalNodes = this.state.intervals.map(function (interval, i) {
            return (
                <tr key={i}>
                    <td>{moment(interval.key).format('dddd, MMM DD')}</td>
                    <td>{moment(interval.from).format('HH:mm')}-{moment(interval.to).format('HH:mm')}</td>
                    <td>{interval.duration} hours</td>
                </tr>
            );
        });

        return (
            <div>
                <div style={{width: '100%', overflow: 'scroll'}}>
                    <div style={{'min-width': (this.state.count * 4) + 'px'}}>
                        <Highcharts config={this.state.config} width="20000"></Highcharts>
                    </div>
                </div>
                <table className="interval-overview">
                    <thead>
                        <tr>
                            <td></td>
                            <td>Period</td>
                            <td>Duration</td>
                        </tr>
                    </thead>
                    <tbody>{intervalNodes}</tbody>
                </table>
            </div>
        );
    }
});
