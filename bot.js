const { Client, MessageEmbed } = require('discord.js');
const bot = new Client();

//Discord bot as a new client
const logger = require('winston');

//logger
const libgen = require('libgen');
const auth = require('./auth.json');

const mirror = 'http://gen.lib.rus.ec';

//logger configuration
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });
logger.level = 'debug';

bot.on('ready', function (evt) {
    logger.info(`Connected as ${bot.user.username}`);
});

bot.login(auth.token);

bot.on("message", async (message) => {
    const prefix = auth.prefix;

    if (!message.content.startsWith(auth.prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'help') {
        logger.info("userName : " + message.author.username + " ( " + message.author.id + " ) used " + command);
        message.channel.send('work in progress');
        return;
    }

    if (command === 'random') {
        logger.info("userName : " + message.author.username + " ( " + message.author.id + " ) used " + command);

        libgen.random.text(1, (err, data) => {
            if (err) return err;

            const { title, author, md5 } = data[0];
            message.reply('Here is a random thingamajig');

            while (n--) {
                const embed = new MessageEmbed()
                    .setColor(3447003)
                    .setAuthor(bot.user.username, bot.user.avatarURL)
                    .setTitle(`Random Book`)
                    .addField('Title', title)
                    .addField('Author', author)
                    .addField('Download', `${mirror}/book/index.php?md5=` + md5.toLowerCase())
                    .setTimestamp(new Date())
                    .setFooter("© LibGenBot", bot.user.avatarURL);

                message.channel.send(embed)
            }
        })
    }

    if (command === 'get') {
        const options = {
            mirror: 'http://gen.lib.rus.ec',
            query: args[0],
            count: 3,
            sort_by: 'year',
            reverse: true
        }
        
        const books = await libgen.search(options);

        for (const [index, book] of books.entries()) {
            const { title, author, md5 } = book;
            const link = `${mirror}/book/index.php?md5=${md5.toLowerCase()}`;

            const embed = new MessageEmbed()
                .setColor(3447003)
                .setAuthor(bot.user.username, bot.user.avatarURL)
                .setTitle(`Book #${index + 1}`)
                .addField('Title', title)
                .addField('Author', author)
                .addField('Download', link)
                .setTimestamp(new Date())
                .setFooter("© LibGenBot", bot.user.avatarURL);

            message.channel.send(embed)
        }
    }
})