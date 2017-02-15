import React, {Component} from 'react';
import { render }   from 'react-dom';
import ControlledTabs from './ControlledTabs.jsx';
import Timer from './Timer.jsx';
import Dashboard from './Dashboard.jsx';
import MisContenidosTable from './MisContenidosTable.jsx';
import { myConfig } from '../js/config.js';
import {FormGroup, ControlLabel, FormControl, HelpBlock, TextInput, Input, Button} from 'react-bootstrap';


export default class MisContenidos extends Component {
   	constructor(props) {
		super(props);
	    this.state = {
	      showComponent: false,
	      disabled: false,
	      user: 'Usuario',
	      clientToken: localStorage.token,
	      contenidosList: [],
	      index: '',
	      time: 0,
	      changeTypeButton: true,
	      pageCount: 6,
	      pageIndex: 0,
	      limit: 10,
	      perPage: 10,
	      offset: 0,
	      data:[],
	      loading: true

	    };
		this._updateComponent = this._updateComponent.bind(this);
		this._changeDisabled = this._changeDisabled.bind(this);
		this._prevComponent = this._prevComponent.bind(this);
		this.sendModifyCourse = this.sendModifyCourse.bind(this);
		this.loadContenidosFromServer = this.loadContenidosFromServer.bind(this);
		this.handlePageClick = this.handlePageClick.bind(this);
	};
	componentWillMount() {
		this.loadContenidosFromServer();
	};
	loadContenidosFromServer(){
        fetch( myConfig.apiUrl + myConfig.puerto +  myConfig.getAllContenidos, {
            method: 'POST',
            headers: {
                'Authorization': 'DatosBBDDCourseGenericInfo ' + this.state.clientToken,
            	'Accept': 'application/json',
            	'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            	id_usuario: localStorage.idUsuario
            }),

            data: {limit: this.state.perPage, offset: this.state.offset}
        }).then((response) =>{
            return response.json().then( (datos) => {
                this.setState({
                	contenidosList: datos,
                    data: datos,
                    limit: this.state.perPage,
                    offset: this.state.offset,
                    pageCount: Math.ceil(datos.length  / this.state.limit),
                    loading: false
                });

                console.log('pageCount: ' + this.state.pageCount);
                console.log('MisContenidos json: ' + JSON.stringify(datos));
                console.log('Request succeeded with Load contenidos response', datos);
        		this.sumarHoras(this.state.contenidosList);

            })
        }).catch((error)  => {
            console.log('Response failed', error);
        });

	};
  	handlePageClick(contenidosList) {
	    let selected = contenidosList.selected;
	    let offset = Math.ceil(selected * this.state.perPage);

	    this.setState({offset: offset}, () => {
	      this.loadContenidosFromServer();
	    });
	};
    _changeDisabled() {
        this.setState({
        	disabled: true,
        	changeTypeButton: false
        })
    };
	_prevComponent() {
		this.setState({showComponent: false, disabled: false})
	};

	_updateComponent(index) {
	    this.setState({
	      showComponent: true,
	      index: index
	    });
	};
	sumarHoras(array){
		console.log("tamaño de contenidoList: " + array.length);
		var time = 0;
		for (var i = 0; i < array.length; i++) {
			time += array[i].duracion;
		}
		return (
			this.setState({
				time: time
			})
		)
	};

    sendModifyCourse(e) {
        e.preventDefault();
        // Guardamos el formulario para el envío
        var formData = new FormData(document.getElementById('formTabs'));
        formData.append("id_proveedor", localStorage.idProveedor);
        formData.append("id_sistema_evaluacion", 2);
        formData.append("id_contenido", this.state.contenidosList[this.state.index].id_contenido);

        // envío de archivo zip y datos formulario modificados
        fetch( myConfig.apiUrl + myConfig.puerto + myConfig.modifyCourse , {
            method: 'POST',
            headers: {
               	'Authorization': 'EnvioArchivo ' + this.state.clientToken
           },
            body: formData
        })
        .then((data)=> {
          console.log('Request succeeded with FILE and INPUT response', data);
          this.setState({showComponent: false, disabled: false})
           window.location.replace('/contenidos');
        })
        .catch(function (error) {
          console.log('Request failed', error);
        });
    };
	render(){
		return(

				<div className="page-content-wrapper">
						{
							this.state.loading === true ?

								<div className="loading"><img src="images/loading.gif" /> </div>

							: null
						}
					<div id="dashboard" className="dashboard col-lg-10 col-xs-12 anadirContenido">
						<Timer />
						<div className="row">
							<div className="col-lg-6">
								<div className="userBox">
									<span> {this.state.showComponent ? this.state.contenidosList[this.state.index].titulo : localStorage.userName + ' ' + localStorage.userApellido}</span>
								</div>
							</div>
							<div className="col-lg-3">
								<div className="cursosBox">
									<div className="visual">
										<i className="fa fa-comments"></i>
									</div>
									<div className="details">
		                                <div className="number">
		                                    <span data-counter="counterup" >{this.state.contenidosList.length}</span>
		                                </div>
		                                <div className="desc"> contenidos </div>
		                            </div>
								</div>
							</div>
							<div className=" col-lg-3">
								<div className="horasBox">
									<div className="visual">
										<i className="fa fa-bar-chart-o"></i>
									</div>
									<div className="details">
		                                <div className="number">
		                                    <span data-counter="counterup" >{this.state.time}</span>
		                                </div>
		                                <div className="desc"> horas formativas </div>
		                            </div>
								</div>
							</div>
						</div>
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
	        						: <MisContenidosTable
	        						{...this.props}
	        						handlePageClick={this.handlePageClick}
	        						contenidosList={this.state.contenidosList}
	        						_updateComponent={this._updateComponent}
	        						indexCourse={this.state.index}
	        						/>
	        					}
					        </div>
						</div>
					</div>
				</div>
		)
	}
}




