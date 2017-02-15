import React, {Component} from 'react';
import { render }   from 'react-dom';
import ControlledTabs from './ControlledTabs.jsx';
import { Router, Route, Link, IndexLink, IndexRoute, hashHistory, browserHistory, withRouter } from 'react-router';
import Timer from './Timer.jsx';
import Dashboard from './Dashboard.jsx';
import { myConfig } from '../js/config.js';

export default class AnadirContenidos extends Component {
   	constructor(props) {
		super(props);
	    this.state = {
	      clientToken: localStorage.token,
	      datos: [],
	      changeTypeButton: true,
	      disabled: false
	    };
		this.sendFormData = this.sendFormData.bind(this);
	};
    sendFormData(e) {
        e.preventDefault();
        // Guardamos el formulario para el envío
        var formData = new FormData(document.getElementById('formTabs'));
        var tableTechnologies = document.getElementsByName('technologiesSelected');
        var arrayTableTechnologies = [];
        for (var i = 0; i < tableTechnologies.length; i++) {
            arrayTableTechnologies.push(tableTechnologies[i].value);
        }
        console.info('eeee'  + arrayTableTechnologies);

        formData.append("id_usuario", localStorage.idUsuario);
        formData.append("id_proveedor", localStorage.idProveedor);
        formData.append("id_sistema_evaluacion", 2);
        formData.append("id_tipo_contenido", 2);
        formData.append("tableTechnologies", arrayTableTechnologies)
        // envío de archivo zip y datos formulario
        fetch( myConfig.apiUrl + myConfig.puerto + myConfig.createCourse , {
            method: 'POST',
            headers: {
               	'Authorization': 'EnvioArchivo ' + this.state.clientToken
           },
            body: formData
        })
        .then(function (data) {
          console.log('Request succeeded with FILE and INPUT response', data);
        })
        .catch(function (error) {
          console.log('Request failed', error);
        });
    };

	render(){
		return(

				<div id="dashboard" className="dashboard col-lg-10 col-xs-12 anadirContenido">
					<Timer />
					<div className="row">
						<div className="col-lg-12">
							<div className="userBox">
								<span> AÑADIR CONTENIDO</span>
							</div>
						</div>
					</div>
					<div className="row">
						<ControlledTabs {...this.props}
										disabled={this.state.disabled}
										changeTypeButton= {this.state.changeTypeButton}
										sendFormData={this.sendFormData} />
					</div>
				</div>

		)
	}
}

class AnadirContenidosTable extends Component {
	render() {
		return(
			<div className="tusCursos col-lg-12 col-xs-12">
			<span className="title">Crear nuevo curso</span>
				<ul>
					<li className="titleRow">
						<ul>
							<li className="col-lg-2">Código Proyecto</li>
							<li className="col-lg-5">Nombre</li>
							<li className="col-lg-1">Idioma</li>
							<li className="col-lg-1">Tipo</li>
							<li className="col-lg-2">FechaPublicación</li>
							<li className="col-lg-1">Horas</li>
						</ul>
					</li>
				</ul>
			</div>
		)
	}
}



