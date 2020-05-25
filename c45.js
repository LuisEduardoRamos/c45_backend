const csv = require('csvtojson');
const _ = require('lodash');
let iteracion = 0;
let arbolArray = [];
let iteracionArray = [];
let iteracionObject = new Object();
let entropiasArray = [];
let relacionTemporal = null;


function calcularEntropia(datos, clase){
    let total = datos.length;
    let tipos = _.uniqBy(datos, clase);
    let grupos = _.groupBy(datos, clase);
    let tiposArray = [];
    let entropiaClase = 0;
    //Extrae los datos de la clase, sin repetir
    for (let i = 0; i < tipos.length; i++) {
        let json =  tipos[i];
        tiposArray.push(json[clase]);
    }
    //Se calcula la entropía iterando las opciones
    for (let i = 0; i < tiposArray.length; i++) {
        //grupos es un arreglo donde se encuentran todos los datos agrupados por las opciones de la clase
        let cantidadTipos = grupos[tiposArray[i]].length;
        let relacion = cantidadTipos / total;
        entropiaClase += entropia(relacion);
    }
    return entropiaClase;
}

function entropia(relacion){
    return ((relacion) * Math.log2(relacion) * -1);
}


function agruparDatos(datos){
    //Se extren las cabeceras del csv, en este caso pasan a ser las llaves del objeto
    let cabeceras = Object.keys(datos[0]);
    return cabeceras.map((cabecera)=>({
       [cabecera]: _.groupBy(datos, cabecera)
    }));
}

function c45(){

}

function print(title, body){console.log(title+': '+body);}

async function main(ruta, claseDecision){
    //Se obtienen los datos del csv y se parsean a JSON
    let json = await csv().fromFile(ruta);
    c45(json, claseDecision);
    console.log(iteracionArray)
}