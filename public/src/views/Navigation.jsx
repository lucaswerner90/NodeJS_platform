import React, {Component} from 'react';
import { render } 	from 'react-dom';
import HeaderPage from './HeaderPage.jsx';
import auth from './../auth.js'
import { Router, Route, Link, IndexLink, IndexRoute, hashHistory, browserHistory, withRouter } from 'react-router';
// import { AuthorizedComponent, RoleAwareComponent } from 'react-router-role-authorization';

export default class Navigation extends Component{
	constructor(props){
		super(props);
		this.buttonMenu = this.buttonMenu.bind(this);
	};
	buttonMenu (e){
		e.preventDefault();
		let desplegable = document.getElementById('desplegable');
        if (!desplegable.style.display || desplegable.style.display == "none" ){
            desplegable.style.display = "block";
        } else {
            desplegable.style.display = "none";
        }
	}

	render() {
		return(
			<ul>
				<IndexLink activeClassName="active" to='/contenidos'><i className="icon-home"></i><span>Inicio</span></IndexLink>
				<IndexLink activeClassName="active" className="desplegableParent" id="desplegableParent" onClick={this.buttonMenu} to='/anadir-contenido'><i className="icon-graduation"></i><span>Contenidos</span></IndexLink>
				<ul className="desplegable" id="desplegable">
					<IndexLink activeClassName="active"  to='/anadir-contenido'><span>Añadir Contenido</span></IndexLink>
					<IndexLink activeClassName="active"  to='/busqueda'><span>Búsqueda</span></IndexLink>
				</ul>
				<IndexLink activeClassName="active"  to='/perfil'><i className="icon-user"></i><span>Perfil</span></IndexLink>
				<IndexLink activeClassName="active"  to='/soporte'><i className="icon-support"></i><span>Soporte</span></IndexLink>
			</ul>
		)
	}
				/*<IndexLink activeClassName="active"  to='/logout'><i className="fa fa-sign-out" aria-hidden="true"></i><span>Salir</span></IndexLink>*/
				// <IndexLink activeClassName="active"  to='/informes'><i className="icon-notebook"></i><span>Informes</span></IndexLink>
				// <IndexLink activeClassName="active"  to='/proveedores'><i className="icon-briefcase"></i><span>Proveedores</span></IndexLink>
}