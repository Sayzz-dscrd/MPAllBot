const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async (client, message, args, prefix) => {

    let prefixes = JSON.parse(fs.readFileSync("./config/prefixes.json", "utf8"));

    let permission = new Discord.MessageEmbed()
		.setTitle('Prefix')
		.setDescription('Vous n\'avez pas la permission "MANAGE_GUILD"')
		.setColor("#36ffab")
    
    let error = new Discord.MessageEmbed()
        .setAuthor('Prefix')
        .setDescription(`Utilisation: ${prefixes[message.guild.id].prefixes}prefix <Nouveau Prefix>`)
        .setColor("#b00c0f")
        
    if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(permission);
    if(!args[0]) return message.channel.send(error);

    

    prefixes[message.guild.id] = {
        prefixes: args[0]
    };

    fs.writeFile("./config/prefixes.json", JSON.stringify(prefixes, null, "\t"), (err) => {
        if(err) console.log(err);
    });

    let sEmbed = new Discord.MessageEmbed()
        .setTitle("Prefix")
        .setDescription(`Défini : ${args[0]}`)
        .setColor("#36ffab")
    message.channel.send(sEmbed)
};

module.exports.help = {
    name: "prefix"
};