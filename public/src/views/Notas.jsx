import React, {Component} from 'react';
import {render} from 'react-dom';
import {FormGroup, ControlLabel, FormControl, HelpBlock, TextInput, Button} from 'react-bootstrap';

export default class Notas extends Component {
	constructor(props) {
		super(props);
		this.state= {
        	value: '',
            disabled: false
        }
	};
    componentWillMount() {
        if (this.props.disabled == false) {
            this.setState={
                value: ""
            }
        }
        if(this.props.disabled == true){
            this.setState={
                notas : this.props.contenidosList[this.props.indexCourse].notas,
            }
        } else {
            null
        }
    }
	render() {
		return(
            <div className="row">
                <FormGroup controlId="textareaProyectoSelect"  className="col-lg-12">
                    <ControlLabel>Notas</ControlLabel>
                    <FormControl
                    componentClass="textarea"
                    name="notas"
                    placeholder="Lorem ipsum dolor sit amet..."
                    disabled={this.props.disabled}
                    value={ this.props.disabled == true ? this.props.contenidosList[this.props.indexCourse].notas : undefined }
                    />
                </FormGroup>
            </div>
		)
	}
}