import L from 'leaflet';
import { marker } from 'leaflet';

// objeto de las ciudades con los datos
let aCiudades = [
    { name: "Irun", value: "IRUN", lat: "43.338230", long: "-1.789270" },
    { name: "Donostia/San Sebastián", value: "DONOSTIA/SAN SEBASTIÁN", lat: "43.320900", long: "-1.984520" },
    { name: "Errenteria", value: "ERRENTERIA", lat: "43.311298", long: "-1.900890" },
    { name: "Hondarribia", value: "HONDARRIBIA", lat: "43.362530", long: "-1.791500" }]; 

var zoom = 11;
var map = L.map('map').setView([43.3125271, -1.8986133], zoom);
var miSet = new Set();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); //para añadir el titulo cuando le clicas a un marcador que te salga el nombre

// cuando le clices a uno de los marcadores que te aparezca la respectibla tabla de esa ciudad con los empleos
aCiudades.forEach(element => {
    const marker = L.marker([element.lat, element.long])
        .bindPopup(element.name)
        .addTo(map)
        .on("click", function click() {
            if (miSet.has(element.name)) {
                alert("Ya tienes la pestaña abierta");

            } else {
                miSet.add(element.name);
                GenerarTablaFiltrada(element.name);
                document.getElementById("nav-tab").innerHTML += `<button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="${element.name}" aria-selected="true">${element.name}&nbsp;<a class="btn-close"></a></button>`;
               

                document.querySelectorAll('.btn-close').forEach((item) => {
                    item.addEventListener('click', (ev) => {
                        const details = ev.target.parentElement.getAttribute('aria-controls');
                        console.log(details);
                        ev.target.parentElement.remove();
                        console.log(`tabla${details}`);
                        console.log(document.getElementById(`tabla${details.toUpperCase()}`));
                        document.getElementById(`tabla${details.toUpperCase()}`).remove();
                        //console.log(miSet.has(item[0]));
                        miSet.delete(item[0]);

                    });
                });
            }
        });

});
    
// funcion para centrar a la ubicacion cuando le das clic al boton
document.getElementById("btnCentrar").addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(function (pos) {

        //Si es aceptada guardamos lo latitud y longitud
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        map.setView([lat, lon], 16);
    });
});

var aOfertas = JSON.parse(sOfertas); //el parseo a un array

// funcion para general la tabla de cada municipio con las fechas ordenadas por descendencia
function GenerarTablaFiltrada(sMunicipio) {

    var aOfertasMunicipio = aOfertas.filter(element => element.municipio == sMunicipio.toUpperCase()).sort(
        (a, b) =>
            (new Date(b.fecPub.split("/")[2] + "/" + b.fecPub.split("/")[1] + "/" + b.fecPub.split("/")[0])) -
            (new Date(a.fecPub.split("/")[2] + "/" + a.fecPub.split("/")[1] + "/" + a.fecPub.split("/")[0])));
    document.getElementById("container").innerHTML = "";
    GenerarTabla(aOfertasMunicipio);

}

// Funcion que genera una tabla en el HTML
function GenerarTabla(aTabla) {

    let sTabla = [];

    sTabla.push(`<br><div class="container" id="tabla${aTabla[0].municipio}">`);
    sTabla.push(' <div class="row">');
    sTabla.push(' <div class="col">EMPLEO</div>');
    sTabla.push(' <div class="col">DESCRIPCION</div>');
    sTabla.push(' <div class="col">FECHA</div>');
    sTabla.push(' <div class="col">URL</div>');
    sTabla.push('</div>');

    aTabla.forEach(Oferta => {
        sTabla.push('<div class="row">');
        sTabla.push(`<div class="col">${Oferta.desEmpleo.toUpperCase()}</div>`);
        sTabla.push(`<div class="col">${Oferta.desPuesto.toUpperCase()}</div>`);
        sTabla.push(`<div class="col">${Oferta.fecPub.toUpperCase()}</div>`);
        sTabla.push(`<div class="col"><a href="${Oferta.url}">Link</a></div>`);
        sTabla.push('</div>');

    });
    sTabla.push('</div>');
    document.getElementById('container').innerHTML += sTabla.join(" ");
}