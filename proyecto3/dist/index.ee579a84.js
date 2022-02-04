function e(e){return e&&e.__esModule?e.default:e}var o,t=e(o=L).map("map").setView([43.0621,-2.43755],9);e(o).tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(t);var a="",n=e(o).icon({customId:"",iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]}),i=e(o).icon({customId:"",iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]});$("document").ready((function(){d=localStorage.getItem("iMaxMeteorologia")||5,document.getElementById("selectBaliza").value=d,function(e="test",o="test"){return $.ajax({type:"POST",dataType:"json",contentType:"application/json",url:"http://10.10.17.150/api/Users/Authenticate/",data:JSON.stringify({username:e,password:o}),headers:{accept:"application/json",dataType:"json",contentType:"application/json"}}).fail((function(e){console.log("ERROR: "+e)}))}().then((function(i){a=i.token,s=[],$.ajax({type:"GET",dataType:"html",url:"http://10.10.17.150/api/Meteorologia",headers:{accept:"application/json",authorization:"Bearer "+a}}).fail((function(e){console.log("ERROR: "+e)})).then((function(a){var i;JSON.parse(a).forEach((a=>{const i=e(o).marker([a.latitud,a.longitud],{icon:n,customId:`marker${a.codigo}`}).bindPopup(`${a.nombre}`).on("click",(function(){!function(e){for(const o in c)if(o==e)return!0;return!1}(a.codigo)&&Object.keys(c).length<d&&(c[a.codigo]={temperatura:!0,humedad:!0,velocidadViento:!1,presionAtmosferica:!1},m(c),p(i,a.codigo))})).addTo(t);s.push(i)})),i=localStorage.getItem("marcadores"),c=i=null==i?{}:JSON.parse(i);for(const e in c){let o;s.forEach((t=>{t.options.customId==`marker${e}`&&(o=t)})),p(o,e)}})),setInterval((function(){!function(){for(const e in c)c[e]&&u(e).then((function(o){oDato=JSON.parse(o),$(`#temperatura${e}`).text(`Temperatura: ${oDato.temperatura}`),$(`#humedad${e}`).text(`Humedad: ${oDato.humedad}`),$(`#presionAtmosferica${e}`).text(`Presion atmosferica: ${oDato.presionAtmosferica}`),$(`#velocidadViento${e}`).text(`Velocidad del viento: ${oDato.velocidadViento}`)}))}()}),6e3)})),$("#icono1").draggable({revert:"invalid",helper:"clone"}),$("#icono2").draggable({revert:"invalid",helper:"clone"}),$("#icono3").draggable({revert:"invalid",helper:"clone"}),$("#icono4").draggable({revert:"invalid",helper:"clone"})}));var r,c={},d=5,l=[],s=[];function p(e,o){e.setIcon(i),u(o).then((function(e){var t=JSON.parse(e);l.push(t),r=l.find((e=>e.codigo==o)),document.getElementById("cartas").innerHTML+=`\n              <div id="${o}" class="card text-white mb-3 " style="max-width: 18rem; background-color: dodgerblue">\n              <i class="bi bi-x boton" id="boton${o}"></i>\n              <div class="card-header"><h5>${r.nombre}</h5></div>\n              <div class="card-body">\n              <div>\n              <p id="temperatura${o}">Temperatura: ${r.temperatura}</p>\n              <p id="humedad${o}">Humedad: ${r.humedad}</p>\n              <p id="presionAtmosferica${o}">Presion atmosferica: ${r.presionAtmosferica}</p>\n              <p id="velocidadViento${o}">Velocidad del viento: ${r.velocidadViento}</p>\n              </div>              \n              </div>\n            `,$(".bi-x").on("click",(function(e){var o=$(e.target).attr("id");o=o.replace("boton",""),$(`#${o}`).remove(),delete c[o],m(c),s.forEach((e=>{if(e.options.customId==`marker${o}`){e.setIcon(n)}}))})),$(".card").droppable({drop:function(e,t){var a=t.draggable[0].id,n=$(e.target).attr("id");"icono2"==a&&($(`#presionAtmosferica${n}`).show(),c[o].presionAtmosferica=!0,m(c)),"icono4"==a&&($(`#velocidadViento${n}`).show(),c[o].velocidadViento=!0,m(c))}});var a=c[o];a.temperatura||$(`#temperatura${o}`).hide(),a.presionAtmosferica||$(`#presionAtmosferica${o}`).hide(),a.humedad||$(`#humedad${o}`).hide(),a.velocidadViento||$(`#velocidadViento${o}`).hide()}))}function m(e){localStorage.setItem("marcadores",JSON.stringify(e))}function u(e){return $.ajax({type:"GET",dataType:"html",url:"http://10.10.17.150/api/Meteorologia/"+e,headers:{accept:"application/json",authorization:"Bearer "+a}}).fail((function(e){console.log("ERROR: "+e)}))}$("#selectBaliza").on("change",(function(){d=parseInt(document.getElementById("selectBaliza").value),localStorage.setItem("iMaxMeteorologia",d)}));
//# sourceMappingURL=index.ee579a84.js.map
