import React, {Component} from 'react';
import { render }   from 'react-dom';
import {FormGroup, ControlLabel, FormControl, HelpBlock, TextInput, Button} from 'react-bootstrap';
import Timer from './Timer.jsx';
import MisContenidosTable from './MisContenidosTable.jsx';
import ControlledTabs from './ControlledTabs.jsx';
import { myConfig } from '../js/config.js';

export default class Busqueda extends Component {
	constructor(props) {
		super(props);
		this.state={
			showComponent: false,
			contenidosList: [],
			clientToken: localStorage.token,
			value: '',
			index: '',
			query: '',
			filteredData: undefined,
			titulo: ''
		}
		this._updateComponent = this._updateComponent.bind(this);
		this._doSearch = this._doSearch.bind(this);
	};
	componentWillMount() {
        fetch(myConfig.apiUrl + myConfig.puerto + myConfig.getAllContenidos + localStorage.idProveedor , {
            method: 'GET',
            headers: {
                'Authorization': 'DatosBBDDCourseGenericInfo ' + this.state.clientToken
            }
        }).then((response) =>{
            return response.json().then( (datos) => {
                this.setState({
                    contenidosList: datos
                });
                // console.log('MisContenidos json: ' + JSON.stringify(datos));
                console.log('Request succeeded with Load contenidos response', datos);
            })
        }).catch((error)  => {
            console.log('Response failed', error);
        });
	};
	_updateComponent(index) {
	    this.setState({
	      showComponent: true,
	      index: index
	    });
	};
	_doSearch(e){
		console.log(e.target.value)
		// e.preventDefault();
		var titulo  = document.getElementById('titulo').value;
		console.info('titulo: ' + titulo);
		console.info('idProveedor: ' + localStorage.idProveedor);
        fetch(myConfig.apiUrl + myConfig.puerto + myConfig.searchURL , {
            method: 'POST',
            headers: {
                'Authorization': 'DatosBBDDCourseGenericInfo ' + this.state.clientToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
			body: JSON.stringify({
				id_proveedor: localStorage.idProveedor,
				titulo: titulo
			})
        }).then((response) =>{
            return response.json().then( (datos) => {
                this.setState({
                    contenidosList: datos
                });
                console.log('searchCodigo json: ' + JSON.stringify(datos));
                console.log('Request succeeded with SEARCH contenidos response', datos);
            })
     	}).catch(function (error) {
          	console.log('Request failed', error);
        });
    };
	componentDidMount() {

	};
	render() {
        let idiomaProyecto = [
	        {
	            id: 1,
	            idioma: 'es_ES'
	        },
	        {
	            id: 2,
	            idioma: 'pt_BR'
	        }
        ];
        let idiomaProyectos = idiomaProyecto.map(function ( message){
            return (
                <option key={message.id} value={message.idioma}>{message.idioma}</option>
            )
        });
        let searchCodigo = document.getElementById('searchCodigo');
		return(
			<div id="dashboard" className="dashboard col-lg-10 col-xs-12 anadirContenido buscador">
				<Timer />
				<div className="row">
					<div className="col-lg-12">
						<div className="userBox">
							<span> BUSCADOR DE CURSOS</span>
						</div>
					</div>
				</div>
				<form method="POST" encType="multipart/form-data" id="formTabs">
					<div className="row">
						<div className="col-md-3">
							<FormGroup>
								<ControlLabel>Título</ControlLabel>
								<FormControl
								name="titulo"
								id="titulo"
								disabled={this.props.disabled}
								type="text"
								onKeyUp={this._doSearch}

								/>
							</FormGroup>
						</div>
						<div className="col-md-3">
							<FormGroup>
								<ControlLabel>Idioma</ControlLabel>
								<FormControl
		                        componentClass="select"
		                        name="idioma"
		                        placeholder="select"
		                        disabled={this.props.disabled}
		                        value={ this.props.disabled == true ? this.props.contenidosList[this.props.indexCourse].codigo_proyecto : undefined }
								>
								{idiomaProyectos}
								</FormControl>
							</FormGroup>
						</div>
						<div className="col-md-3">
							<FormGroup>
								<ControlLabel>Área</ControlLabel>
								<FormControl
								name="nombre"
								disabled={this.props.disabled}
								type="text"
								onChange={this.handleChange}
								/>
							</FormGroup>
						</div>
					</div>
					<div className="row">
						<div className="col-md-3">
							<FormGroup>
								<ControlLabel>Código proyecto</ControlLabel>
								<FormControl
								id="searchCodigo"
								name="nombre"
								disabled={this.props.disabled}
								type="text"
								onKeyPress={this._doSearch}
								/>
							</FormGroup>
						</div>
						<div className="col-md-3">
							<FormGroup>
								<ControlLabel>Temática</ControlLabel>
								<FormControl
								name="nombre"
								disabled={this.props.disabled}
								type="text"

								/>
							</FormGroup>
						</div>
						<div className="col-md-3">
							<FormGroup>
								<ControlLabel>Subárea</ControlLabel>
								<FormControl
								name="nombre"
								disabled={this.props.disabled}
								type="text"

								/>
							</FormGroup>
						</div>
						<div className="col-md-3">

						</div>
					</div>
				</form>
				<div className="row">
					<div className="container-fluid">
						{this.state.showComponent ?
							<ControlledTabs disabled={!this.state.disabled}
							changeTypeButton={this.state.changeTypeButton}
							_changeDisabled={this._changeDisabled}
							_updateComponent={this._updateComponent}
							_prevComponent={this._prevComponent}
							datos={this.state.datos}
							contenidosList={this.state.contenidosList}
							indexCourse={this.state.index}
							sendModifyCourse={this.sendModifyCourse}

							/>
							: <MisContenidosTable contenidosList={this.state.contenidosList}
							_updateComponent={this._updateComponent}
							indexCourse={this.state.index}
							/>
						}
					</div>
				</div>
			</div>
		)
	}
}
