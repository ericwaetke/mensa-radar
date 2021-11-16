// VERSION Late 2021

const { Composer, log, session } = require('micro-bot')
const bot = new Composer()

const Telegraf = require('telegraf')

const parseString = require('xml2js').parseString;
const request = require('request');

/* Lightweight Database init */ 
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)


var http = require("http");
setInterval(function() {
    http.get("https://speiseplan-api.herokuapp.com");
}, 300000); // every 5 minutes (300000)

// Sets global regex, so that there will always be the custom keyboard triggered
// if the user gives any input to the bot
const everything = new RegExp(/./g)

// The actual custom buttons
const buttonStrings = ["Speiseplan für Heute", "Speiseplan für Morgen"];
const option = {
    "parse_mode": "Markdown",
    "reply_markup": { "keyboard": [[buttonStrings[0]], [buttonStrings[1]]] }
};



//-------------------------------
var express            = require('express');
var app                = express();

//Express Gedöns
//For avoidong $PORT error
app.set('port', (process.env.PORT || 5060));

app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
    console.log('If micro-bot is not displaying a message below your connection may be disrupted');
});
//-------------------------------
bot.command('heute', function(ctx) {
    handleRequests(ctx);
});

bot.command('morgen', function(ctx) {
    handleRequests(ctx);
});

bot.command('filter', function(ctx){
    const testMenu = Telegraf.Extra
        .markdown()
        .markup((m) => m.inlineKeyboard([
            m.callbackButton('Vegetarier*in 🌽', 'vegetarisch'),
            m.callbackButton('Veganer*in 🍆', 'vegan'),
            m.callbackButton('Wurst 🌭', 'all')
    ]));

    ctx.reply('Bist du Vegetarier, veganer oder ist dir alles Wurst?', testMenu);

    bot.action('vegetarisch', function(ctx){
        ctx.reply('Deine Einstellungen wurden auf vegetarisch geändert.').then(() => {
            handleUserData(ctx);
        })
    })

    bot.action('vegan', function(ctx){
        ctx.reply('Deine Einstellungen wurden auf vegan geändert.').then(() => {
            handleUserData(ctx);
        })
    })

    bot.action('all', function(ctx){
        ctx.reply('Deine Einstellungen wurden zurückgesetzt auf alle Ergebnisse anzeigen.').then(() => {
            handleUserData(ctx);
        })
    })
});

bot.hears(everything, function(ctx) {
    handleRequests(ctx);
}); 

function handleRequests(ctx) {
    // Gets current user 
    var currentUser = ctx.message.from.username;
    var message     = ctx.update.message.text;
    if(currentUser === undefined){
        currentUser = ctx.message.from.id;
    }

    let found_user = db.get('user').find({'id': ctx.message.from.id}).value();
    console.log('Found user:', found_user);
    if(found_user === 'undefined') {
        db.get('user')
            .push({ id: ctx.message.from.id, preference: "all" })
            .write()
    }

    console.log('Sent Message: ' + message);

    // Sends data to Google Spreadsheets
    const currentDate = convertUnixTimestampToDate(ctx.message.date);
    commitUserDataToLocalDB(currentDate, currentUser, message);

    // Get commands
    var todayCommandList = ['/heute', 'heute', 'Heute', 'jetzt', 'Jetzt', 'today', 'Today'];
    var tomorrowCommandList = ['/morgen','morgen', 'Morgen', 'tomorrow', 'Tomorrow'];

    // Sets date adress
    let dateRef;
    var response = false;
    for (let i = 0; i < buttonStrings.length; i++){
        if(message === buttonStrings[i]){
            dateRef = i;
            response  = true;
        }
        else if (todayCommandList.includes(message)) {
            dateRef = 0;
            response  = true;
        }
        else if(tomorrowCommandList.includes(message)){
            dateRef = 1;
            response  = true;
        }
    }

    if(response) {
        request('http://xml.stw-potsdam.de/xmldata/ka/xmlfhp.php', function (error, response, body) {
            parseString(body, function (err, result) {
                if(result.hasOwnProperty('p')){
                    console.log('Database is temporary not responding')
                }
                if(result.menu.datum.length == 0){
                    console.log("Fatal error in FH XML database")
                }
                var day = result.menu.datum[dateRef];
                
                let userID = ctx.message.from.id;
                let user = db.get('user').find({'id': userID}).value();

                // Checks if the dataset for today is empty
                if(day.angebotnr === 'undefined' || day.angebotnr == undefined) {
                    ctx.telegram.sendMessage(ctx.message.chat.id, "Computer sagt nein. Für deine Anfrage liegen in der Mensa noch keine Daten vor, versuche es später noch einmal! 😉 Stattdessen gibt's erstmal eine Katze.", option);
                    ctx.replyWithPhoto('https://cataas.com/cat');
                    return;
                }

                var angebote = [];
                for (let i = 0; i < day.angebotnr.length; i++){
                    var ref = day.angebotnr[i];
                    var dataIsValid = !(ref.preis_s[0] == '');

                    if(ref.labels[0].length == 0) {
                        console.log("No Label provided — adding empty one")
                        
                        let emptyLabel = { label : { 0 : 'empty'}}

                        ref.labels[0] = emptyLabel;
                    }

                    console.log("LABELSCHECK", ref.labels[0])


                    if(dataIsValid) {
                        let titel = ref.titel
                        let beschreibung
                        let labels

                        if(ref.beschreibung == '.') {
                            beschreibung = "Angebot nicht mehr verfügbar"
                        } else {
                            beschreibung = ref.beschreibung
                        }

                        let labelRef = ref.labels[0].label[0].$

                        if(typeof labelRef === 'undefined') {
                            labelRef = { name : undefined }
                        }

                        labels = foodTypeChecker( labelRef.name)
                        
                        if (isEmpty(labels)) {
                            console.log("Label is not defined")
                            labels = ['']
                        }

                        angebote[i] = {
                            angebot: titel,
                            beschreibung: beschreibung,
                            // labels: foodTypeChecker(ref.labels[0].label[0].$.name)
                            labels: labels
                        }
                    } else {
                        angebote[i] = { angebot:'', beschreibung:'', labels: ''}
                    }
                }

                console.log("Alle Angebote: ", angebote);

                var parsedResponse = '';
                for (let i = 0; i < angebote.length; i++){
                    let labelsReference = angebote[i].labels[1];
                    console.log("Usercheck: " , user)
                    if(typeof user === 'undefined') {
                        console.log("User is not defined");
                        user = {
                            preference : "all"
                        }
                    }

                    if(labelsReference == user.preference && user.preference != 'all'){
                        parsedResponse += '*' + angebote[i].angebot + '*: ' + '\n' + angebote[i].beschreibung + '\n'  + angebote[i].labels[0] + '\n' 
                    }
                    if(user.preference == 'all'){
                        parsedResponse += '*' + angebote[i].angebot + '*: ' + '\n' + angebote[i].beschreibung + '\n'  + angebote[i].labels[0] + '\n' 
                    }
                    if(user.preference == 'vegetarisch'){
                        if(labelsReference == 'vegetarisch' || labelsReference == 'vegan'){
                            parsedResponse += '*' + angebote[i].angebot + '*: ' + '\n' + angebote[i].beschreibung + '\n'  + angebote[i].labels[0] + '\n' 
                        }
                    }
                }

                if(parsedResponse == ''){
                    ctx.telegram.sendMessage(ctx.message.chat.id, 'Schade heute scheint es nichts ' + user.preference + 'es in der Mensa zu geben. Salat gibt es aber immer!', option);
                    return;
                }

                ctx.telegram.sendMessage(ctx.message.chat.id, parsedResponse, option);
            });
        });
    } else {
        ctx.telegram.sendMessage(ctx.message.chat.id, "Für wann brauchst du den Speiseplan? 🍱", option);
    }
}

function foodTypeChecker(label){
    var vegetarisch = '🌽 - vegetarisch'
    var vegan = '🍆 - vegan';
    var gefluegel = '🐔 - mit Geflügel';
    var schweinefleisch = '🐖 - mit Schweinefleisch';
    var rindfleisch = '🐄 - mit Rindfleisch';
    var fisch = '🐟 - mit Fisch';
    var lamm  = '🐑 - mit Lamm';
  
    var returnValue = '';
    
    if(label == 'schweinefleisch') {
        return [schweinefleisch, 'all'];
    }
    if(label == 'vegetarisch') {
        return [vegetarisch, 'vegetarisch'];
    }
    if(label == 'gefluegel') {
        return [gefluegel, 'all'];
    }
    if(label == 'lamm') {
        return [lamm, 'all'];
    } 
    if(label == 'rindfleisch') {
        return [rindfleisch, 'all'];
    }
    if(label == 'fisch') {
        return [fisch, 'vegetarisch'];
    }
    if(label == 'vegan') {
        return [vegan, 'vegan'];
    }
    return returnValue;
}

function handleUserData(ctx) {
    let userID = ctx.update.callback_query.from.id;
    let user = db.get('user').find({'id': userID}).value();

    console.log("UserData", user);

    console.log("Searching for UserID: ", userID);

    /* Check if user has an Entry – if not create one, else update */
    if(typeof user === 'undefined') {
        console.log('Noch kein Eintrag in der Datenbank – Es wird einer erstellt');
        db.get('user')
            .push({ id: userID, preference: ctx.match })
            .write()
    } else {
        db.get('user').find({'id': userID}).set('preference', ctx.match)
            .write()
        console.log('User Data from ' + userID + ' updated to: ' + ctx.match + ' ✅');
    }
}

function commitUserDataToLocalDB (currentDate, usedUsername, usedCommand) {
    db.get('statistics').update('counter', n => n + 1)
      .write();
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}


function convertUnixTimestampToDate(unix_timestamp){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd < 10) {
        dd = '0'+dd
    } 

    if(mm < 10) {
        mm = '0'+mm
    } 

    today = dd + '.' + mm + '.' + yyyy;

    return today;
}

module.exports = bot