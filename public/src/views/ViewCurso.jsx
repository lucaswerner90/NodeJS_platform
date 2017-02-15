import React, {Component} from 'react';
import { render }   from 'react-dom';
import FormularioDatosGenerales from './FormularioDatosGenerales.jsx';

export default class ViewCurso extends Component{
	render(){
		return(
			<FormularioDatosGenerales disabled= {true} />
		)
	}
}

