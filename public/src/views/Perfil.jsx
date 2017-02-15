import React, {Component} from 'react';
import { render }   from 'react-dom';
import {FormGroup, ControlLabel, FormControl, HelpBlock, TextInput, Button} from 'react-bootstrap';
import { myConfig } from '../js/config.js';


export default class Perfil extends Component {
	constructor(props) {
		super(props);
        this.state= {
            disabled: false,
            clientToken: localStorage.token
        }
		this.sendFormDataInfoPersonal = this.sendFormDataInfoPersonal.bind(this);
		this.sendFormDataAvatarImage = this.sendFormDataAvatarImage.bind(this);
		this.sendFormDataPassword = this.sendFormDataPassword.bind(this);
		this.sendFormDataInfoPersonal = this.sendFormDataInfoPersonal.bind(this);
	};
	componentDidMount() {
		var JSLink = localStorage.imgAvatar;
		var JSElement = document.getElementById('imgAvatar');
		JSElement.src = JSLink;
	}

    sendFormDataInfoPersonal(e) {
        e.preventDefault();
        // Guardamos el formulario para el envío
        var formData = new FormData(document.getElementById('formInfoPersonal'));

        // envío de archivo zip y datos formulario
        fetch(myConfig.apiUrl + myConfig.puerto + myConfig.modifyPersonalInfo , {
            method: 'POST',
            headers: {
            	'Accept': 'application/json',
            	'Content-Type': 'application/json',
               	'Authorization': 'EnvioPersonalInfo ' + localStorage.token
           },
			body: JSON.stringify({
				nombre: document.getElementsByName('nombre')[0].value,
				apellidos: document.getElementsByName('apellidos')[0].value,
				email: document.getElementsByName('email')[0].value,
				id_usuario: localStorage.idUsuario
			})
        })
        .then(function (data) {
          console.log('Request succeeded with FILE and INPUT response', data);
        })
        .catch(function (error) {
          console.log('Request failed', error);
        });
    };

    sendFormDataAvatarImage(e) {
        e.preventDefault();
        // Guardamos el formulario para el envío
        var formData = new FormData(document.getElementById('formAvatarImage')),
        	idUsuario = localStorage.idUsuario;
        	formData.append("id_usuario", localStorage.idUsuario);
        // envío de archivo zip y datos formulario
        fetch(myConfig.apiUrl + myConfig.puerto + myConfig.modifyAvatar , {
            method: 'POST',
            headers: {
               	'Authorization': 'EnvioArchivo ' + this.state.clientToken
           },
            body: formData
        })
        .then((data) => {
        	console.log('Request succeeded with AVATAR IMAGE response', data);
        	return fetch(myConfig.apiUrl + myConfig.puerto + '/user/get/avatar/file='+ encodeURIComponent(localStorage.urlAvatar), {
        		method: 'GET',
        		headers: {
        			'Authorization': 'EnvioArchivo ' + localStorage.token
        		}
        	})
                // .then((response) =>{
                //     localStorage.imgAvatar = response.imgAvatar;
                //     console.log('Response succeeded with AVATAR IMAGE response', response);
                // })
            .then((response) => {
            	// debugger;
            	console.log('Response succeeded with AVATAR IMAGE response', response);
                return response.json()
                .then((img) =>{
                    localStorage.imgAvatar = img;
                    console.log('Response succeeded with AVATAR IMAGE response', img);
                })
            })
        })
        .catch(function (error) {
          console.log('Request failed', error);
        });
    };

    sendFormDataPassword(e){
    	e.preventDefault();
    	var currentPassword = document.getElementById('currentPassword').value,
    		newPassword = document.getElementById('newPassword').value,
    		repeatPassword = document.getElementById('repeatPassword').value;
    	if (currentPassword == localStorage.password && newPassword !== '' && repeatPassword === newPassword) {
    		fetch(myConfig.apiUrl + myConfig.puerto + myConfig.modifyChangePassword, {
    			method: 'POST',
    			headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
    				'Authorization': 'EnvioArchivo ' + localStorage.token
    			},
    			body: JSON.stringify({
    				password: newPassword,
    				id_usuario: localStorage.idUsuario
    			})

    		})
    		.then((data)=>{
    			console.log('Request succeeded with CHANGE PASSWORD response', data);
    		})
    		.catch((error) => {
    			console.log('Request failed', error);
    		})
    	} else {
    		console.log('Datos no correctos');
    	}
    }
	render() {
		let fecha = new Date(localStorage.fechaAlta);
		let day = fecha.getDate().toString()
		if( day.length == 1 ){ day = "0" + day; }
		let month = fecha.getMonth() + 1;
		month = month + "";
		if( month.length == 1 ){ month = "0" + month; }
		let year = fecha.getFullYear().toString()
		fecha = day  + "-" + month + "-"  + year;
		return(
			<div className="profile-container">
				<div className="perfil dashboard col-lg-10 col-xs-12" id="dashboard">
					<div className="titleUser">
						<h2>Mi Perfil</h2>
					</div>
					<div className="col-md-3 profile-sidebar">
						<div className="portlet light">
							<div className="imgAvatar">
								<img id="imgAvatar" src="" />
							</div>
							<div className="profile-usertitle-name">{localStorage.userName} {localStorage.userApellido}</div>
			                <div className="profile-usertitle-email">{localStorage.empresa}</div>
						</div>
					</div>
					<div className="col-md-9 profile-content">
		                <PerfilSettings
		                	sendFormDataInfoPersonal={this.sendFormDataInfoPersonal}
		                	sendFormDataAvatarImage={this.sendFormDataAvatarImage}
		                	sendFormDataPassword={this.sendFormDataPassword}
		                	name={localStorage.userName}
		                	apellidos={localStorage.userApellido}
		                	email={localStorage.email}
		                />
	                </div>
              	</div>
          	</div>
		)
	}
}


class PerfilSettings extends Component {
	constructor(props){
		super(props);
		this.state = {
			value: ''
		}
		this.handleChange = this.handleChange.bind(this);
	}
	componentDidMount() {
		document.getElementById("files").onchange = function () {
			var reader = new FileReader();
			reader.onload = function (e) {
        	// get loaded data and render thumbnail.
        	document.getElementById("image").src = e.target.result;
    	};
    		// read the image file as a data URL.
    		reader.readAsDataURL(this.files[0]);
		};
	};
    handleChange(e) {
        this.setState={
            value: e.target.value
        }
    };
	render() {
		return(
            <div>
	            <div className="portlet light">
	            	<h3>Cambiar información personal</h3>
	            	<form method="POST" encType="multipart/form-data" id="formInfoPersonal">
		                <FormGroup>
		                    <ControlLabel>Nombre</ControlLabel>
		                    <FormControl
		                    name="nombre"
		                    placeholder={this.props.name}
		                    type="text"
		                    onChange={this.handleChange}
		                    />
		                </FormGroup>
		                <FormGroup>
		                    <ControlLabel>Apellidos</ControlLabel>
		                    <FormControl
		                    name="apellidos"
		                    placeholder={this.props.apellidos}
		                    type="text"
		                    onChange={this.handleChange}
		                    />
		                </FormGroup>
		                <FormGroup>
		                    <ControlLabel>Email</ControlLabel>
		                    <FormControl
		                    name="email"
		                    placeholder={this.props.email}
		                    type="email"
		                    onChange={this.handleChange}

		                    />
		                </FormGroup>
		                <div className="row">
			                <Button disabled={this.props.disabled} type="submit" onClick={this.props.sendFormDataInfoPersonal} >
			                	Editar
			                <i className="fa fa-upload" aria-hidden="true"></i>
			                </Button>
		                </div>
		            </form>
	            </div>
	            <div className="portlet light">
	            	<h3>Cambiar avatar</h3>
	            	<form method="POST" encType="multipart/form-data" id="formAvatarImage">
						<input type="file" id="files" name="avatarImage"/>
						<img id="image"  />
						<div className="row">
			                <Button disabled={this.props.disabled} type="submit" onClick={this.props.sendFormDataAvatarImage} >
			                	Editar
			                <i className="fa fa-upload" aria-hidden="true"></i>
			                </Button>
		                </div>
	                </form>
                </div>
	            <div className="portlet light">
	            	<h3>Cambiar password</h3>
	            	<form method="POST" encType="multipart/form-data" id="formTabsPassword">
		                <FormGroup>
		                    <ControlLabel>Password actual</ControlLabel>
		                    <FormControl
		                    id="currentPassword"
		                    name="currentPassword"
		                    type="text"
		                    />
		                </FormGroup>
		                <FormGroup>
		                    <ControlLabel>Nuevo Password</ControlLabel>
		                    <FormControl
		                    id="newPassword"
		                    name="password"
		                    type="text"
		                    />
		                </FormGroup>
		                <FormGroup>
		                    <ControlLabel>Repite nuevo Password</ControlLabel>
		                    <FormControl
		                    id="repeatPassword"
		                    name="repeatpassword"
		                    type="text"
		                    />
		                </FormGroup>
		                <div className="row">
			                <Button disabled={this.props.disabled} type="submit" onClick={this.props.sendFormDataPassword} >
			                	Editar
			                <i className="fa fa-upload" aria-hidden="true"></i>
			                </Button>
			            </div>
	                </form>
                </div>
            </div>
		)
	}
}
