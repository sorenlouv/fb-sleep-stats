var _ = require('lodash');
var chartService = {};

function cloneDate(d) {
    return new Date(d.getTime());
}

function getSleepScore(timestampStart, timestampEnd) {
    var dateStart = new Date(timestampStart);
    var dateEnd = new Date(timestampEnd);

    var standardStart = new Date(cloneDate(dateEnd).setDate(dateEnd.getDate() - 1)).setHours(22);
    var standardEnd = cloneDate(dateEnd).setHours(8);

    var startDeviation = Math.pow(toHours(Math.abs(standardStart - dateStart)), 2);
    var endDeviation = Math.pow(toHours(Math.abs(standardEnd - dateEnd)), 3);

    var STANDARD_SLEEP_DURATION = 8;
    var duration = toHours(timestampEnd - timestampStart);
    var durationDeviation = Math.pow(Math.abs(duration - STANDARD_SLEEP_DURATION), 3);

    return startDeviation + endDeviation + durationDeviation;
}

function fromMinutes(minutes) {
    return 1000 * 60 * minutes;
}

function toHours(milliseconds) {
    return (milliseconds / (1000 * 60 * 60)).toFixed(1);
}

function getYesterday(timestamp) {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    var d = new Date(timestamp);
    d.setDate(d.getDate() - 1);
    var day = d.getDay();
    return days[day];
}

chartService.getSleepIntervals = function(timestamps) {
    if (!timestamps) {
        return [];
    }

    return _.chain(timestamps)

        // Create all possible intervals
        .reduce(function(memo, timestamp, i) {
            var timestampStart = timestamp;
            var timestampEnd = timestamps[i + 1];
            if (!timestampEnd) {
                return memo;
            }

            memo.push({
                from: timestampStart,
                to: timestampEnd
            });

            return memo;
        }, [])

        // Combine Intervals
        .reduce(function(memo, interval, i, intervals) {
            var nextInterval = intervals[i + 1];
            if (!nextInterval) {
                return memo;
            }

            var timeBeetweenIntervals = nextInterval.from - interval.to;
            if (timeBeetweenIntervals < fromMinutes(15) && interval.combineCount < 3) {
                memo.push({
                    from: interval.from,
                    to: nextInterval.to,
                    combineCount: _.add(interval.combineCount, 1)
                });
            }

            memo.push(interval);
            return memo;
        }, [])

        // Calculate sleep score
        .map(function(interval, i, intervals) {
            interval.score = getSleepScore(interval.from, interval.to);
            interval.duration = toHours(interval.to - interval.from);
            return interval;
        })
        .sortByOrder('score', 'asc')

        // Only have a single interval per day
        .reduce(function(memo, interval, i) {
            var d = new Date(interval.to);
            var key = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1).getTime();

            if (!_.some(memo, {key: key})) {
                interval.key = key;
                memo.push(interval);
            }

            return memo;
        }, [])
        .filter(function(interval) {
            return interval.score < 200;
        })
        .sortBy('key')
        .value();
};

function getPlotBands(timestamps) {
    return chartService.getSleepIntervals(timestamps)
        .map(function(interval) {
            var yesterday = getYesterday(interval.to);
            var duration = interval.to - interval.from;
            return {
                color: '#dfe3ee',
                from: interval.from,
                to: interval.to,
                label: {
                    text: '<strong>' + yesterday + '</strong><br>' + toHours(duration) + ' hrs.<br> of sleep',
                    fontWeight: 'bold',
                    verticalAlign: 'middle',
                    y: 0
                }
            };
        });
}

chartService.getConfig = function(timestamps) {
    if (_.isEmpty(timestamps)) {
        return {};
    }

    var data = timestamps.map(function(timestamp) {
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
            plotBands: getPlotBands(timestamps)
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
                function pad(n) {
                    return ('0' + n).slice(-2);
                }
                var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
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
};

module.exports = chartService;
