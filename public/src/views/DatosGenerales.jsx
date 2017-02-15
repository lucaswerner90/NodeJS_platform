import React, {Component} from 'react';
import { render }   from 'react-dom';
import FormularioDatosGenerales from './FormularioDatosGenerales.jsx';
import { myConfig } from '../js/config.js';

export default class DatosGenerales extends Component{
    constructor(props, {technologiesSelected}) {
        super(props);
        this.state= {
            disabled: false,
            clientToken: localStorage.token,
            datosPlatforms: [],
            datosStates: [],
            datosTechnologies: [],
            datosProyectos: [],
            datosContentTypes: [],
            datosIdiomas:[],
            technologiesSelected: technologiesSelected,
            newStateSelected: []
        }

    };
    onChildChanged(newStateSelected) {
        this.setState({ technologiesSelected: newStateSelected })
        this.props.callbackParent(newStateSelected);
    };
    render() {
        return(
            <div>
            {
                <FormularioDatosGenerales {...this.props}

                                        technologiesSelected={this.state.technologiesSelected}
                                        callbackParent={(newStateSelected) => this.onChildChanged(newStateSelected) }
                                        />
            }
            </div>
        )
    }
}
