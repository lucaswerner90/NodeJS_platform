import React, { Component } from 'react';
import { render } from 'react-dom';
import {FormGroup, ControlLabel, FormControl, HelpBlock, TextInput, Button} from 'react-bootstrap';

export default class Soporte extends Component {
    constructor(props) {
        super(props);
    };
    componentWillMount() {

    };

    render() {
        return (
        	<div className="page-content-wrapper">
	        	<div id="dashboard" className="perfil dashboard col-lg-10 col-xs-12">
	        		<GMap />
	    			<div className="row">
	    				<div className="col-md-6 faqsContainer">
	    					<h2>
	    						NEED TO KNOW MORE?
	    					</h2>
	    					<p>
	    						Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
	    						Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
	    						Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
	    						Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a,
	    						venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus
	    						elementum semper nisi. Aenean vulputate eleifend tellus.
	    					</p>
	    				</div>
	    				<div className="col-md-5">
		            	<h3>Envíanos tu consulta</h3>
		            	<form method="POST" encType="multipart/form-data" id="formInfoPersonal">
			                <FormGroup>
			                    <ControlLabel>Nombre</ControlLabel>
			                    <FormControl
			                    name="nombre"
			                    placeholder={this.props.name}
			                    type="text"
			                    onChange={this.handleChange}
			                    value= {this.props.name}
			                    />
			                </FormGroup>
			                <FormGroup>
			                    <ControlLabel>Email</ControlLabel>
			                    <FormControl
			                    name="email"
			                    placeholder={this.props.email}
			                    type="email"
			                    onChange={this.handleChange}
			                    value= {this.props.email}
			                    />
			                </FormGroup>
			                <FormGroup>
			                    <ControlLabel>Teléfono</ControlLabel>
			                    <FormControl
			                    name="apellidos"
			                    placeholder={this.props.apellidos}
			                    type="text"
			                    onChange={this.handleChange}
			                    value= {this.props.apellidos}
			                    />
			                </FormGroup>
			                <FormGroup>
			                    <ControlLabel>Descripcion</ControlLabel>
			                    <FormControl
			                    componentClass="textarea"
			                    name="apellidos"
			                    placeholder={this.props.apellidos}
			                    type="textarea"
			                    onChange={this.handleChange}
			                    value= {this.props.apellidos}
			                    />
			                </FormGroup>
			                <div className="row">
				                <Button disabled={this.props.disabled} type="submit" onClick={this.props.sendFormContacto} >
				                	Enviar
				                <i className="fa fa-upload" aria-hidden="true"></i>
				                </Button>
			                </div>
			            </form>
	    				</div>
	    			</div>
	           	</div>
	        </div>
        )
    }
}


class GMap extends Component {
    constructor(props) {
    	super(props);
        this.state= {
            initialZoom: 15,
            mapCenterLat: 40.5155389,
            mapCenterLng: -3.6627707999999757,
            map: ''
        };
    };
    componentDidMount() {
	    var mapElement = document.getElementById('map');

	    this.map = new google.maps.Map(mapElement, {
	      zoom: this.state.initialZoom,
	      center: {
	        lat: this.state.mapCenterLat,
	        lng: this.state.mapCenterLng
	      }
	    });

	    this.marker = new google.maps.Marker({
	      map: this.map,
	      position: {
	        lat: this.state.mapCenterLat,
	        lng: this.state.mapCenterLng
	      }
	    });

	    this.geocoder = new google.maps.Geocoder();
	};
    render(){
    	return(
			<div className="c-content-contact-1">
    			<div className="row" data-auto-height=".c-height" className="leyendaMap">
    				<div className="col-lg-8 col-md-6 c-desktop"></div>
    				<div className="col-lg-4 col-md-6 leyenda">
    					<div className="c-body">
    						<div className="c-section">
    							<h3>TELEFÓNICA EDUCACIÓN DIGITAL</h3>
    						</div>
    						<div className="c-section">
    							<div className="c-content-label uppercase bg-blue">Dirección</div>
								<p>C/ Ronda de la Comunicación, s/n
								<br/>Edificio Oeste 1 - Planta 4
								<br/>28050 Madrid</p>
							</div>
							<div className="c-section">
								<div className="c-content-label uppercase bg-blue">Contacto</div>
								<p>
									<strong>T</strong> +34 91 483 01 87
								</p>
							</div>
							<div className="c-section">
								<div className="c-content-label uppercase bg-blue">Social</div>
								<br/>
								<ul className="c-content-iconlist-1 ">
									<li>
										<a href="#">
											<i className="fa fa-twitter"></i>
										</a>
									</li>
									<li>
										<a href="#">
											<i className="fa fa-facebook"></i>
										</a>
									</li>
									<li>
										<a href="#">
											<i className="fa fa-youtube-play"></i>
										</a>
									</li>
									<li>
										<a href="#">
											<i className="fa fa-linkedin"></i>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
    			</div>
				<div id="map" className="row map"></div>
			</div>
    	)
    }
};
