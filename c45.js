const _ = require('lodash');
let iteracion = 0;
let iteracionArray = [];
let iteracionObject = new Object();
let entropiasArray = [];
let relacionTemporal = null;

function c45(dataset, claseDecision){
    iteracionObject = {};        
    iteracion+=1;
    let entropiaMenor = 1;
    let entropiaGo = calcularEntropia(dataset, claseDecision);
    let claseSeleccionada = '';
    let data = agruparDatos(dataset);
    let total = dataset.length;
    let entropias = [];
    const clases = Object.keys(dataset[0]);
    iteracionObject.iteracion = iteracion;
    iteracionObject.entropiaGlobal = entropiaGo;
    if(relacionTemporal){
        iteracionObject.relacion = relacionTemporal;
        relacionTemporal = null;
    }
    for (let i = 0; i < data.length; i++) {
        const nombreClase = clases[i];
        if (nombreClase === claseDecision)break;
        const clase = data[i];
        const dataClase  = clase[nombreClase];
        const opciones = Object.keys(dataClase);
        let entropiaParcial = 0;
        //Sumarización
        for (let j = 0; j < opciones.length; j++) {
            let sub = dataClase[opciones[j]];
            let entropySub = calcularEntropia(sub, claseDecision);
            let x = (sub.length/total) * entropySub;
            entropiaParcial += x;
            if(entropiaGo == 0) {
                let hoja = sub[0];
                iteracionObject.desicionFinal = hoja[claseDecision];
                return;
            }
        }
        entropiasArray.push({clase: nombreClase, entropia: entropiaParcial});
        if(entropiaParcial < entropiaMenor){
            entropiaMenor = entropiaParcial;
            claseSeleccionada = nombreClase;
        }
        let entropiaObject = {[nombreClase]:entropiaParcial};
        entropias.push(entropiaObject);
    }
    const index = clases.indexOf(claseSeleccionada);
    const dataSelecArray = data.splice(index, 1);
    const dataSelecObj = dataSelecArray[0];
    const dataSelecKeys = Object.keys(dataSelecObj[claseSeleccionada]);
    const dataSelec = dataSelecObj[claseSeleccionada];
    iteracionObject.hijosGanadora = dataSelecKeys;
    iteracionObject.entropias = entropiasArray;
    entropiasArray = [];
    for (let i = 0; i < dataSelecKeys.length; i++) {
        let datosNuevos = dataSelec[dataSelecKeys[i]]
        relacionTemporal = dataSelecKeys[i] + ' -(hijo)-> ' + claseSeleccionada;
        iteracionObject.claseGanadora = claseSeleccionada;
        iteracionArray.push(iteracionObject);
        c45(datosNuevos, claseDecision);
    }

}

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

function print(title, body){console.log(title+': '+body);}


module.exports = async (json, claseDecision) => {
    //Se obtienen los datos del csv y se parsean a JSON
    c45(json, claseDecision);
    return (iteracionArray);
}

//main('datos/datosArbol-3.csv','Decision');
//main('datos/banco.csv','class');
//main("datos/datosArbol-4.csv","play")