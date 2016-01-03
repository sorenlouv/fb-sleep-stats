var React = require('react');
var ReactDOM = require('react-dom');
var ReactHighcharts = require('react-highcharts/bundle/highcharts');
var userService = require('../services/user');

function getConfig(data) {
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
            height: 200,
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
            name: '-',
            data: data,
        }, ],
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
        return (
            <div>
                <ReactHighcharts config = {getConfig(this.state.userActivity)}></ReactHighcharts>
            </div>
        );
    }
});
