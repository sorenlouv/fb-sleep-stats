// React
var React = require('react');
var ReactDOM = require('react-dom');

// React Router
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var browserHistory = require('react-router').browserHistory;

// Components
var Users = require('./Users.jsx');
var User = require('./User.jsx');

// Services
var facebookService = require('../services/facebook');

// Styles
require('./main.less');

var App = React.createClass({
    getInitialState() {
        return {
            isAuthenticated: false,
        };
    },
    componentDidMount: function () {
        var _this = this;
        facebookService.onAuthChange(function (isAuthenticated) {
           _this.setState({isAuthenticated: isAuthenticated});
        });
    },
    render() {
        var isAuthenticated = this.state.isAuthenticated;
        var loginButton = <div className="fb-login-button" data-max-rows="1" data-size="xlarge" data-show-faces="false" data-auto-logout-link="false"></div>
        return (
            <div>
                {!isAuthenticated ? loginButton : null}
                <div className="content">{this.props.children}</div>
                <div className="user-list">
                    {isAuthenticated ? <Users/> : null}
                </div>
            </div>
        );
    }
});


ReactDOM.render((
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="/user/:userId" component={User}/>
      </Route>
    </Router>
), document.getElementById('sleep-stats-app'))
