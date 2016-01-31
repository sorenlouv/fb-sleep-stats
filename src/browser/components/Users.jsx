var React = require('react');
var Link = require('react-router').Link;

var userService = require('../services/user');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            users: [],
            query: ''
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
    render: function() {
        var users = this.state.users;
        var query = this.state.query;
        if(query) {
            users = users.filter(function (user) {
                return user.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
        }

        users = users.slice(0, 20);

        var userNodes = users.map(function (user) {
            return (
                <Link key={user.id} className="user" activeClassName="selected" to={'/user/' + user.id}>
                    <img src={'http://graph.facebook.com/' + user.id + '/picture?type=square'} />
                    <div className="name">{user.name}</div>
                </Link>
            );
        });

        return (
            <div>
                <input className="search" type="text" placeholder="Search" onChange={this.handleInputChange} value={this.state.query}/>
                <div>{userNodes}</div>
            </div>
        );
    }
});
