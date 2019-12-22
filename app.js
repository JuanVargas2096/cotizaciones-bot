const TelegramBot = require('node-telegram-bot-api');
var host = '0.0.0.0' || process.env.HOST;
const emoji = require('node-emoji');



const axios = require('axios');
// replace the value below with the Telegram token you receive from @BotFather
const token = '985829962:AAG6MVMw7_uHTty82XEzL6tUgZ9ho0JOWo4';
const options = {
    polling: true,
};

const opts = {
    parse_mode: 'Markdown',
};
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, options);



bot.onText(/\/start/, (msg, match) => {
    console.log('Se recibio una consulta a /start');
    const chatId = msg.chat.id;
    var respuesta = "To get the currency values please tap: \n\n*/dolarbot*\n";
    bot.sendMessage(chatId, respuesta, opts);
});

// Matches "/dolarbot [whatever]"
bot.onText(/\/dolarbot/, (msg) => {
    // 'msg' is the received Message from Telegram

    console.log('Se recibio una consulta a /dolarbot');
    const chatId = msg.chat.id;



    try {

        var respuesta = obtenerCotizaciones().then((cotizaciones) => {
            console.log('cotizaciones: ', cotizaciones);
            console.log('Seria lindo que funcione vd?');
            if (!cotizaciones.ok) {
                bot.sendMessage(chatId, 'Ocurrio un error indeterminado. Favor intente nuevamente mas tarde.', opts)
            }
            var dolar = cotizaciones.data.dolar;
            var euro = cotizaciones.data.euro;
            var peso_arg = cotizaciones.data.pesoArg;
            var real = cotizaciones.data.real;
            var fechaHora = cotizaciones.data.fecha;
            console.log('Fecha de actualizacion', fechaHora);

            console.log('peso argentino', peso_arg);


            var pesoArgCompra = peso_arg.pesoArgCompra;
            var pesoArgVenta = peso_arg.pesoArgVenta;

            var euroCompra = euro.euroCompra;
            var euroVenta = euro.euroVenta;

            var dolarCompra = dolar.dolarCompra;
            var dolarVenta = dolar.dolarVenta;

            var realCompra = real.realCompra;
            var realVenta = real.realVenta;

            console.log('Peso Arg compra: ', pesoArgCompra);

            console.log('Peso Arg venta: ', pesoArgVenta);



            var respuesta = `*CAMBIOS CHACO*\n\n${emoji.get('dollar')}${emoji.get('dollar')} *Dolar*\n*Compra*: ${dolarCompra.toLocaleString().replace(/,/g, '.')} Gs.| *Venta*: ${dolarVenta.toLocaleString().replace(/,/g, '.')} Gs.\n\n`;
            respuesta = respuesta + `${emoji.get('euro')}${emoji.get('euro')} *Euro*\n*Compra*: ${euroCompra.toLocaleString().replace(/,/g, '.')} Gs. | *Venta*: ${euroVenta.toLocaleString().replace(/,/g, '.')} Gs.\n\n`;
            respuesta = respuesta + `${emoji.get('money_with_wings')}${emoji.get('money_with_wings')} *Peso Argentino*\n*Compra*: ${pesoArgCompra.toLocaleString().replace(/,/g, '.')} Gs. | *Venta*: ${pesoArgVenta.toLocaleString().replace(/,/g, '.')} Gs.\n\n`;
            respuesta = respuesta + `${emoji.get('yen')}${emoji.get('yen')} *Real*\n*Compra*: ${realCompra.toLocaleString().replace(/,/g, '.')} Gs. | *Venta*: ${realVenta.toLocaleString().replace(/,/g, '.')} Gs.\n\n${emoji.get('date')}${emoji.get('hourglass_flowing_sand')}\n ${fechaHora}`;
            bot.sendMessage(chatId, respuesta, opts)
        }, (err) => {
            console.log(err);
            bot.sendMessage(chatId, 'Ocurrio un error indeterminado. Favor intente nuevamente mas tarde.', opts)
        });





    } catch (error) {
        console.log(error);

    }


});


function formatDate(date) {
    var monthNames = [
        "Enero", "Febrero", "Marzo",
        "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre",
        "Noviembre", "Diciembre"
    ];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return day + '/' + monthNames[monthIndex] + '/' + year;
};

let getCotizaciones = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://www.cambioschaco.com.py/api/branch_office/1/exchange')
            .then((response) => {
                var dolar;
                var euro;
                var peso_arg;
                var real;
                var fechaHora = response.data.updateTs;
                console.log(fechaHora);


                var fechaFormateada = new Date(fechaHora);

                var fechaHoraToSend = formatDate(fechaFormateada);
                console.log(fechaHoraToSend);
                response.data.items.forEach(element => {
                    if (element.isoCode === 'USD') {
                        dolar = element;

                    }
                    if (element.isoCode === 'EUR') {
                        euro = element;
                    }

                    if (element.isoCode === 'ARS') {
                        peso_arg = element;
                    }
                    if (element.isoCode === 'BRL') {
                        real = element;
                    }
                });

                var pesoArgCompra = peso_arg.purchasePrice;
                var pesoArgVenta = peso_arg.salePrice;

                var euroCompra = euro.purchasePrice;
                var euroVenta = euro.salePrice;

                var dolarCompra = dolar.purchasePrice;
                var dolarVenta = dolar.salePrice;

                var realCompra = real.purchasePrice;
                var realVenta = real.salePrice;

                console.log('Dolar compra', dolarCompra);
                console.log('Dolar venta', dolarVenta);

                resolve({
                    ok: true,
                    message: 'Exito',
                    data: {
                        dolar: {
                            dolarCompra: dolarCompra,
                            dolarVenta: dolarVenta
                        },
                        euro: {
                            euroCompra: euroCompra,
                            euroVenta: euroVenta
                        },
                        pesoArg: {
                            pesoArgCompra: pesoArgCompra,
                            pesoArgVenta: pesoArgVenta
                        },
                        real: {
                            realCompra: realCompra,
                            realVenta: realVenta
                        },
                        fecha: fechaHoraToSend

                    }
                });

            }).catch(error => {
                console.log('Ocurrio un error');
                console.log(error);

                reject({
                    ok: false,
                    message: 'Ocurrio un error',
                    data: {}
                });

            });
    });


}




let obtenerCotizaciones = async() => {
    let cotizacion = await getCotizaciones();
    console.log('cotizacion', cotizacion);

    return cotizacion;
}