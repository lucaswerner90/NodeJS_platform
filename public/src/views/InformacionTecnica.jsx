import React, {Component} from 'react';
import { render }   from 'react-dom';
import {FormGroup, ControlLabel, FormControl, HelpBlock, TextInput, Button} from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class InformacionTecnica extends Component {
	constructor(props) {
		super(props);
		this.state={
			contenidosList: [],
			datosCompatibilitiesTable: [],
			array: [2],
			id_punto_control: '2',
			id_tc: '6',
			disabled: false,
			objeto : [2,1],
			newObject: {}

		}
		this.changeHandler = this.changeHandler.bind(this);
	};
	componentWillMount() {
	};
	changeHandler(event){
		// alert(event.target.value)
		this.setState= {
			value: event.target.value
		}
		var myselect = document.querySelectorAll("table select");
		for (var i = 0; i < myselect.length; i++) {
			var colour = myselect[i].options[myselect[i].selectedIndex].className;
			myselect[i].className = ''
			myselect[i].classList.add('form-control');
			myselect[i].classList.add(colour);
		}
	};

	render() {
		if (this.props.disabled === true) {
			var my_arr = this.props.contenidosList[this.props.indexCourse].compatibilities_table;
			var newObject = {};
			var data = [];
			for (var i=0; i < my_arr.length; i++) {
				if(!newObject[my_arr[i].id_tc.toString()]){
					newObject[my_arr[i].id_tc.toString()] = {};
				}
				newObject[my_arr[i].id_tc.toString()][my_arr[i].id_punto_control]=my_arr[i].valor;
			};
			debugger;
			this.setState= {
				newObject: Object.keys(newObject)
			}
			console.info('data: '+ newObject);
			console.info('objeto: '+ typeof newObject + Object.keys(newObject));

		}
		return (
			<div id="dashboard" className="dashboard col-lg-12 col-xs-12 anadirContenido">
				<div className="row">
					<div className= "col-md-4 col-xs-12">
						<div className="row">
							<FormGroup controlId="estadoProyectoSelect" className="col-lg-6">
								<ControlLabel>Tecnología</ControlLabel>
								<FormControl
								componentClass="select"
								name="id_estado"
								placeholder="select"
								disabled={this.props.disabled}>
									{
										this.props.disabled == false ?
										this.props.datosTechnologies.map(function (states, index) {
											return (
												<option key={index} value={states.id_tecnologia}>{states.descripcion}</option>
												)
										})
										:
											this.props.datosTechnologies.map(function (states, index) {
												return (
													<option key={index} value={states.id_tecnologia}></option>
												)
											})
									}
								</FormControl>
							</FormGroup>
							<FormGroup controlId="estadoProyectoSelect" className="col-lg-6">
								<ControlLabel>Responsive</ControlLabel>
								<FormControl
								componentClass="select"
								name="id_estado"
								placeholder="select"
								disabled={this.props.disabled}>
									{
										this.props.disabled == false ?
										this.props.datosStates.map(function (states, index) {
											return (
												<option key={index} value={states.responsive}>{states.id_estado}</option>
												)
										})
										:
											this.props.datosStates.map(function (states, index) {
												return (
													<option key={index} value={states.responsive}>{states.id_estado}</option>
												)
											})
									}
								</FormControl>
							</FormGroup>
						</div>
						<div className="row">
							<div className= "col-xs-12">
								<FormGroup controlId="estadoProyectoSelect" >
									<ControlLabel>Tipo de desarrollo</ControlLabel>
									<FormControl
									componentClass="select"
									name="id_estado"
									placeholder="select"
									disabled={this.props.disabled}>
										{
											this.props.disabled == false ?
											this.props.datosTipoDesarrollo.map(function (states, index) {
												return (
													<option key={index} value={states.id_tipo_desarrollo}>{states.descripcion}</option>
													)
											})
											:
												this.props.datosTipoDesarrollo.map(function (states, index) {
													return (
														<option key={index} value={states.id_tipo_desarrollo}>{states.descripcion}</option>
													)
												})
										}
									</FormControl>
								</FormGroup>
							</div>
						</div>
						<div className="row">
							<div className= "col-xs-12">
								<FormGroup controlId="estadoProyectoSelect" >
									<ControlLabel>Sistema de Evaluación</ControlLabel>
									<FormControl
									componentClass="select"
									name="id_estado"
									placeholder="select"
									disabled={this.props.disabled}>
										{
											this.props.disabled == false ?
											this.props.datosEvaluationSystems.map(function (states, index) {
												return (
													<option key={index} value={states.id_sistema}>{states.descripcion}</option>
													)
											})
											:
												this.props.datosEvaluationSystems.map(function (states, index) {
													return (
														<option key={index} value={states.id_sistema}>{states.descripcion}</option>
													)
												})
										}
									</FormControl>
								</FormGroup>
							</div>
						</div>
					</div>
					<div className= "col-md-4 col-xs-12">
						<div className="row">
							<FormGroup controlId="formControlsSelectMultipleOrigen" className="col-lg-5 cajaOrigen">
								<ControlLabel>Servidor de Contenidos</ControlLabel>
								<FormControl componentClass="select" multiple disabled={this.props.disabled}>
								{
									this.props.datosTablaCompatibilidades.map(function (platforms, index) {
										return (
											<option key={index} value={platforms.id_tc}>{platforms.descripcion}</option>
											)
									})
								}
								</FormControl>
							</FormGroup>
							<div className="col-lg-2">
								<Button bsStyle="default" disabled={this.props.disabled} onClick={this.props.exportMultiSelect}>
									<i className="fa fa-angle-double-right" aria-hidden="true"></i>
								</Button>
								<Button bsStyle="default" disabled={this.props.disabled} onClick={this.props.returnMultiSelect}>
									<i className="fa fa-angle-double-left" aria-hidden="true"></i>
								</Button>
							</div>
							<FormGroup controlId="formControlsSelectMultipleDestino" className="col-lg-5 cajaDestino">
								<FormControl
								componentClass="select"
								name="servidorContenidos"
								multiple
								disabled={this.props.disabled}>


								</FormControl>
							</FormGroup>
						</div>
					</div>
					<div className= "col-md-4 col-xs-12">
						<div className="row">
							<FormGroup controlId="formInfoTecSelectMultipleOrigen" className="col-lg-5 cajaOrigen">
								<ControlLabel>Plataforma</ControlLabel>
								<FormControl componentClass="select" multiple disabled={this.props.disabled}>
								{
									this.props.datosPlatforms.map(function (platforms, index) {
										return (
											<option key={index} value={platforms.id_plataforma}>{platforms.descripcion}</option>
											)
									})
								}
								</FormControl>
							</FormGroup>
							<div className="col-lg-2">
								<Button bsStyle="default" disabled={this.props.disabled} onClick={this.props.exportMultiSelect}>
									<i className="fa fa-angle-double-right" aria-hidden="true"></i>
								</Button>
								<Button bsStyle="default" disabled={this.props.disabled} onClick={this.props.returnMultiSelect}>
									<i className="fa fa-angle-double-left" aria-hidden="true"></i>
								</Button>
							</div>
							<FormGroup controlId="formInfoTecSelectMultipleDestino" className="col-lg-5 cajaDestino">
								<FormControl
								componentClass="select"
								name="plataforma"
								multiple
								disabled={this.props.disabled}>
								</FormControl>
							</FormGroup>
						</div>
					</div>
				</div>

				<ControlLabel>Tabla de Validaciones</ControlLabel>
				<table>
					<thead>
						<tr>
							<th className="col-md-1"></th>
							{
								this.props.datosPuntosControl.map(function (platforms, index) {
									return (
										<th key={index} className="col-md-2"  value={platforms.id_punto_control}>{platforms.acortado}
											<button type="button"
											className="btn btn-secondary"
											data-toggle="tooltip"
											data-placement="top"
											title=""
											data-original-title="{platforms.descripcion}">
											?
											</button>
										</th>
									)
								})
							}
						</tr>
					</thead>
					<tbody>
						{
							this.props.disabled == false ?
							this.props.technologiesSelected.map(function (platforms_2, index_2) {
								return (

									<tr>
										<td key={index_2} value={platforms_2.value}>{platforms_2.descripcion}</td>
										{

											this.props.datosPuntosControl.map(function (platforms, indexPuntos) {
												return (

													<td key={this.props.indexPuntos}  value={this.props.id_punto_control}>
														<FormGroup className="compatibilitiesSelect" className="col-lg-12">
															<FormControl
															componentClass="select"
															name="technologiesSelected"
															placeholder="select"

															onChange={this.changeHandler}
															>
															<option key= '0' className="default" value="0"> - </option>
															{
																this.props.datosCompatibilitiesTable.map(function (elem,indexComp) {
																	return (
																		<DatosCompatibilitiesCell
																		key={indexComp}
																		value={elem.id_valor}
																		descripcion={elem.descripcion}
																		id_punto_control={platforms.id_punto_control}
																		id_tc={platforms_2.value}/>
																		);
																},this)
															}
															</FormControl>
														</FormGroup>
													</td>

													)
											}, this)
										}
									</tr>
								)
							},this)
							:
							//mapea el número de filas
							Object.keys(newObject).map(function(elemTabla, index ) {
								return (
									<tr>
									<td key={index} value={elemTabla.id_tc}>{elemTabla.id_tc}</td>
									{
										// mapeo de número de columnas
										this.props.datosPuntosControl.map(function (platforms, indexPuntos  ) {
											return(
												<td key={indexPuntos} >
													<FormGroup className="compatibilitiesSelect" className="col-lg-12">
													<FormControl
													componentClass="select"
													name="technologiesSelected"
													placeholder="select"
													onChange={this.changeHandler}
													>
													{
														this.props.contenidosList[this.props.indexCourse].compatibilities_table.map(function(elem, indexGeneral ) {

														if(platforms.id_punto_control === elem.id_punto_control){
															debugger;
															return(
																<DatosCompatibilitiesCell
																key={indexGeneral}
																value={elem.valor}
																descripcion={platforms.descripcion}
																id_punto_control={elem.id_punto_control}
																id_tc={elem.id_tc}/>
																)

														} else {
															return(
																<option key= '0' className="default" value="0"> - </option>
																)
														}
														},this)
													}
													</FormControl>
													</FormGroup>
												</td>
											)
										}, this)
									}
									</tr>
								)
							},this)

						}
					</tbody>
				</table>
			</div>
		);
	}
}


class DatosCompatibilitiesCell extends Component {
	constructor(props){
		super(props);
	};
	render(){
		return(
			<option key={this.props.indexComp}
				value={JSON.stringify({id_tc:this.props.id_tc,id_punto_control: this.props.id_punto_control, id_valor: this.props.value})}
				className={'claseSelected'+this.props.value}
			>
				{this.props.descripcion}
			</option>
		)
	}
}
