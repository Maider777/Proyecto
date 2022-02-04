//importar librerias
import L from "leaflet";

//zoom
var zoom = 9;

//centrar el mapa
var map = L.map("map").setView([43.0621, -2.43755], zoom);

// añadir la imagen del mapa
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

//añadir url
const url = "http://10.10.17.150/api/";

//crear variable del Token
var sToken = "";

var aTotalBalizas;

//icono sin seleccionar
var iconoSinSeleccionar = L.icon({
  customId: "",
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

//icono seleccionado
var iconoSeleccionado = L.icon({
  customId: "",
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

//al cargar la pagina
$("document").ready(function () {
  //llamar a funcion de obtener el maximo de balizas, a traves del select
  obtenerMaxBaliza();

  //si la autentificacion devuelve true
  var promise = Login();
  //entonces hacer lo que esta dentro del then
  promise.then(function (result) {
    //llamar al login y guardar el token
    sToken = result.token;
    //console.log("TOKEN: " + sToken);
    ObtenerMeteorologias();
  });

  //convertir en draggable
  $(`#icono1`).draggable({
    revert: "invalid",
    helper: "clone",
  });

  $(`#icono2`).draggable({
    revert: "invalid",
    helper: "clone",
  });

  $(`#icono3`).draggable({
    revert: "invalid",
    helper: "clone",
  });

  $(`#icono4`).draggable({
    revert: "invalid",
    helper: "clone",
  });
});

//crear objeto de tipo set
var oMeteorologiasGuardadas = {};
//poner en el select un numero por defecto
var iNumMaxBalizas = 5;
//crear array datosTiempo
var aDatosTiempoBaliza = [];
//crear objeto datoActual
var oDatoActual;
//crear array para meter los marcadores
var aTotalMarcadores = [];

//dar valor de numero de balizas al localStorage
$("#selectBaliza").on("change", function () {
  iNumMaxBalizas = parseInt(document.getElementById("selectBaliza").value);
  localStorage.setItem("iMaxMeteorologia", iNumMaxBalizas);
  //console.log(iNumMaxBalizas);
});

//funcion de obtener las balizas de meteorologia
function ObtenerMeteorologias() {
  //crear array de marcadores
  aTotalMarcadores = [];
  //crear promesa
  var promise = GetMeteorologias();
  //si devuelve true, hacer lo del then
  promise.then(function (data) {
    //parsear y guardar todas las balizas en array
    aTotalBalizas = JSON.parse(data);
    //console.log("balizas:" + aTotalBalizas);
    //recorrer array de balizas
    aTotalBalizas.forEach((element) => {
      //dar a las balizas los markers y su customId
      const marker = L.marker([element.latitud, element.longitud], {
        icon: iconoSinSeleccionar,
        customId: `marker${element.codigo}`,
      })
        //mostrar nombre de pueblo
        .bindPopup(`${element.nombre}`)
        //al hacer click en el marcador
        .on("click", function () {
          //si la baliza no esta repetida y no sobrepasa el limite de balizas seleccionado
          if (!estaMeteorologia(element.codigo) && cantidadBalizasSeleccionadas() < iNumMaxBalizas) {
            //guardar la baliza en el objeto Set
            oMeteorologiasGuardadas[element.codigo] = {
              temperatura: true,
              humedad: true,
              velocidadViento: false,
              presionAtmosferica: false,
            };
            //guardar en el localStorage
            guardarDatosStorage(oMeteorologiasGuardadas);
            //llamar a funcion de mostrar carta
            mostrarCarta(marker, element.codigo);
          }
        })
        .addTo(map);
      //añadir marker al array
      aTotalMarcadores.push(marker);
    });
    //obtener localStorage
    oMeteorologiasGuardadas = obtenerDatosStorage();
    for (const codigo in oMeteorologiasGuardadas) {
      // Codigo = "Zi6355256"
      // oMeteorologias[Codigo] = {temperatura: true, humedad: true, velocidadViento: false, presionAtmosferica: false}
      let marker;
      //recorrer array de objetos
      aTotalMarcadores.forEach((element) => {
        //recorrer el id y se guarda el correspondiente
        if (element.options.customId == `marker${codigo}`) {
          marker = element;
        }
      });
      //mostrar carta
      mostrarCarta(marker, codigo);
    }
  });
  // Se inicia el cargado de los datos cada minuto
  setInterval(function () {
    actualizarDatos();
  }, 6000);
}

//funcion de mostrar los divs de las cartas
function mostrarCarta(marker, codigo) {
  //poner el icono como seleccionado
  marker.setIcon(iconoSeleccionado);
  //crear promesa
  var promise = GetMeteorologia(codigo);
  promise.then(function (data) {
    //si hace la promesa, entra en el then
    var infoBaliza = JSON.parse(data);
    aDatosTiempoBaliza.push(infoBaliza);
    //console.log("array:" + aDatosTiempoBaliza);
    oDatoActual = aDatosTiempoBaliza.find((item) => item.codigo == codigo);
    //añadir baliza a cartas y mostrar datos
    document.getElementById("cartas").innerHTML += `
              <div id="${codigo}" class="card text-white mb-3 " style="max-width: 18rem; background-color: dodgerblue">
              <i class="bi bi-x boton" id="boton${codigo}"></i>
              <div class="card-header"><h5>${oDatoActual.nombre}</h5></div>
              <div class="card-body">
              <div>
              <p id="temperatura${codigo}">Temperatura: ${oDatoActual.temperatura}</p>
              <p id="humedad${codigo}">Humedad: ${oDatoActual.humedad}</p>
              <p id="presionAtmosferica${codigo}">Presion atmosferica: ${oDatoActual.presionAtmosferica}</p>
              <p id="velocidadViento${codigo}">Velocidad del viento: ${oDatoActual.velocidadViento}</p>
              </div>              
              </div>
            `;
    //al hacer click en la x de la carta
    $(`.bi-x`).on("click", function (event) {
      // Elimina el div por el id del div
      var codigoCarta = $(event.target).attr("id");
      //console.log("codigoCarta:" + codigoCarta);
      codigoCarta = codigoCarta.replace("boton", "");
      //eliminar carta
      $(`#${codigoCarta}`).remove();
      //eliminar del array
      delete oMeteorologiasGuardadas[codigoCarta];
      //guardar en el Storage
      guardarDatosStorage(oMeteorologiasGuardadas);
      //console.log(oMeteorologiasGuardadas);
      // Buscamos el marcador por su customId
      aTotalMarcadores.forEach((element) => {
        // Recorremos los Id y se guarda el correspondiente
        if (element.options.customId == `marker${codigoCarta}`) {
          let markerBorrar = element;
          //poner marker a iconoSinSeleccionar
          markerBorrar.setIcon(iconoSinSeleccionar);
        }
      });
    });

    // Añadir Drag & Drop al panel meteorologico
    $(".card").droppable({
      drop: function (event, ui) {
        //crear el draggable del icono
        var draggableId = ui.draggable[0].id;
        //console.log("id:" + draggableId);
        //coger el codigo de la carta
        var codigoCarta = $(event.target).attr("id");
        if (draggableId == "icono2") {
          //si es el mismo, mostrar
          $(`#presionAtmosferica${codigoCarta}`).show();
          //poner el atributo del objeto a true
          oMeteorologiasGuardadas[codigo]["presionAtmosferica"] = true;
          //guardar en Storage
          guardarDatosStorage(oMeteorologiasGuardadas);
        }
        if (draggableId == "icono4") {
          //si es el mismo, mostrar
          $(`#velocidadViento${codigoCarta}`).show();
          //poner el atributo del objeto a true
          oMeteorologiasGuardadas[codigo]["velocidadViento"] = true;
          //guardar en Storage
          guardarDatosStorage(oMeteorologiasGuardadas);
        }
      },
    });
    var balizaActual = oMeteorologiasGuardadas[codigo];
    //console.log("balizaActual:" + balizaActual);
    //ocultar la info de las balizas
    if (!balizaActual["temperatura"]) $(`#temperatura${codigo}`).hide();
    if (!balizaActual["presionAtmosferica"]) $(`#presionAtmosferica${codigo}`).hide();
    if (!balizaActual["humedad"]) $(`#humedad${codigo}`).hide();
    if (!balizaActual["velocidadViento"]) $(`#velocidadViento${codigo}`).hide();
  });
}

//funcion para actualizar los datos de las balizas
function actualizarDatos() {
  //buscar codigo de las balizas guardadas
  for (const codigo in oMeteorologiasGuardadas) {
    if (oMeteorologiasGuardadas[codigo]) {
      //hacer promesa
      var promise = GetMeteorologia(codigo);
      promise.then(function (respuesta) {
        //parsear dato
        oDato = JSON.parse(respuesta);
        //actualizar datos
        $(`#temperatura${codigo}`).text(`Temperatura: ${oDato.temperatura}`);
        $(`#humedad${codigo}`).text(`Humedad: ${oDato.humedad}`);
        $(`#presionAtmosferica${codigo}`).text(`Presion atmosferica: ${oDato.presionAtmosferica}`);
        $(`#velocidadViento${codigo}`).text(`Velocidad del viento: ${oDato.velocidadViento}`);
      });
    }
  }
}

//funcion de obtener el maximo de balizas
function obtenerMaxBaliza() {
  //si el valor es nulo, sera 5, sino, su valor
  iNumMaxBalizas = localStorage.getItem("iMaxMeteorologia") || 5;
  //dar valor
  document.getElementById("selectBaliza").value = iNumMaxBalizas;
}

//funcion de guardar el localStorage
function guardarDatosStorage(balizas) {
  localStorage.setItem("marcadores", JSON.stringify(balizas));
}

//funcion para obtener los datos del localStorage
function obtenerDatosStorage() {
  var marcadoresStorage = localStorage.getItem("marcadores");
  if (marcadoresStorage == undefined) {
    //si es indefinido, poner array a vacio
    marcadoresStorage = {};
  } else {
    //parsear
    marcadoresStorage = JSON.parse(marcadoresStorage);
  }
  return marcadoresStorage;
}

//funcion para ver si esta la baliza o no
function estaMeteorologia(codigo) {
  for (const codigoMeteorologia in oMeteorologiasGuardadas) {
    if (codigoMeteorologia == codigo) {
      return true;
    }
  }
  return false;
}

//funcion para obtener la cantidad de balizas guardadas
function cantidadBalizasSeleccionadas() {
  return Object.keys(oMeteorologiasGuardadas).length;
}

//funcion de login
function Login(user = "test", password = "test") {
  return $.ajax({
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    url: url + "Users/Authenticate/",
    data: JSON.stringify({
      username: user,
      password: password,
    }),
    headers: {
      accept: "application/json",
      dataType: "json",
      contentType: "application/json",
    },
  }).fail(function (err) {
    console.log("ERROR: " + err);
  });
}

//funcion para obtener las balizas de meteorologia
function GetMeteorologias() {
  return $.ajax({
    type: "GET",
    dataType: "html",
    url: url + "Meteorologia",
    headers: {
      accept: "application/json",
      //le pasamos el token para la autentificacion
      authorization: "Bearer " + sToken,
    },
  }).fail(function (err) {
    console.log("ERROR: " + err);
  });
}

//funcion para obtener la baliza de meteorologia
function GetMeteorologia(id) {
  //console.log("ID " + id);
  return $.ajax({
    type: "GET",
    dataType: "html",
    url: url + "Meteorologia/" + id,
    headers: {
      accept: "application/json",
      //le pasamos el token para la autentificacion
      authorization: "Bearer " + sToken,
    },
  }).fail(function (err) {
    console.log("ERROR: " + err);
  });
}
