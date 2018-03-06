const Discord = require('discord.js');
const bot = new Discord.Client();
//Discord bot as a new client
var logger = require('winston');
//logger
const fs = require("fs");
const libgen = require('libgen');
var auth = require('./auth.json');

var opts = {
    count: 1,
    mirror: 'http://gen.lib.rus.ec'
};

//logger configuration
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
});

//bot configuration and logging in
bot.on('ready', function() {
    bot.user.setActivity("nLab");
})
bot.login(auth.token);

bot.on("message", (message) => {

    const prefix = auth.prefix;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!message.content.startsWith(auth.prefix)) return;

    if (message.content.startsWith(auth.prefix + command)) {

       // logger.info("command : " + command + " args[0] : " + args[0] + " args[1] : " + args[1]); //for test
        switch (command) {
            
        /* help
        // v 1.0.0 nothing yet
        */
            case "help": {

                logger.info("userName : " + message.author.username + " ( " + message.author.id + " ) used " + command);
                message.channel.send('work in progress');
                return;

            }
            
        /* prefix configuration 
        // v 1.0.0 - somehow authorization fails. Still works but needs authorization.
        // -> problem solved : not UserName use UserID , 
        */
            case "prefix": {
             
             logger.info("userName : " + message.author.username + " ( " + message.author.id + " ) used " + command);

             if (message.author.id !== auth.authID) 
                 message.channel.send('Authorization needed.')
             logger.warn('Unauthorized approach : ' + message.author.username + ' - ( '  + message.author.id + ')');
             return;

            let newPrefix = args[0];
            auth.prefix = newPrefix;

            fs.writeFile("./auth.json", JSON.stringify(auth), (err) => console.error);
            logger.info('Prefix changed to : ' + auth.prefix);
            }

        /* random book grabbing function
        // v 1.0.0 - no argument values, just random text
        //
        */
            case "random": {

               logger.info("userName : " + message.author.username + " ( " + message.author.id + " ) used " + command);

               if (args[0] === undefined) {
                   opts.count = 1;
                   //logger.info("somebody used random with 0 args");
               }

               if (args[0] !== undefined) {
                   opts.count = args[0];
                   //logger.info("somebody used random with args : " + opts.count);
               }

            libgen.random.text(opts, (err, data) => {
                if (err)
                    return (err);
                
                let n = data.length;
                message.channel.send(n + ' random text(s)! :) ' + '<@' + message.author.id + '>' + '\n');

                while (n--) {
                    //message.channel.send('**Book #' + (data.length-n+1) + '**');
                    //message.channel.send('Title: ' + data[n].title + '\n');
                    //message.channel.send('Author: ' + data[n].author + '\n');
                    //message.channel.send('Download: ' + 'http://gen.lib.rus.ec/book/index.php?md5=' + data[n].md5.toLowerCase() + '\n');
                    message.channel.send({
                        embed: {
                            color: 3447003,
                            author: {
                                name: bot.user.username,
                                icon_url: bot.user.avatarURL
                            },
                            title: "**Book #" + (data.length - n) + "**",
                            fields: [{
                                name: "Title",
                                value: data[n].title
                            },
                            {
                                name: "Author",
                                value: data[n].author
                            },
                            {
                                name: "Download",
                                value: 'http://gen.lib.rus.ec/book/index.php?md5=' + data[n].md5.toLowerCase()
                            }
                            ],
                            timestamp: new Date(),
                            footer: {
                                icon_url: bot.user.avatarURL,
                                text: "© LibGenBot"
                            }
                        }

                    }
                        );
                }

            })
        }
    }
    }
})