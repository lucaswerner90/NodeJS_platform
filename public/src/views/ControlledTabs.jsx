import React, {Component} from 'react';
import { render }   from 'react-dom';
import { Tabs, Tab, Button } from 'react-bootstrap';
import DatosGenerales from './DatosGenerales.jsx';
import InformacionTecnica from './InformacionTecnica.jsx';
import Notas from './Notas.jsx';
import { myConfig } from '../js/config.js';

export default class ControlledTabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            value: '',
            disabled: false,
            clientToken: localStorage.token,
            changeTypeButton: true,
            newStateSelected: [],
            technologiesSelected: [],
            datosPlatforms: [],
            datosStates: [],
            datosTechnologies: [],
            datosProyectos: [],
            datosContentTypes: [],
            datosIdiomas:[],
            datosPuntosControl: [],
            datosCompatibilitiesTable: [],
            datosEvaluationSystems: [],
            datosTablaCompatibilidades: [],
            datosTipoDesarrollo: [],
        }
        this.exportMultiSelect = this.exportMultiSelect.bind(this);
        this.returnMultiSelect = this.returnMultiSelect.bind(this);
    };
    componentWillMount() {
        fetch(myConfig.apiUrl + myConfig.puerto + myConfig.getGenericInformation, {
            method: 'GET',
            headers: {
                'Authorization': 'DatosBBDDCourseGenericInfo ' + this.state.clientToken
            }

        }).then((response) =>{
            return response.json().then( (datos) => {
                this.setState({
                    datosPlatforms: datos.platforms,
                    datosStates: datos.states,
                    datosTechnologies: datos.tecnologias,
                    datosProyectos: datos.proyectos,
                    datosContentTypes: datos.contentTypes,
                    datosIdiomas: datos.idiomas,
                    datosPuntosControl: datos.puntos_control,
                    datosCompatibilitiesTable : datos.valores_certificacion,
                    datosEvaluationSystems : datos.evaluationSystems,
                    datosTablaCompatibilidades: datos.tabla_compatibilidades,
                    datosTipoDesarrollo: datos.tipo_desarrollo
                });
                console.log('Response success: ' + JSON.stringify(datos));
            })
        }).catch((error)  => {
            console.log('Response failed', error);
        });
    };
    handleSelect(key) {
        this.setState({key});
    };
    onChildChanged(newStateSelected) {
        this.setState({ newStateSelected: newStateSelected })
        console.log('newStateSelected en ControlledTabs.jsx: ' + newStateSelected[1] );
        console.log('type newStateSelected en ControlledTabs.jsx: ' + typeof newStateSelected[1] );
    };
    exportMultiSelect() {
        var obj=document.getElementById('formInfoTecSelectMultipleOrigen');
        if (obj.selectedIndex==-1) return;
        var valor=obj.value;
        var txt=obj.options[obj.selectedIndex].text;
        obj.options[obj.selectedIndex]=null;
        var obj2=document.getElementById('formInfoTecSelectMultipleDestino');
        var opc = new Option(txt,valor);
        eval(obj2.options[obj2.options.length]=opc);
        // this.onTechnologiesChanged();
    };
    returnMultiSelect() {
        var obj=document.getElementById('formInfoTecSelectMultipleDestino');
        if (obj.selectedIndex==-1) return;
        var valor=obj.value;
        var txt=obj.options[obj.selectedIndex].text;
        obj.options[obj.selectedIndex]=null;
        var obj2=document.getElementById('formInfoTecSelectMultipleOrigen');
        var opc = new Option(txt,valor);
        eval(obj2.options[obj2.options.length]=opc);
        // this.onTechnologiesChanged();
    };
    render() {
        return (
            <div>
                <div>
                    <form method="POST" encType="multipart/form-data" id="formTabs">
                        <div className="container">
                            {
                                this.props.disabled == true ?
                                    <Button onClick={this.props._changeDisabled} >Editar</Button>
                                :   <Button onClick={this.props._prevComponent} >Cancelar </Button>
                            }
                            {
                                this.props.changeTypeButton == true ?
                                    <Button disabled={this.props.disabled} type="submit" onClick={this.props.sendFormData} >
                                        Publicar
                                        <i className="fa fa-upload" aria-hidden="true"></i>
                                    </Button>
                                :
                                    <Button disabled={this.props.disabled} type="submit" onClick={this.props.sendModifyCourse} >
                                        Actualizar
                                        <i className="fa fa-upload" aria-hidden="true"></i>
                                    </Button>
                            }
                        </div>
                        <Tabs activeKey={this.key} onSelect={this.handleSelect} id="controlled-tab-example">
                            <Tab eventKey={1} title="Datos Generales">
                            <DatosGenerales {...this.props}
                            exportMultiSelect={this.exportMultiSelect}
                            returnMultiSelect={this.returnMultiSelect}
                            onTechnologiesChanged={this.onTechnologiesChanged}
                            datosPlatforms={this.state.datosPlatforms}
                            datosStates ={this.state.datosStates}
                            datosTechnologies= {this.state.datosTechnologies}
                            datosTablaCompatibilidades={this.state.datosTablaCompatibilidades}
                            datosProyectos= {this.state.datosProyectos}
                            datosContentTypes = {this.state.datosContentTypes}
                            datosIdiomas={this.state.datosIdiomas}
                            datosPuntosControl ={this.state.datosPuntosControl}
                            datosCompatibilitiesTable={this.state.datosCompatibilitiesTable}
                            callbackParent={(newStateSelected) => this.onChildChanged(newStateSelected)}/></Tab>
                            <Tab eventKey={2} title="Información Técnica">
                            <InformacionTecnica {...this.props}
                            exportMultiSelect={this.exportMultiSelect}
                            returnMultiSelect={this.returnMultiSelect}
                            datosPlatforms={this.state.datosPlatforms}
                            datosEvaluationSystems={this.state.datosEvaluationSystems}
                            datosStates ={this.state.datosStates}
                            datosTablaCompatibilidades={this.state.datosTablaCompatibilidades}
                            datosPuntosControl={this.state.datosPuntosControl}
                            datosTipoDesarrollo={this.state.datosTipoDesarrollo}
                            datosTechnologies= {this.state.datosTechnologies}
                            datosCompatibilitiesTable= {this.state.datosCompatibilitiesTable}
                            technologiesSelected={this.state.newStateSelected}/></Tab>

                            <Tab eventKey={3} title="Contenidos" disabled>Tab 3 content</Tab>
                            <Tab eventKey={4} title="Recursos">Tab 4 content</Tab>
                            <Tab eventKey={5} title="Producción">Tab 5 content</Tab>
                            <Tab eventKey={6} title="Notas" ><Notas {...this.props}/></Tab>
                        </Tabs>

                        {this.props.children}
                    </form>
                </div>
            </div>
        );
    };
};
                            /*<Button> Duplicar <i className="fa fa-clone" aria-hidden="true"></i></Button>*/

