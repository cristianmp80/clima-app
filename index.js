const { menu, pausa, leer_input, mostrar_ciudades, confirmar } = require('./helpers/inquirer');
const Busqueda = require('./models/busquedas');


const main = async() => {
    const busqueda = new Busqueda();
    let opcion = 0;
    let lista_ciudades;
    let ciudad_id;
    do {
        opcion = await menu();
        switch (opcion) {
            case 1:
                const lugar = await leer_input("Introduce el nombre de la ciudad: ");
                lista_ciudades = await busqueda.ciudad(lugar);
                ciudad_id = await mostrar_ciudades(lista_ciudades);
                if (ciudad_id !== '0') {
                    const ciudad_seleccionada = lista_ciudades.find((c) => c.id === ciudad_id);
                    busqueda.agregarHistorial(ciudad_seleccionada);
                    const clima = await busqueda.clima(ciudad_seleccionada.latitud, ciudad_seleccionada.longitud);
                    info_clima(ciudad_seleccionada, clima);
                }
                break;
            case 2:
                lista_ciudades = busqueda.historial;
                ciudad_id = await mostrar_ciudades(lista_ciudades);
                if (ciudad_id !== '0') {
                    const ciudad_seleccionada = lista_ciudades.find((c) => c.id === ciudad_id);
                    const clima = await busqueda.clima(ciudad_seleccionada.latitud, ciudad_seleccionada.longitud);
                    info_clima(ciudad_seleccionada, clima);
                }
                break;
        }

        if (opcion !== 0) {
            await pausa();
        }

    } while (opcion !== 0);
    busqueda.guardarDB();
}


const info_clima = (lugar, info) => {
    console.clear();
    console.log('>>>> Información del clima <<<<\n'.bgCyan);
    console.log('Lugar: ' + `${lugar.nombre}`.cyan);
    console.log('Latitud: ' + `${lugar.latitud}`.cyan);
    console.log('Longitud: ' + `${lugar.longitud}`.cyan);
    console.log('Descripción: ' + `${info.descripcion}`.cyan);
    console.log('Temperatura: ' + `${info.temperatura} ºC`.cyan);
    console.log('Temperatura máxima: ' + `${info.temp_max} ºC`.cyan);
    console.log('Temperatura mínima: ' + `${info.temp_min} ºC`.cyan);
}


main();