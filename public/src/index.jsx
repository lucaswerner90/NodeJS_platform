import React, {Component, PropTypes} from 'react';
import { render } 	from 'react-dom';
import { Router, Route, Link, IndexLink, IndexRoute, hashHistory, browserHistory, withRouter } from 'react-router';
import auth from './auth.js';
import { connect, Provider  } from 'react-redux';
import { push } from 'react-router-redux';
import requiresAuth from './views/AuthorizedComponent.jsx';
import HeaderPage  	from './views/HeaderPage.jsx';
import Dashboard from './views/Dashboard.jsx';
import LoginPage from './views/LoginPage.jsx';
import Logout from './views/Logout.jsx';
import Perfil from './views/Perfil.jsx';
import MisContenidos from './views/MisContenidos.jsx';
import AnadirContenidos from './views/AnadirContenidos.jsx';
import DatosGenerales from './views/DatosGenerales.jsx';
import ViewCurso from './views/ViewCurso.jsx';
import Busqueda from './views/Busqueda.jsx';
import Soporte from './views/Soporte.jsx';
import { myConfig } from './js/config.js';


/********************************************************/
/* INICIO DE LA APLICACIÓN								              */
/********************************************************/

class App extends Component {
    constructor(props) {
        super(props);
        this.state= {
            loggedIn: false,
            datos: [],
            loginError: '',
            userName: localStorage.userName || '',
            userApellido: localStorage.userApellido || '',
            idProveedor: localStorage.idProveedor || '',
            idUsuario: localStorage.idUsuario || '',
            urlAvatar: localStorage.urlAvatar || '',
            imgAvatar: localStorage.imgAvatar || '',
            empresa: localStorage.empresa  || '',
            userEmail: localStorage.email,
            userFecha: localStorage.fechaAlta,
            clientToken: localStorage.token,
            idToken: this.getIdToken(),
        }
        this.getIdToken = this.getIdToken.bind(this);
        this._userLogin = this._userLogin.bind(this);
    };
    componentWillMount() {
            console.log('token: ' + this.state.idToken)
            console.log('usuario: ' + this.state.userName);
        if (this.state.idToken) {
            return( <Dashboard userName={this.state.userName} userApellido={this.state.userApellido} /> )
        } else {
            return(<LoginPage _userLogin={this._userLogin} datos={this.state.datos}/>)
        }
    };

    _userLogin(event) {
        event.preventDefault();
        var STORAGE_KEY = 'id_token';
        // const email = this.refs.email.value
        // const pass = this.refs.pass.value
        var userInfo= [];
        // var value = document.getElementsByName('formLogin').length;
        // if (value >= 1) { // if validation fails, value will be null
            fetch( myConfig.apiUrl + myConfig.puerto + myConfig.loginUrl, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userEmail: document.getElementsByName('email')[0].value,
                    userPassword: document.getElementsByName('password')[0].value
                })
            })
            .then( (response) => {
                return response.json()
                .then((data) =>{
                    localStorage.token = data.token;
                    localStorage.userName = data.userInfo.Nombre;
                    localStorage.userApellido = data.userInfo.Apellidos;
                    localStorage.email = data.userInfo.email;
                    localStorage.fechaAlta = data.userInfo.fecha_alta;
                    localStorage.idProveedor = data.userInfo.id_proveedor;
                    localStorage.idUsuario = data.userInfo.id_usuario;
                    localStorage.imgAvatar = data.userInfo.imgAvatar;
                    localStorage.urlAvatar = data.userInfo.urlAvatar;
                    localStorage.empresa = data.userInfo.empresa;
                    localStorage.password = data.userInfo.password;
                    // userName = data.userInfo.Nombre;
                    this.setState({
                        userName: data.userInfo.Nombre,
                        // userApellido: data.userInfo.Apellidos,
                        idToken: JSON.stringify(data.token)
                    })
                    // console.info('proveedores en index.jsx : ' + localStorage.idProveedor);
                    window.location.replace('/contenidos');
                    // console.log('data login: ' + JSON.stringify(data));
                })
                .then( (json) => {

                })
                .catch(error => {
                    console.log("Request failed:" + error);
                    this.setState({loginError: 'Usuario o contraseña no son correctas.'});
                })
            })
        // } else {
            // return this.setState({ error: true })
        // }
    };

    // si tiene token estará autorizado
    getIdToken() {
        // First, check if there is already a JWT in local storage
        var idToken = localStorage.token;
        var authHash = window.location.hash;
        // If there is no JWT in local storage and there is one in the URL hash,
        // save it in local storage
        if (!idToken && authHash) {
            if (authHash.id_token) {
                idToken = authHash.id_token
                localStorage.setItem('id_token', authHash.id_token);
            }
            if (authHash.error) {
                // Handle any error conditions
                console.log("Error signing in", authHash);
            }
        }
        return idToken;
    };

    render() {
        return (
            <div className="appWrapper">
                {
                   this.state.idToken  ? ( <Dashboard userName={this.state.userName} userApellido={this.state.userApellido}/> )
                    : (<LoginPage loginError={this.state.loginError} _userLogin={this._userLogin} datos={this.state.datos} />)
                }
                {this.props.children}
            </div>
        )
    }
};

class NotFound extends Component{
    render() {
        return (
            <h1 className="container">404.. No se ha encontrado la página!</h1>
        )
    }
}

function requireAuth(nextState, replace) {
    if (!auth.loggedIn()) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}



render((
    <Router history={browserHistory}>
        <Route name="Inicio" path="/" component={App}>
            <Route name="Login" path='login' component={LoginPage} />
            <Route name="Logout" path='logout' component={Logout} />
            <Route name="MisContenidos" path='contenidos' component={MisContenidos} onEnter={requireAuth} />
            <Route name="AnadirContenidos" path='anadir-contenido' component={AnadirContenidos}  onEnter={requireAuth} />
            <Route name="Busqueda" path='busqueda' component={Busqueda}  onEnter={requireAuth} />
            <Route name="Dashboard2" path='dashboard' component={Dashboard} onEnter={requireAuth} />
            <Route name="Proveedores" path='proveedores' component={Perfil} onEnter={requireAuth} />
            <Route name="Perfil" path='perfil' component={Perfil} />
            <Route name="Informes" path='informes' component={Perfil} />
            <Route name="Soporte" path='soporte' component={Soporte} />
            <Route name="404" path='*' component={NotFound} />
        </Route>
    </Router>

), document.getElementById('app'))
