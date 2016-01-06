var _ = require('lodash');
var React = require('react');
var Highcharts = require('react-highcharts/bundle/highcharts');
var userService = require('../services/user');

function getLabels(timestamps) {
    return _(timestamps)
    .reduce(function(memo, timestamp, i) {
        var isLast = i === (timestamps.length - 1);
        if (isLast) {
            return memo;
        }

        var nextTimestamp = timestamps[i + 1];
        var durationHours = (nextTimestamp - timestamp) / 1000 / 60 / 60;
        var hour = new Date(timestamp).getHours();

        if(durationHours > 2 && durationHours < 14 && (hour > 21 || hour < 6)) {
            memo.push({
                from: timestamp,
                to: nextTimestamp
            });
        }

        return memo;
    }, [])
    .map(function (interval, i, intervals) {
        var MIN_DAY_LENGTH = 12 * 3600 * 1000;
        var isLast = i === (intervals.length - 1);
        if (isLast || interval.delete) {
            return interval;
        }

        var nextInterval = intervals[i + 1];
        var awakeDuration = nextInterval.from - interval.to;
        if(awakeDuration < MIN_DAY_LENGTH) {
            var nextIntervalDuration = (nextInterval.to - nextInterval.from);
            var intervalDuration = (interval.to - interval.from);
            if(awakeDuration < 15 * 60 * 1000 && (nextIntervalDuration + intervalDuration) < 14 * 3600 * 1000) {
                interval.delete = true;
                nextInterval.from = interval.from;
            }else {
                var nextIsLarger = nextIntervalDuration > intervalDuration;
                if(nextIsLarger) {
                    interval.delete = true;
                } else {
                    nextInterval.delete = true;
                }
            }
        }

        return interval;
    }, [])
    .filter(function (interval) {
        return !interval.delete;
    })
    .map(function (sleep) {
        var yesterday = getYesterday(sleep.to);
        var duration = (sleep.to - sleep.from) / 1000 / 60 / 60;
        return {
          color: '#dfe3ee',
          from: sleep.from,
          to: sleep.to,
          label: {
            text: '<strong>' + yesterday + '</strong><br>' + duration.toFixed(1) + ' hrs.<br> of sleep',
            fontWeight: 'bold',
            verticalAlign: 'middle',
            y: 0
          }
        }
    });
}

function getYesterday(timestamp) {
    var days = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
    var d = new Date(timestamp);
    d.setDate(d.getDate() - 1)
    var day = d.getDay();
    return days[day];
}

function getConfig(timestamps) {
    if(_.isEmpty(timestamps)) {
        return {};
    }

    var labels = getLabels(timestamps);
    var labels = [];
    var data = timestamps.map(function(timestamp){
        return [timestamp, 1];
    });

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
                function pad(n) { return ('0' + n).slice(-2); }
                var days = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
                var d = new Date(this.x);
                var weekDay = days[d.getDay()];
                var hours = pad(d.getHours());
                var minutes = pad(d.getMinutes());
                return weekDay + ' ' + hours + ':' + minutes;
            },
        },
        series: [{
            color: '#3b5998',
            name: '-',
            data: data,
        }]
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
