import React, {Component} from 'react';
import { render }   from 'react-dom';
import {FormGroup, ControlLabel, FormControl, HelpBlock, TextInput, Button} from 'react-bootstrap';

export default class FormularioDatosGenerales extends Component {
	constructor(props, { technologiesSel }) {
		super(props);
		this.state = {
			value: '',
			disabled: false,
			contenidosList: [],
			titulo: '',
			codigo_proyecto: '',
			duracion: '',
			descripcion: '',
			idioma: '',
			technologiesSel: technologiesSel
		};
		this.handleChange = this.handleChange.bind(this);
		this.exportMultiSelect = this.exportMultiSelect.bind(this);
		this.returnMultiSelect = this.returnMultiSelect.bind(this);
		this.onTechnologiesChanged = this.onTechnologiesChanged.bind(this);
		this.InitDragAndDrop = this.InitDragAndDrop.bind(this);
		this._FileDragHover = this._FileDragHover.bind(this);
		this._FileSelectHandler = this._FileSelectHandler.bind(this);
	};
	componentWillMount() {
		if (this.props.disabled == false) {
			this.setState={
				value: ""
			}
		}
		if(this.props.disabled == true){
			// this.setState={
			// 	titulo : this.props.contenidosList[this.props.indexCourse].titulo,
			// 	codigo_proyecto : this.props.contenidosList[this.props.indexCourse].codigo_proyecto,
			// 	duracion : this.props.contenidosList[this.props.indexCourse].duracion,
			// 	descripcion : this.props.contenidosList[this.props.indexCourse].descripcion,
			// 	idioma: this.props.contenidosList[this.props.indexCourse].idiomas
			// }
		} else {
			null
		}
	};
    exportMultiSelect() {
        var obj=document.getElementById('formControlsSelectMultipleOrigen');
        if (obj.selectedIndex==-1) return;
        var valor=obj.value;
        var txt=obj.options[obj.selectedIndex].text;
        obj.options[obj.selectedIndex]=null;
        var obj2=document.getElementById('formControlsSelectMultipleDestino');
        var opc = new Option(txt,valor);
        eval(obj2.options[obj2.options.length]=opc);
        this.onTechnologiesChanged();
    };
    returnMultiSelect() {
        var obj=document.getElementById('formControlsSelectMultipleDestino');
        if (obj.selectedIndex==-1) return;
        var valor=obj.value;
        var txt=obj.options[obj.selectedIndex].text;
        obj.options[obj.selectedIndex]=null;
        var obj2=document.getElementById('formControlsSelectMultipleOrigen');
        var opc = new Option(txt,valor);
        eval(obj2.options[obj2.options.length]=opc);
        this.onTechnologiesChanged();
    };
    onTechnologiesChanged() {
        let newState = document.getElementById('formControlsSelectMultipleDestino');
        let newStateSelected = [];
        for (var i = 0; i < newState.length; i++) {
            newStateSelected.push({key:newState.options[i].value, value: newState.options[i].value, descripcion: newState.options[i].innerHTML});
        }
        console.log('newStateSelected: ' + newStateSelected[0].value + newStateSelected[0].descripcion);
        this.setState ={ technologiesSel: newStateSelected }; // we update our state
        this.props.callbackParent(newStateSelected); // we notify our parent
    };
	componentDidMount() {
		this.InitDragAndDrop();
	};

	handleChange(e) {
		this.setState={
			value: e.target.value
		}
	};
	_$id(id) {
		return document.getElementById(id);
	}
		//  getElementsByClassName
	_$clase(clase){
		return document.getElementsByClassName(clase);
	}
		// output information
	_Output (msg) {
		var m = this._$id("messages");
		m.innerHTML = msg + m.innerHTML;
	}
		// file drag hover
	_FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	};
		// file selection
	_FileSelectHandler(e) {
		// cancel event and hover styling
		this._FileDragHover(e);
		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;
		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			this._ParseFile(f);
		}
	}
		// output file information
	_ParseFile (file) {
		this._Output(
			"<p>Archivo: <strong>" + file.name +
			"</strong> Tipo: <strong>" + file.type +
			"</strong> Tamaño: <strong>" + file.size +
			"</strong> bytes</p>"
			);
	}
	InitDragAndDrop() {
		var fileselect = this._$id("fileselectId"),
		filedrag = this._$id("filedrag"),
		submitbutton = this._$id("submitbutton");
		console.info('entra en draganddrop');
		if(fileselect){
			// file select
			fileselect.addEventListener("change", this._FileSelectHandler, false);
		} else {
			return;
		}

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			filedrag.addEventListener("dragover", this._FileDragHover, false);
			filedrag.addEventListener("dragleave", this._FileDragHover, false);
			filedrag.addEventListener("drop", this._FileSelectHandler, false);
			filedrag.style.display = "block";

			// remove submit button
			// submitbutton.style.display = "none";
		}
	}

	render(){
		return (
			<div>
				<FormGroup>
					<ControlLabel>Título del curso</ControlLabel>
					<FormControl
					name="titulo"
					placeholder="Título del curso"
					disabled={this.props.disabled}
					type="text"
					onChange={this.handleChange}
					value= { this.props.disabled == true ? this.props.contenidosList[this.props.indexCourse].titulo : undefined }
					/>

				</FormGroup>
				<div className="row">
					<FormGroup className="col-lg-2">
						<ControlLabel>Código Proyecto</ControlLabel>
						<FormControl
						componentClass="select"
						name="id_proyecto"
						placeholder="select"
						disabled={this.props.disabled}
						value={ this.props.disabled == true ? this.props.contenidosList[this.props.indexCourse].codigo_proyecto : undefined }
						>
							{
								this.props.disabled == false ?
								this.props.datosProyectos.map(function (states, index) {
									return (
										<option key={index} value={states.id_proyecto}>{states.codigo_proyecto}</option>
										)
								})
								:
								this.props.datosProyectos.map(function (platforms, indexProyectos) {
									while (this.props.contenidosList[this.props.indexCourse].codigo_proyecto === platforms.codigo_proyecto) {
										return (
											<option key={indexProyectos} value={this.props.contenidosList[this.props.indexCourse].codigo_proyecto}>{platforms.codigo_proyecto}</option>
											)
									}
								},this)
							}
						</FormControl>
					</FormGroup>
					<FormGroup controlId="estadoProyectoSelect" className="col-lg-2">
						<ControlLabel>Estado</ControlLabel>
						<FormControl
						componentClass="select"
						name="id_estado"
						placeholder="select"
						disabled={this.props.disabled}>
							{
								this.props.disabled == false ?
								this.props.datosStates.map(function (states, index) {
									return (
										<option key={index} value={states.id_estado}>{states.descripcion}</option>
										)
								})
								:

								this.props.datosStates.map(function (platforms, indexStates) {
									while (this.props.contenidosList[this.props.indexCourse].id_estado === platforms.id_estado) {
										return (
											<option key={indexStates} value={this.props.contenidosList[this.props.indexCourse].id_estado}>{platforms.descripcion}</option>
											)
									}
								},this)
							}
						</FormControl>
					</FormGroup>
					<FormGroup controlId="idiomaProyectoSelect" className="col-lg-2">
						<ControlLabel>Idioma</ControlLabel>
						<FormControl
						componentClass="select"
						name="idioma"
						placeholder="select"
						disabled={this.props.disabled}>
						   {
							this.props.disabled == false ?
							this.props.datosIdiomas.map(function (platforms, index) {
								return (
									<option key={index} value={platforms.id_pais}>{platforms.idioma}</option>
									)
							})
							:
							this.props.datosIdiomas.map(function (platforms, indexIdioma) {
							  		while (this.props.contenidosList[this.props.indexCourse].id_pais === platforms.id_pais) {
										return (
											<option key={indexIdioma} value={this.props.contenidosList[this.props.indexCourse].id_pais}>{platforms.idioma}</option>
										)
							  		}
							},this)
						   }
						</FormControl>
					</FormGroup>
					<FormGroup controlId="proveedorProyectoSelect" className="col-lg-2">
						<ControlLabel>Proveedor</ControlLabel>
						<FormControl
						componentClass="select"
						name="id_proveedor"
						placeholder="select"
						disabled={this.props.disabled}>

						</FormControl>
					</FormGroup>
					<FormGroup controlId="tiempoProyectoSelect" className="col-lg-2">
						<ControlLabel>Tiempo</ControlLabel>
						<FormControl
						  type="number"
						  name="duracion"
						  value={this.state.value}
						  placeholder="0"
						  disabled={this.props.disabled}
						  value={ this.props.disabled == true ? this.props.contenidosList[this.props.indexCourse].duracion : undefined }
						/>
					</FormGroup>
					<FormGroup controlId="tipoProyectoSelect" className="col-lg-2">
						<ControlLabel>Tipo</ControlLabel>
						<FormControl
						componentClass="select"
						name="id_tipo_contenido"
						placeholder="select"
						disabled={this.props.disabled}>

						   {
							this.props.disabled == false ?
							this.props.datosContentTypes.map(function (platforms, index) {
								return (
									<option key={index} value={platforms.id_tipo_contenido}>{platforms.descripcion}</option>
									)
							})
							:
							this.props.datosContentTypes.map(function (platforms, indexContentTypes) {
							  		while (this.props.contenidosList[this.props.indexCourse].id_tipo_contenido === platforms.id_tipo_contenido) {
										return (
											<option key={indexContentTypes} value={this.props.contenidosList[this.props.indexCourse].id_tipo_contenido}>{platforms.descripcion}</option>
										)
							  		}
							},this)
						   }
						</FormControl>
					</FormGroup>
				</div>
				<div className="row">
					<FormGroup controlId="textareaProyectoSelect"  className="col-lg-12">
						<ControlLabel>Descripción de los contenidos</ControlLabel>
						<FormControl
						componentClass="textarea"
						name="descripcion"
						placeholder="Lorem ipsum dolor sit amet..."
						disabled={this.props.disabled}
						value={ this.props.disabled == true ? this.props.contenidosList[this.props.indexCourse].descripcion : undefined }
						/>
					</FormGroup>
				</div>
				<div className="row">
					<FormGroup controlId="formControlsSelectMultipleOrigen" className="col-lg-2 cajaOrigen">
						<ControlLabel>Compatiblidad</ControlLabel>
						<FormControl componentClass="select" multiple disabled={this.props.disabled}>
							{
								this.props.disabled == false ?
								this.props.datosTablaCompatibilidades.map(function (platforms, index) {
									return (
										<option key={index} value={platforms.id_tc}>{platforms.descripcion}</option>
										)
								})
								:
								this.props.datosTablaCompatibilidades.map(function (platforms, indexTablaCompatibilidades) {
									this.props.contenidosList[this.props.indexCourse].compatibilities_table.map(function (compatibilitie, index){
										while (this.props.contenidosList[this.props.indexCourse].compatibilities_table.id_tc === platforms.id_tc) {
											return (
												<option key={indexTablaCompatibilidades}
													value={this.props.contenidosList[this.props.indexCourse].compatibilities_table.id_tc}>
													{platforms.descripcion}
												</option>
												)
										}
									},this)
								},this)
							}
						</FormControl>
					</FormGroup>
					<div className="col-lg-1">
						<Button bsStyle="default" disabled={this.props.disabled} onClick={this.exportMultiSelect}> <i className="fa fa-angle-double-right" aria-hidden="true"></i></Button>
						<Button bsStyle="default" disabled={this.props.disabled} onClick={this.returnMultiSelect}> <i className="fa fa-angle-double-left" aria-hidden="true"></i>  </Button>
					</div>
					<FormGroup controlId="formControlsSelectMultipleDestino" className="col-lg-2 cajaDestino">
						<FormControl
						componentClass="select"
						name="compatibilidad"
						multiple
						value={ this.props.disabled == true ? this.props.contenidosList[this.props.indexCourse].compatibilities_table : undefined }
						disabled={this.props.disabled}>
						{
							this.props.disabled == true ?
							this.props.contenidosList[this.props.indexCourse].compatibilities_table.map(function (states, index) {
								return (
									<option key={index} value={states.id_tc}>{states.valor}</option>
									)
							})
							: null
						}

						</FormControl>
					</FormGroup>
					<FormGroup className="col-lg-7" >
						<ControlLabel>Subir archivo comprimido (ZIP)</ControlLabel>
						<FormControl
						type="file"
						name="ruta_zip"
						ref="fileselectRef"
						id="fileselectId"
						disabled={this.props.disabled}
						/>
						<div id="filedrag">
							<p>Suelte el fichero aquí</p>
							<p>o</p>
							<p>Pincha para seleccionar desde el ordenador</p>
						</div>
						<div id="messages"></div>
					</FormGroup>
				</div>
			</div>
		)
	}
}

FormularioDatosGenerales.defaultProps = {
		disabled: false

};
