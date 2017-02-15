import React, {Component} from 'react';
import { render } 	from 'react-dom';
import HeaderPage from './HeaderPage.jsx';
import Navigation from './Navigation.jsx';
import { Router, Route, Link, IndexLink, IndexRoute, hashHistory, browserHistory, withRouter } from 'react-router';
import Breadcrumbs from 'react-breadcrumbs';

export default class Dashboard extends Component{

  	render(props) {
    	return (
			<div className="dashboardContainer">
		  		<HeaderPage userName={this.props.userName} userApellido={this.props.userApellido} />
		  		<Container />
			</div>
      	)
	}
}


const Container = (props) =><aside id="pageSidebar" className="page-sidebar col-lg-2 col-md-6 col-sd-12 col-xs-12 open"> <Navigation />  {props.children}	</aside>

