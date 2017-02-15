import React, {Component, PropTypes} from 'react';
import { render }   from 'react-dom'
import DocumentTitle from 'react-document-title';
import {FormGroup, ControlLabel, FormControl, HelpBlock, TextInput, Button} from 'react-bootstrap';
import { Router, Route, Link, IndexLink, IndexRoute, hashHistory, browserHistory, withRouter } from 'react-router';
import auth from './../auth.js';


class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
           user: "",
           role: "",
        };
    };
    render() {
        return (
            <div className="loginWrapper">
                <div className="modalForm">
                    <div className="row">
                        <form ref="form" name="formLogin" id="login-form" onClick={this.props._userLogin} className="container formLogin col-xs-12 col-sm-8 col-md-6 col-lg-4">
                            <div className="imgLogo">
                                <img src="../images/Logotipo_TED.svg" />
                            </div>
                            <div className="titleLogin"> Bienvenido al Catálogo de Cursos</div>
                            <label><input ref="email" name="email" placeholder="email" type="text" /></label>
                            <label><input ref="pass" name="password" placeholder="password" type="password" /></label>
                            <Button type="submit">ACCEDER</Button>
                            <p className="errorMessage"> {this.props.loginError}</p>
                            <div className="footerLogin"> Telefónica Educación Digital. Todos los derechos reservados</div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

// export default LoginPage;
export default withRouter(LoginPage);
