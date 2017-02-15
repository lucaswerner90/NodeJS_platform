import React, {Component} from 'react';
import { render }   from 'react-dom';
import {Pagination} from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ReactPaginate from 'react-paginate';

export default class MisContenidosTable extends Component {
	constructor(props){
		super(props);
		this.state={
			indexindex: ''
		}

	}

	render() {
		return(
			<div className="tusCursos col-lg-12">
				<span className="title">Tus cursos</span>
				<table>
					<thead className="titleRow">
						<tr>
							<th >Código proyecto</th>
							<th >Nombre</th>
							<th >Idioma</th>
							<th >Tipo</th>
							<th >Fecha publicación</th>
							<th >Horas</th>
						</tr>
					</thead>
					<tbody className="cursoRow">
					{
						this.props.contenidosList.map(function (message,index) {
							return (
								<MisContenidosRow
								key={index}
								codigo={message.codigo_proyecto}
								curso={message.titulo}
								idioma={message.id_idioma}
								tipo = {message.id_tipo_contenido}
								time={message.fecha_publicacion}
								horas={message.duracion}
								_updateComponent= {() => this.props._updateComponent(index)}
								indexCourse={this.state.index}
								/>
								)
						}, this)
					}
					</tbody>
				</table>

			</div>
		)
	}
}

class MisContenidosRow extends Component {
	constructor(props){
		super(props);
	};

	render () {
		let fecha = new Date(this.props.time);
		let day = fecha.getDate().toString()
		if( day.length == 1 ){ day = "0" + day; }
		let month = fecha.getMonth() + 1;
		month = month + "";
		if( month.length == 1 ){ month = "0" + month; }
		let year = fecha.getFullYear().toString()
		fecha = year  + "-" + month + "-"  + day;

		return (
			<tr>
				<td >{this.props.codigo}</td>
				<td ><a href="#" onClick={this.props._updateComponent} >{this.props.curso}</a></td>
				<td >{this.props.idioma}</td>
				<td >{this.props.tipo}</td>
				<td >{fecha}</td>
				<td >{this.props.horas}</td>
			</tr>
		)
	}
}
				// <ReactPaginate previousLabel={"previous"}
				// nextLabel={"next"}
				// breakLabel={<a href="">...</a>}
				// breakClassName={"break-me"}
				// pageCount={this.props.pageCount}
				// marginPagesDisplayed={2}
				// pageRangeDisplayed={5}
				// onPageChange={this.props.handlePageClick}
				// containerClassName={"pagination"}
				// subContainerClassName={"pages pagination"}
				// activeClassName={"active"} />
				// </div>