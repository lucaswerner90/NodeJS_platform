import React, {Component} from 'react';
import { Link } from 'react-router';

export default class HeaderPage extends Component {
    constructor(props){
        super(props);
        this.state= {
            // userInfo: userInfo
        }
    this.buttonSideBar = this.buttonSideBar.bind(this);
    };
    componentDidMount() {
        var JSLink = localStorage.imgAvatar;
        var JSElement = document.getElementById('imgAvatarHeader');
        JSElement.src = JSLink;
    };
    buttonSideBar (event) {
        event.preventDefault();
        var button = document.getElementById('buttonSideBar');
        var desplegable = document.getElementById('pageSidebar');
        var logoLink = document.getElementsByClassName('logoLink');
        if (desplegable.classList.contains("open")){
            desplegable.classList.add("closed");
            desplegable.classList.remove("open");
            document.getElementById('dashboard').classList.add('total');
        } else {
            desplegable.classList.add("open");
            desplegable.classList.remove("closed");
            document.getElementById('dashboard').classList.remove('total');
        }
    };

    render() {
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div>
                    <div id="navbar-collapse" >
                        <div className="buttonMenu">
                            <a href="#">
                                <i className="icon-menu" aria-hidden="true" id="buttonSideBar" onClick={this.buttonSideBar}></i>
                            </a>
                        </div>
                        <ul className="nav navbar-nav">
                            <li className="logoLink"><Link to="/contenidos"><img src="../images/ted.svg"/></Link></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <div className="imgAvatar">
                                <img id="imgAvatarHeader" src="" />
                            </div>
                            <span> {this.props.userName}  {this.props.userApellido} </span>
                            <Link activeClassName="active"  to='/logout'><i className="fa fa-sign-out" aria-hidden="true"></i></Link>
                            <span className="greyTitle">CATÁLOGO DE CONTENIDOS</span>
                        </ul>

                    </div>
                </div>
            </nav>
        );
    }
}


