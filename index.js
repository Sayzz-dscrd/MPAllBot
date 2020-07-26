const Discord = require('discord.js');
const fs = require('fs');

const config = require('./config/config.json');
const activity = require('./config/activity.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();

fs.readdir("./commandes/", (err, files) => {

    if(err) console.log(err);

    let fichier = files.filter(f => f.split('.').pop() === "js");
    if(fichier.length <= 0) {
        return console.log("JS | Aucune commandes trouvée.");
    };

    fichier.forEach((f, i) => {
        let commandes = require(`./commandes/${f}`);
        console.log(`JS | Commandes ${f} chargée !`);
        client.commands.set(commandes.help.name, commandes);
    });

});

client.on('ready', () => {
    console.log(`${client.user.username}${"#" + client.user.discriminator} en ligne !`);
    client.user.setActivity("test", { type: "STREAMING", url: "https://twitch.tv/test"});
});

client.on('message', async message => {
    if (message.channel.type === "dm") return;
    if (message.author.bot) return;
    let prefixes = JSON.parse(fs.readFileSync("./config/prefixes.json", "utf8"));

    if(!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefixes: config.prefix
        }; 
    }

    let prefix = prefixes[message.guild.id].prefixes;
    if(message.mentions.users.has(client.user.id)) {message.channel.send(`Mon prefix sur se serveur est : \`${prefix}\``);};
    if (message.content.indexOf(prefix) !== 0) return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = client.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(client, message, args, prefix);
});

client.login(config.TOKEN);