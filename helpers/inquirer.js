const inquirer = require('inquirer');
const colors = require('colors');

const menu_options = [{
    type: 'list',
    name: 'opcion',
    message: 'Seleccione una opcion: ',
    choices: [
        { value: 1, name: `${'1.'.green} Buscar ciudad.` },
        { value: 2, name: `${'2.'.green} Historial.` },
        { value: 0, name: `${'0.'.green} Salir.` }
    ]
}];

const menu = async() => {
    console.clear();
    console.log('========================='.cyan);
    console.log('     MENU DE OPCIONES     ');
    console.log('=========================\n'.cyan);
    const opt = await inquirer.prompt(menu_options);
    return opt.opcion;
}

const pausa = async() => {
    const question = [{
        type: 'input',
        name: 'enter',
        message: `\nPresione ${'ENTER'.green} para continuar...`
    }]
    await inquirer.prompt(question);
}

const leer_input = async(mensaje) => {
    const question = [{
        type: 'input',
        name: 'respuesta',
        message: mensaje,
        validate(value) {
            if (value.length === 0) {
                return 'Por favor, ingrese un valor';
            }
            return true;
        }
    }];
    const respuesta = await inquirer.prompt(question);
    return respuesta.respuesta;
}


const confirmar = async(pregunta) => {
    const question = [{
        type: 'confirm',
        name: 'confirmacion',
        message: pregunta,
    }];
    const respuesta = await inquirer.prompt(question);
    return respuesta.confirmacion;
}


const mostrar_ciudades = async(ciudades) => {
    let i = 0;
    const choices = ciudades.map((ciudad) => {
        i++
        return { value: ciudad.id, name: `${i}. `.green + ciudad.nombre };
    });
    choices.push({ value: '0', name: '0. '.green + 'CANCELAR' });

    const ciudades_list = [{
        type: 'list',
        name: 'ciudad_id',
        message: 'Seleccione un lugar: ',
        choices: choices
    }];

    const seleccion = await inquirer.prompt(ciudades_list);
    return seleccion.ciudad_id;
}




module.exports = { menu, pausa, leer_input, mostrar_ciudades, confirmar };