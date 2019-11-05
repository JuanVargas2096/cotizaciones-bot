const TelegramBot = require('node-telegram-bot-api');
var port = 8443 || process.env.PORT;
var host = '0.0.0.0' || process.env.HOST;
const express = require('express');
const app = express();



const axios = require('axios');
// replace the value below with the Telegram token you receive from @BotFather
const token = '985829962:AAGVNPbHf_YEHXXoJ61bE1jpJHXVmvS3sA8';
const options = {
    webhook: {
        port: port,
        host: host,
    },
    polling: true,
};
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, options);

app.get('/', (req, res) => {
    res.json({
        ok: true
    });
});

// Matches "/dolarbot [whatever]"
bot.onText(/\/dolarbot/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;

    axios.get('http://www.cambioschaco.com.py/api/branch_office/1/exchange')
        .then((response) => {
            var dolar;
            var euro;
            var peso_arg;
            var real;

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
            //console.log('Fecha de actualizacion', fechaUpdateDolar);

            //var fechasSeparadas = fechaUpdateDolar.split('T');

            var respuesta = `Cambios Chaco\n\n💸Dolar\nCompra: ${dolarCompra} Gs.| Venta: ${dolarVenta} Gs.\n\n`
            respuesta = respuesta + `💶Euro\nCompra:${euroCompra} Gs. | Venta: ${euroVenta} Gs.\n\n`;
            respuesta = respuesta + `💵Peso Argentino\nCompra: ${pesoArgCompra} Gs. | Venta: ${pesoArgVenta} Gs.\n\n`;
            respuesta = respuesta + `💵Real\nCompra: ${realCompra} Gs. | Venta: ${realVenta} Gs.`;
            bot.sendMessage(chatId, respuesta);
        })
        .catch(error => {
            console.log('Ocurrio un error');
            console.log(error);
        });

});




// Listen for any kind of message. There are different kinds of
// messages.

app.listen(port, () => {
    console.log('Escuchando en el puerto: ', port);
});