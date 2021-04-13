require('dotenv').config();
const axios = require("axios");
const fs = require('fs');
const db = './db/data.json';

class Busqueda {


    constructor() {
        //Leer DB si existe
        if (fs.existsSync(db)) {
            this.historial = JSON.parse(fs.readFileSync(db, { encoding: 'utf-8' }));
        } else {
            this.historial = [];
        }
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }


    get paramsOpenweather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }



    async ciudad(lugar = '') {
        const axios_instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
            params: this.paramsMapbox
        });

        try {
            const resp = await axios_instance.get();
            return resp.data.features.map((ciudad) => {
                return {
                    id: ciudad.id,
                    nombre: ciudad.place_name,
                    longitud: ciudad.center[0],
                    latitud: ciudad.center[1]
                }
            });
        } catch (err) {
            return null;
        }
    }


    async clima(lat, lon) {
        const axios_instance = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather`,
            params: { 'lat': lat, 'lon': lon, ...this.paramsOpenweather }
        });

        try {
            const resp = await axios_instance.get();
            return {
                descripcion: resp.data.weather[0].description,
                temperatura: resp.data.main.temp,
                temp_max: resp.data.main.temp_max,
                temp_min: resp.data.main.temp_min
            }
        } catch (err) {
            return {
                descripcion: '',
                temperatura: '',
                temp_max: '',
                temp_min: ''
            };
        }
    }


    agregarHistorial(lugar) {
        if (!this.historial.find((l) => l.id === lugar.id)) {
            if (this.historial.length === 6) {
                this.historial.pop();
            }
            this.historial.unshift(lugar);
        }
    }


    guardarDB() {
        fs.writeFileSync(db, JSON.stringify(this.historial));
    }


}


module.exports = Busqueda;