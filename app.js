const TelegramBot = require('node-telegram-bot-api');


const axios = require('axios');
// replace the value below with the Telegram token you receive from @BotFather
const token = '985829962:AAGVNPbHf_YEHXXoJ61bE1jpJHXVmvS3sA8';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });



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

            var respuesta = `***Cambios Chaco***\n\n💸Dolar\nCompra: ${dolarCompra} Gs.| Venta: ${dolarVenta} Gs.\n`
            respuesta = respuesta + `💶Euro\nCompra: ${euroCompra} Gs. | Venta: ${euroVenta} Gs.\n\n`;
            respuesta = respuesta + `💵Peso Argentino\nCompra: ${pesoArgCompra} Gs. | Venta: ${pesoArgVenta} Gs.\n\n`;
            respuesta = respuesta + `💵Real\nCompra: ${realCompra} Gs. | Venta: ${realVenta} Gs.`;
            bot.sendMessage(chatId, respuesta);
            // console.log(response.data.explanation);
        })
        .catch(error => {
            console.log('Ocurrio un error');
            console.log(error);
        });

});


axios.get('/cotizaciones').then((response) => {
    console.log(response);
    response.send('ok');
}).catch((err) => {
    console.log(err);
});

// Listen for any kind of message. There are different kinds of
// messages.