(function(){
  let puntos_control=[
    {
      "id_punto_control": 3,
      "descripcion": "Se registra en plataforma los datos de la tentativa (tiempo, estado, puntuacion).",
      "id_estado": 1,
      "acortado": "Tentativa"
    },
    {
      "id_punto_control": 4,
      "descripcion": "Muestra la puntuacion en la plataforma. ",
      "id_estado": 1,
      "acortado": "Puntuacion"
    },
    {
      "id_punto_control": 5,
      "descripcion": "Posiciona en la última página visitada o en su defecto al principio del apartado.",
      "id_estado": 1,
      "acortado": "Posicionamiento"
    },
    {
      "id_punto_control": 6,
      "descripcion": "Mantiene mayor estado obtenido.",
      "id_estado": 1,
      "acortado": "Estado"
    },
    {
      "id_punto_control": 7,
      "descripcion": "El contenido pasa correctamente del estado \"Not Attempted\" (No iniciado) al estado \"Incomplete\" (Iniciado)",
      "id_estado": 1,
      "acortado": "Estado inicial"
    },
    {
      "id_punto_control": 8,
      "descripcion": "El contenido pasa correctamente del estado \"Incomplete (Iniciado)\" a un estado final \" Completed/Passed/Failed (Completado/Superado/No superado)\"",
      "id_estado": 1,
      "acortado": "Iniciado"
    }
  ];

  let compatibilities_table=[
    {
      "id_punto_control": 4,
      "id_tc": 7,
      "valor": 3,
      "fecha_validacion_proveedor": "2017-02-07T15:46:01.000Z",
      "fecha_validacion_CQA": null
    },
    {
      "id_punto_control": 6,
      "id_tc": 7,
      "valor": 1,
      "fecha_validacion_proveedor": "2017-02-07T15:46:01.000Z",
      "fecha_validacion_CQA": null
    },
    {
      "id_punto_control": 7,
      "id_tc": 7,
      "valor": 1,
      "fecha_validacion_proveedor": "2017-02-07T15:46:01.000Z",
      "fecha_validacion_CQA": null
    },
    {
      "id_punto_control": 5,
      "id_tc": 7,
      "valor": 2,
      "fecha_validacion_proveedor": "2017-02-07T15:46:01.000Z",
      "fecha_validacion_CQA": null
    },
    {
      "id_punto_control": 8,
      "id_tc": 7,
      "valor": 1,
      "fecha_validacion_proveedor": "2017-02-07T15:46:01.000Z",
      "fecha_validacion_CQA": null
    },
    {
      "id_punto_control": 3,
      "id_tc": 7,
      "valor": 1,
      "fecha_validacion_proveedor": "2017-02-07T15:46:01.000Z",
      "fecha_validacion_CQA": null
    },
    {
      "id_punto_control": 8,
      "id_tc": 9,
      "valor": 4,
      "fecha_validacion_proveedor": "2017-02-07T15:46:01.000Z",
      "fecha_validacion_CQA": null
    },
    {
      "id_punto_control": 7,
      "id_tc": 9,
      "valor": 4,
      "fecha_validacion_proveedor": "2017-02-07T15:46:01.000Z",
      "fecha_validacion_CQA": null
    },
    {
      "id_punto_control": 5,
      "id_tc": 9,
      "valor": 1,
      "fecha_validacion_proveedor": "2017-02-07T15:46:01.000Z",
      "fecha_validacion_CQA": null
    },
    {
      "id_punto_control": 6,
      "id_tc": 9,
      "valor": 3,
      "fecha_validacion_proveedor": "2017-02-07T15:46:01.000Z",
      "fecha_validacion_CQA": null
    },
    {
      "id_punto_control": 4,
      "id_tc": 9,
      "valor": 2,
      "fecha_validacion_proveedor": "2017-02-07T15:46:01.000Z",
      "fecha_validacion_CQA": null
    },
    {
      "id_punto_control": 3,
      "id_tc": 9,
      "valor": 2,
      "fecha_validacion_proveedor": "2017-02-07T15:46:01.000Z",
      "fecha_validacion_CQA": null
    }
  ];

  function orderTableCertificacion() {
    let newObject={};
    for (let i = 0; i < compatibilities_table.length; i++) {
      if(!newObject[compatibilities_table[i].id_tc]){
        newObject[compatibilities_table[i].id_tc]={};
      }
      newObject[compatibilities_table[i].id_tc][compatibilities_table[i].id_punto_control]=compatibilities_table[i].valor;
    }
    return newObject;
  }

  let valores_certificacion=[
    {
      "id_valor": 1,
      "descripcion": "No evaluado"
    },
    {
      "id_valor": 2,
      "descripcion": "Si"
    },
    {
      "id_valor": 3,
      "descripcion": "No"
    },
    {
      "id_valor": 4,
      "descripcion": "Certificado"
    }
  ];


  let tecnologias= [
    {
      "id_tc": 3,
      "descripcion": "IE9",
      "id_estado": 1,
      "fecha_alta": "2016-11-07T12:02:53.000Z"
    },
    {
      "id_tc": 4,
      "descripcion": "IE10",
      "id_estado": 1,
      "fecha_alta": "2016-11-07T12:02:53.000Z"
    },
    {
      "id_tc": 5,
      "descripcion": "IE11",
      "id_estado": 1,
      "fecha_alta": "2016-11-07T12:02:53.000Z"
    },
    {
      "id_tc": 6,
      "descripcion": "EDGE",
      "id_estado": 1,
      "fecha_alta": "2016-11-07T12:02:53.000Z"
    },
    {
      "id_tc": 7,
      "descripcion": "Firefox v50",
      "id_estado": 1,
      "fecha_alta": "2016-11-07T12:02:53.000Z"
    },
    {
      "id_tc": 8,
      "descripcion": "Chrome v54",
      "id_estado": 1,
      "fecha_alta": "2016-11-07T12:02:53.000Z"
    },
    {
      "id_tc": 9,
      "descripcion": "Android v6.0",
      "id_estado": 1,
      "fecha_alta": "2016-11-07T12:02:53.000Z"
    },
    {
      "id_tc": 10,
      "descripcion": "Android v6.0.1",
      "id_estado": 1,
      "fecha_alta": "2016-11-07T12:02:53.000Z"
    },
    {
      "id_tc": 11,
      "descripcion": "Android v7.0",
      "id_estado": 1,
      "fecha_alta": "2016-11-07T12:02:53.000Z"
    },
    {
      "id_tc": 12,
      "descripcion": "IOS",
      "id_estado": 1,
      "fecha_alta": "2016-11-07T12:02:53.000Z"
    }
  ];

  let tabla_compatibilidades_curso;

  function addTechnology(id_tc){
    for (let i = 0; i < puntos_control.length; i++) {
      compatibilities_table.push({
          "id_punto_control": puntos_control[i].id_punto_control,
          "id_tc": id_tc,
          "valor": 1,
          "fecha_validacion_proveedor": "",
          "fecha_validacion_CQA": null
      });
    }


    document.getElementsByTagName("table")[0].remove();
    genera_tabla();
  }


  document.getElementById("boton_add").addEventListener("click", function(){
    addTechnology(12);
  });

  function generaSelect(valor_defecto){
    var selectList = document.createElement("select");

    for (let i = 0; i < valores_certificacion.length; i++) {
      var option = document.createElement("option");
      option.value=valores_certificacion[i].id_valor;
      option.text=valores_certificacion[i].descripcion;
      option.selected=(valores_certificacion[i].id_valor===valor_defecto)?true:false;
      selectList.appendChild(option);
    }
    return selectList;

  }


  function genera_tabla() {

    var body = document.getElementsByTagName("body")[0];

    var tabla   = document.createElement("table");
    var tblBody = document.createElement("tbody");

    // Crea las celdas
    tabla_compatibilidades_curso=orderTableCertificacion();
    // Crea las hileras de la tabla

    var thead = document.createElement("thead");
    var tr_head = document.createElement("tr");
    tr_head.append(document.createElement("th"));



    for (let i = 0; i < puntos_control.length; i++) {
      let cabecera=document.createElement("th");
      cabecera.innerHTML=puntos_control[i].descripcion;
      tr_head.append(cabecera);
    }


    thead.append(tr_head);


    for(let prop in tabla_compatibilidades_curso) {
      var hilera = document.createElement("tr");
      var tecnologia = document.createElement("td");

      tecnologia.innerHTML=tecnologias.filter((x)=>{
        return x.id_tc==prop;
      })[0].descripcion;



      hilera.appendChild(tecnologia);
      tblBody.appendChild(hilera);



      for(let punto in tabla_compatibilidades_curso[prop]) {
        var celda = document.createElement("td");
        celda.append(generaSelect(tabla_compatibilidades_curso[prop][punto]));
        hilera.appendChild(celda);
      }



    }



    // agrega la hilera al final de la tabla (al final del elemento tblbody)

    // posiciona el <tbody> debajo del elemento <table>
    tabla.appendChild(tblBody);
    tabla.appendChild(thead);
    // appends <table> into <body>
    body.appendChild(tabla);
    // modifica el atributo "border" de la tabla y lo fija a "2";
    tabla.setAttribute("border", "1");
  }




  genera_tabla();
})()
