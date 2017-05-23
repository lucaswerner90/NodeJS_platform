const mysql = require('mysql');
const CONFIGURATION_DB = require('./config.json');
const LOG_QUERIES = require('./queries/log.json');



class Database {


    constructor() {
        this._configuration = CONFIGURATION_DB;
        this._connection = mysql.createConnection(this._configuration);
        this._log_queries = LOG_QUERIES;


        this._connection.on("error", function(error) {
            console.error("[DATABASE ERROR] ---------> " + error);
            this._connection = mysql.createConnection(this._configuration);
        });


        this.modelContent = {
            "notas": "Por defecto",
            "indice_contenidos": "Por defecto",
            "notas_produccion": "Por defecto",
            "participantes": "Por defecto",
            "notas_contenidos": "Por defecto",
            "fecha_publicacion": (new Date()).toISOString().substring(0, 19).replace('T', ' '),
            "id_contenido": 0,
            "categorias": [],
            "licencia": 0,
            "recursos": [],
            "id_tecnologia": 0,
            "id_habilidad": 0,
            "id_nivel": 0,
            "table_platforms": [],
            "id_proyecto": -1,
            "url_image": "imagen",
            "catalogo_ted": 0
        };

    }

    _close_connection() {
        const _self = this;
        _self._connection.destroy();
    }

    _log_actions() {
        //
        // const _self=this;
        //
        // let action_sentence=action.split(".");
        // let sql_sentence=_self._log_queries[action_sentence[0]][action_sentence[1]];
        // obj.id_contenido=(obj.id_contenido)?obj.id_contenido:0;
        // sql_sentence=_self._replace_variables_on_query(sql_sentence,obj);
        // _self.sendQuery(sql_sentence,obj).then(()=>{
        //   console.info(`* LOGGED CORRECTLY ${action} *`);
        // })
        // .catch((err)=>{
        //   console.error(`* ERROR ON LOG * \n PROBLEM TO EXECUTE THE LOG SENTENCE ${err}`);
        // });
    }

    _replace_characters(cadena = "") {
        if (cadena.toString().startsWith("data:image")) {
            return cadena;
        }
        const regex = /[\[\^{}`*+\\=º"\]]+/g;
        return cadena.toString().replace(regex, "");
    }


    _replace_variables_on_query(queries, obj) {
        const _self = this;
        let query_parsed = [];
        queries = queries.toString().split(";");
        for (let i = 0; i < queries.length; i++) {
            let query = queries[i];
            for (const prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    query = (obj[prop] === null) ? query : query.split(`[${prop}]`).join((isNaN(obj[prop]) && prop !== "multiple_insert_query") ? `"${_self._replace_characters(obj[prop])}"` : `${obj[prop]}`);
                }
            }
            query_parsed.push(query);
        }
        return query_parsed.join(";");
    }


    createCompatibilityTableForInsertCourseQuery(obj, id_contenido, id_usuario) {
        let finalQuery = "";
        for (let i = 0; i < obj.length; i++) {
            // id_contenido,id_usuario,id_punto_control,id_tc,valor,fecha_validacion_proveedor,fecha_validacion_CQA
            if (i > 0) finalQuery += `, `;

            finalQuery += `(${id_contenido},${parseInt(id_usuario)},${parseInt(obj[i].id_punto_control)},${parseInt(obj[i].id_tc)},${parseInt(obj[i].id_valor)})`;
        }
        return {
            multiple_insert_query: finalQuery
        };
    }

    createInsertContentPlatform(obj, id_contenido) {
        let finalQuery = "";
        for (let i = 0; i < obj.length; i++) {
            // id_contenido,id_usuario,id_punto_control,id_tc,valor,fecha_validacion_proveedor,fecha_validacion_CQA
            if (i > 0) finalQuery += `, `;

            // finalQuery+=`(${parseInt(id_contenido)},${parseInt(obj[i])},${parseInt(obj[i].id_pais)})`;

            finalQuery += `(${parseInt(obj[i])},${parseInt(id_contenido)})`;
        }
        return {
            multiple_insert_query: finalQuery
        };
    }

    createInsertCategories(obj, id_contenido) {
        let finalQuery = "";
        for (let i = 0; i < obj.length; i++) {
            if (i > 0) finalQuery += `, `;

            finalQuery += `(${parseInt(id_contenido)},${parseInt(obj[i].id_categoria)},${obj[i].id_subcategoria})`;
        }
        return {
            multiple_insert_query: finalQuery
        };
    }


    createInsertContentServer(obj, id_contenido) {
        let finalQuery = "";
        for (let i = 0; i < obj.length; i++) {
            if (i > 0) finalQuery += `, `;
            finalQuery += `(${parseInt(id_contenido)},${parseInt(obj[i])})`;
        }
        return {
            multiple_insert_query: finalQuery
        };
    }

    createInsertContentRecursos(obj, id_contenido) {
        let finalQuery = "";
        for (let i = 0; i < obj.length; i++) {
            if (i > 0) finalQuery += `, `;
            finalQuery += `(${parseInt(id_contenido)},${parseInt(obj[i])})`;
        }
        return {
            multiple_insert_query: finalQuery
        };
    }



    sendQuery(query, object = {}) {

        const _self = this;

        return new Promise(function(resolve, reject) {


            if (!query) {
                resolve(true);
            }

            query = _self._replace_variables_on_query(query, object);
            // Use the connection

            _self._connection.query(query, function(err, rows) {


                // In case of error
                if (err !== null) {
                    reject(err);
                }

                // Don't use the connection here, it has been returned to the pool.!!!!!!
                resolve(rows);
            });
        });

    }

    recordOnLog(action, obj) {
        // Record the user's login
        this._log_actions(action, {
            id_usuario: obj.id_usuario,
            id_contenido: obj.id_contenido,
            fecha_modificacion: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });
    }


    insert_new_content(camposFormulario, user_queries) {

        const _self = this;

        return new Promise((resolve, reject) => {

            _self.sendQuery(user_queries.INSERT.content, camposFormulario).then((row) => {

                // After insert the basic info about the content we need to populate the relations
                camposFormulario["id_contenido"] = row.insertId;

                for (let prop in camposFormulario) {
                    if (camposFormulario[prop] !== null && camposFormulario[prop] !== undefined && camposFormulario[prop] !== "") {
                        _self.modelContent[prop] = camposFormulario[prop];
                    }
                }


                let additional_queries = [];

                if (_self.modelContent.categorias && _self.modelContent.categorias.length > 0) {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_categorias, {
                        multiple_insert_query: _self.createInsertCategories(_self.modelContent.categorias, _self.modelContent.id_contenido).multiple_insert_query
                    }));
                }

                additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.tableOfCompatibilities, {
                    multiple_insert_query: _self.createCompatibilityTableForInsertCourseQuery(_self.modelContent.multiple_insert_query, _self.modelContent.id_contenido, _self.modelContent.id_usuario).multiple_insert_query,
                    id_contenido: _self.modelContent.id_contenido,
                    id_usuario: _self.modelContent.id_usuario
                }));


                if (_self.modelContent.servidores_contenidos.length > 0) {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_servidor, {
                        id_contenido: _self.modelContent.id_contenido,
                        multiple_insert_query: _self.createInsertContentServer(_self.modelContent.servidores_contenidos, _self.modelContent.id_contenido).multiple_insert_query
                    }));
                }

                // Campos licencia en el contenido
                if (_self.modelContent.licencia == 1) {
                    _self.modelContent['fecha_fin'] = new Date(_self.modelContent['fecha_fin']).toISOString().slice(0, 19).replace('T', ' ');
                    _self.modelContent['fecha_inicio'] = new Date(_self.modelContent['fecha_inicio']).toISOString().slice(0, 19).replace('T', ' ');
                    additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_licencia, _self.modelContent));
                }

                if (_self.modelContent.recursos.length > 0) {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_recursos, {
                        id_contenido: _self.modelContent.id_contenido,
                        multiple_insert_query: _self.createInsertContentRecursos(_self.modelContent.recursos, _self.modelContent.id_contenido).multiple_insert_query
                    }));
                }




                additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_technology, {
                    id_contenido: _self.modelContent.id_contenido,
                    id_tecnologia: _self.modelContent.id_tecnologia
                }));



                additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_habilidades, {
                    id_contenido: _self.modelContent.id_contenido,
                    id_habilidad: _self.modelContent.id_habilidad
                }));


                additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_education, {
                    id_contenido: _self.modelContent.id_contenido,
                    id_nivel: _self.modelContent.id_nivel
                }));



                if (_self.modelContent.table_platforms.length) {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_platform,
                        _self.createInsertContentPlatform(_self.modelContent.table_platforms, _self.modelContent.id_contenido, _self.modelContent.id_pais)));
                }

                if (_self.modelContent.id_proyecto != -1) {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.contentRelation, _self.modelContent));
                }

                additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.screenshot, _self.modelContent));



                additional_queries = additional_queries.join(" ");

                _self.sendQuery(additional_queries).then(() => {
                        resolve(true);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    update_content(content, user_queries, camposFormulario, update_file = false) {

        const _self = this;

        return new Promise(function(resolve, reject) {
            let additional_queries = [];



            for (let prop in camposFormulario) {
                if (camposFormulario[prop] !== null && camposFormulario[prop] !== undefined && camposFormulario[prop] !== "") {
                    _self.modelContent[prop] = camposFormulario[prop];
                }
            }


            additional_queries.push(_self._replace_variables_on_query((update_file) ? user_queries.UPDATE.content : user_queries.UPDATE.contentNoFile, _self.modelContent));

            if (_self.modelContent.categorias && _self.modelContent.categorias.length > 0) {
                if (content.categorias && content.categorias.length > 0) {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.content_categorias_subcategorias, {
                        id_contenido: _self.modelContent.id_contenido
                    }));
                }
                additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_categorias, {
                    multiple_insert_query: _self.createInsertCategories(_self.modelContent.categorias, _self.modelContent.id_contenido).multiple_insert_query
                }));
            } else if (_self.modelContent.categorias && _self.modelContent.categorias.length == 0 && content.categorias.length > 0) {
                additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.content_categorias_subcategorias, {
                    id_contenido: _self.modelContent.id_contenido
                }));
            }



            if (_self.modelContent.recursos.length > 0) {
                if (content.recursos.length > 0) {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.content_recursos, {
                        id_contenido: _self.modelContent.id_contenido
                    }));
                }
                additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_recursos, {
                    id_contenido: _self.modelContent.id_contenido,
                    multiple_insert_query: _self.createInsertContentRecursos(_self.modelContent.recursos, _self.modelContent.id_contenido).multiple_insert_query
                }));

            } else if (_self.modelContent.recursos.length === 0 && content.recursos.length > 0) {
                additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.content_recursos, {
                    id_contenido: _self.modelContent.id_contenido
                }));
            }

            // Campos licencia en el contenido
            if (_self.modelContent.licencia == 1) {


                _self.modelContent['fecha_inicio'] = (_self.modelContent['fecha_inicio']) ? new Date(_self.modelContent['fecha_inicio']).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');
                _self.modelContent['fecha_fin'] = (_self.modelContent['fecha_fin']) ? new Date(_self.modelContent['fecha_fin']).toISOString().slice(0, 19).replace('T', ' ') : _self.modelContent['fecha_inicio'];


                if (content.licencia == 1) {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.content_licencia, {
                        id_contenido: _self.modelContent.id_contenido
                    }));
                }
                additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_licencia, _self.modelContent));
            }

            if (_self.modelContent.table_platforms.length > 0) {

                //If the content already has table platforms assigned to.
                if (content.platforms.length > 0) {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.content_platform, {
                        id_contenido: _self.modelContent.id_contenido,
                        multiple_insert_query: _self.createInsertContentPlatform(_self.modelContent.table_platforms, _self.modelContent.id_contenido, _self.modelContent.id_pais).multiple_insert_query
                    }));
                } else {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_platform, {
                        id_contenido: _self.modelContent.id_contenido,
                        multiple_insert_query: _self.createInsertContentPlatform(_self.modelContent.table_platforms, _self.modelContent.id_contenido, _self.modelContent.id_pais).multiple_insert_query
                    }));
                }

            } else if (_self.modelContent.table_platforms.length == 0 && content.platforms.length > 0) {

                additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.content_platform_delete, {
                    id_contenido: _self.modelContent.id_contenido
                }));
            }


            additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.content_technology, {
                id_contenido: _self.modelContent.id_contenido,
                id_tecnologia: _self.modelContent.id_tecnologia
            }));



            if (_self.modelContent.servidores_contenidos.length > 0) {

                if (content.servidores_contenidos.length > 0) {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.content_servidor, {
                        id_contenido: _self.modelContent.id_contenido,
                        multiple_insert_query: _self.createInsertContentServer(_self.modelContent.servidores_contenidos, _self.modelContent.id_contenido).multiple_insert_query
                    }));
                } else {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_servidor, {
                        id_contenido: _self.modelContent.id_contenido,
                        multiple_insert_query: _self.createInsertContentServer(_self.modelContent.servidores_contenidos, _self.modelContent.id_contenido).multiple_insert_query
                    }));
                }

            } else if (_self.modelContent.servidores_contenidos.length === 0 && content.servidores_contenidos.length > 0) {
                let onlyDelete = (user_queries.UPDATE.content_servidor) ? user_queries.UPDATE.content_servidor.split(";")[0] + ";" : "";
                additional_queries.push(_self._replace_variables_on_query(onlyDelete, {
                    id_contenido: _self.modelContent.id_contenido
                }));
            }

            if (_self.modelContent.id_nivel != -1) {
                additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.content_education, {
                    id_contenido: _self.modelContent.id_contenido,
                    id_nivel: _self.modelContent.id_nivel
                }));
            }

            if (_self.modelContent.id_habilidad != -1) {
                additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.content_habilidades, {
                    id_contenido: _self.modelContent.id_contenido,
                    id_habilidad: _self.modelContent.id_habilidad
                }));
                additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.content_habilidades, {
                    id_contenido: _self.modelContent.id_contenido,
                    id_habilidad: _self.modelContent.id_habilidad
                }));
            }




            if (_self.modelContent.multiple_insert_query.length > 0) {
                if (content.compatibilities_table.length > 0) {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.tableOfCompatibilities + user_queries.INSERT.tableOfCompatibilities, {
                        multiple_insert_query: _self.createCompatibilityTableForInsertCourseQuery(_self.modelContent.multiple_insert_query, _self.modelContent.id_contenido, _self.modelContent.id_usuario).multiple_insert_query,
                        id_contenido: _self.modelContent.id_contenido
                    }));
                } else {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.tableOfCompatibilities, {
                        multiple_insert_query: _self.createCompatibilityTableForInsertCourseQuery(_self.modelContent.multiple_insert_query, _self.modelContent.id_contenido, _self.modelContent.id_usuario).multiple_insert_query,
                        id_contenido: _self.modelContent.id_contenido
                    }));
                }
            }




            if (_self.modelContent['id_proyecto']) {
                if (content.id_proyecto) {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.UPDATE.contentRelation, _self.modelContent));
                } else {
                    additional_queries.push(_self._replace_variables_on_query(user_queries.INSERT.contentRelation, _self.modelContent));
                }
            }

            additional_queries = additional_queries.join(" ");

            _self.sendQuery(additional_queries).then(() => {
                    resolve(true);
                })
                .catch((error) => {
                    reject(error);
                });
            //
        });

    }



}


module.exports = Database;
