var _ = require('lodash');
var React = require('react');
var Highcharts = require('react-highcharts/bundle/highcharts');
// var Highstock = require('react-highcharts/bundle/highstock');
var userService = require('../services/user');

function getLabels(data) {
    var activeTimestamps = data.filter(function(d) {
        return _.last(d) === 1;
    }).map(_.first);

    var sleepIntervals = activeTimestamps.reduce(function(memo, timestamp, i) {
        var isLast = i === (data.length - 1);
        if (isLast) {
            return memo;
        }

        var nextIndex = i + 1;
        var nextTimestamp = activeTimestamps[nextIndex];
        var hours = (nextTimestamp - timestamp) / 1000 / 60 / 60;

        if(hours > 2) {
            memo.push({
                from: timestamp,
                to: nextTimestamp,
                hours: hours
            });
        }

        return memo;
    }, []);

    return sleepIntervals.map(function (sleep) {
        return {
          color: '#dfe3ee',
          from: sleep.from,
          to: sleep.to,
          label: {
            text: sleep.hours.toFixed(1) + ' <br> hours <br> of sleep',
            fontWeight: 'bold',
            verticalAlign: 'middle',
            y: 0
          }
        }
    });
}

function getConfig(data) {
    var labels = getLabels(data);
    return {
        plotOptions: {
            series: {
                animation: false,
            },
        },
        legend: {
            enabled: false,
        },
        chart: {
            height: 300,
            renderTo: 'container',
            type: 'column',
        },
        title: {
            text: 'Availability',
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                month: '%e. %b',
                year: '%b',
            },
            plotBands: labels
        },
        yAxis: {
            max: 1,
            min: 0,
            minTickInterval: 1,
            labels: {
                enabled: false,
            },
            title: {
                text: '',
            },
        },
        tooltip: {
            formatter: function() {
                return new Date(this.x).toLocaleTimeString();
            },
        },
        series: [{
            color: '#3b5998',
            name: '-',
            data: data,
        }],
    };
}

module.exports = React.createClass({
    getUser(userId) {
        var _this = this;
        userService.getActivity(userId)
            .then(function(userActivity) {
                _this.setState({ userActivity: userActivity, userId: userId });
            })
            .done();
    },
    getInitialState() {
        return {
            userActivity: [],
        };
    },
    componentWillReceiveProps(props) {
        this.getUser(props.params.userId);
    },
    componentDidMount() {
        this.getUser(this.props.params.userId);
    },
    render() {
        return <Highcharts config = {getConfig(this.state.userActivity)}></Highcharts>
    }
});
