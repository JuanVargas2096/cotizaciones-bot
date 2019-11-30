const TelegramBot = require('node-telegram-bot-api');
var port = 8443 || process.env.PORT;
var host = '0.0.0.0' || process.env.HOST;
const express = require('express');
const app = express();
const emoji = require('node-emoji');



const axios = require('axios');
// replace the value below with the Telegram token you receive from @BotFather
const token = '985829962:AAG6MVMw7_uHTty82XEzL6tUgZ9ho0JOWo4';
const options = {
    webhook: {
        port: port,
        host: host,
    },
    polling: true,
};

const opts = {
    parse_mode: 'Markdown',
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
    console.log('Se recibio una consulta a /dolarbot');
    const chatId = msg.chat.id;

    axios.get('http://www.cambioschaco.com.py/api/branch_office/1/exchange')
        .then((response) => {
            var dolar;
            var euro;
            var peso_arg;
            var real;
            var fechaHora = response.data.updateTs;
            console.log(fechaHora);


            var fechaFormateada = new Date(fechaHora);
            console.log(fechaFormateada.toString());
            var fechaHoraToSend = fechaFormateada.toString().split("GMT")[0].trim();
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

            var respuesta = `*CAMBIOS CHACO*\n\n${emoji.get('dollar')}${emoji.get('dollar')}*Dolar*\n*Compra*: ${dolarCompra.toLocaleString().replace(/,/g, '.')} Gs.| *Venta*: ${dolarVenta.toLocaleString().replace(/,/g, '.')} Gs.\n\n`;
            respuesta = respuesta + `${emoji.get('euro')}${emoji.get('euro')}*Euro*\n*Compra*: ${euroCompra.toLocaleString().replace(/,/g, '.')} Gs. | *Venta*: ${euroVenta.toLocaleString().replace(/,/g, '.')} Gs.\n\n`;
            respuesta = respuesta + `${emoji.get('money_with_wings')}${emoji.get('money_with_wings')}*Peso Argentino*\n*Compra*: ${pesoArgCompra.toLocaleString().replace(/,/g, '.')} Gs. | *Venta*: ${pesoArgVenta.toLocaleString().replace(/,/g, '.')} Gs.\n\n`;
            respuesta = respuesta + `${emoji.get('yen')}${emoji.get('yen')}*Real*\n*Compra*: ${realCompra.toLocaleString().replace(/,/g, '.')} Gs. | *Venta*: ${realVenta.toLocaleString().replace(/,/g, '.')} Gs.\n\n${emoji.get('date')}${emoji.get('hourglass_flowing_sand')}\n ${fechaHoraToSend}`;
            bot.sendMessage(chatId, respuesta, opts);
        })
        .catch(error => {
            console.log('Ocurrio un error');
            console.log(error);
            bot.sendMessage(chatId, 'Ocurrio un error. Favor intente de nuevo mas tarde.', opts);
        });

});




// Listen for any kind of message. There are different kinds of
// messages.

app.listen(port, () => {
    console.log('Escuchando en el puerto: ', port);
});