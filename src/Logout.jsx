import React from 'react';
import {logout} from './AuthService.js';
import { Redirect } from 'react-router-dom';

export default class Logout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn : false,
			redirect : false
		};
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		chrome.runtime.sendMessage({kind:'getState'}, response => {
			this.setState( (prevState) => {
				return {
					redirect: prevState.redirect,
					isLoggedIn : response.isLoggedIn
				};
			});
		});
	}

	handleClick(event) {
		event.preventDefault();
		logout()
			.then( response => {
				console.log(response);
				chrome.runtime.sendMessage({kind:'nowIsLogout'}),
				this.setState( () => {
					return {
						isLoggedIn: false,
						redirect : true
					};
				});
			})
			.catch(err => {
				console.error(err);
			});
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to="/"/>;
		}
		else {
			if (this.state.isLoggedIn) {
				return (<button onClick={this.handleClick}> Loggout ? </button>);
			} else {
				return (
					<div> Not logged </div>
				);
			}
		}
	}
}
