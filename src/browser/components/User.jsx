var React = require('react');
var Highcharts = require('highcharts');
var ReactHighcharts = require('react-highcharts');
require('highcharts-exporting')(ReactHighcharts.Highcharts);
require('highcharts-offline-exporting')(ReactHighcharts.Highcharts);
var userService = require('../services/user');
var chartService = require('../services/chart');
var moment = require('moment');
ReactHighcharts.Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

function getSleepHabits(intervals) {
    var intervalNodes = intervals.map(function (interval, i) {
        return (
            <tr key={i}>
                <td>{moment(interval.key).format('dddd, MMM DD')}</td>
                <td>{moment(interval.from).format('HH:mm')}-{moment(interval.to).format('HH:mm')}</td>
                <td>{interval.duration} hours</td>
            </tr>
        );
    });

    if (intervalNodes.length > 0) {
        return (
            <table className="interval-overview">
                <thead>
                    <tr>
                        <td>Night after</td>
                        <td>Period</td>
                        <td>Duration</td>
                    </tr>
                </thead>
                <tbody>{intervalNodes}</tbody>
            </table>
        );
    } else {
        return <p>Not enough data to show sleep patterns.</p>
    }
}

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

        var sleepHabitsNode = getSleepHabits(this.state.intervals);

        return (
            <div>
                <div className="chart-container">
                    <div style={{minWidth: (this.state.count * 4) + 'px'}}>
                        <ReactHighcharts config={this.state.config}></ReactHighcharts>
                    </div>
                </div>
                {sleepHabitsNode}
            </div>
        );
    }
});
