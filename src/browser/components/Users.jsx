var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var _ = require('lodash');
var Q = require('q');

var userService = require('../services/user');

module.exports = React.createClass({
    getInitialState() {
        return {
            users: [],
        };
    },
    componentDidMount: function() {
        var _this = this;
        userService.getList().then(function (users) {
            _this.setState({ users: users });
        });
    },
    handleInputChange: function(event) {
        this.setState({ query: event.target.value });
    },
    render() {
        var users = this.state.users;
        var query = this.state.query;
        if(query) {
            users = users.filter(function (user) {
                return user.name.toLowerCase().indexOf(query) > -1;
            });
        }

        var userNodes = users.map(function (user) {
            return <p key={user.id}><img src={'http://graph.facebook.com/' + user.id + '/picture?type=square'}/><Link to={`/user/${user.id}`}>{user.name}</Link></p>
        });

        return (
            <div>
                <input type="search" placeholder="Search" onChange={this.handleInputChange} value={this.state.query}/>
                {userNodes}
            </div>
        );
    }
});
