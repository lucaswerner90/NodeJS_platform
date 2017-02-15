import React, {Component} from 'react';
import { render }   from 'react-dom';
import auth from './../auth.js';
import LoginPage from './LoginPage.jsx';

export default class Logout extends Component{
	constructor(props){
		super(props);

		this._logout = this._logout.bind(this);
	}
	componentDidMount(){
		this._logout();
	};
	componentWillMount() {
	};
	_logout() {
		delete localStorage.token;
		delete localStorage.userName;
		delete localStorage.userApellido;
		delete localStorage.email;
		delete localStorage.fechaAlta;
		delete localStorage.idProveedor;
		delete localStorage.idUsuario;
		window.location.replace('/login');
		this.onChange(false)
	};
	onChange() {}
	render() {
		return(
			<LoginPage />
		)
	}
}
