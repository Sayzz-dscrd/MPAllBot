const fs = require('fs');
const Discord = require('discord.js')
const Canvas = require('canvas');

module.exports.run = async (client, message, args, prefix) => {
    var authorid = message.author.id;

    let embedActivityText = new Discord.MessageEmbed()
        .setTitle("Quel message d'activité voulez vous mettre ?")
        .setDescription("Entrez le nom de l'activité que vous voulez mettre à votre bot.")
        .setColor("#fab7f4")

    let embedActivityType = new Discord.MessageEmbed()
        .setTitle("Quel type de status voulez vous mettre ?")
        .setDescription("Choisissez entre (SENSIBLE AUX MAJUSCULES)")
        .addField("Solution 1", "**PLAYING** | (Joue à)", true)
        .addField("Solution 2", "**WATCHING** | (Regarde)", false)
        .addField("Solution 3", "**STREAMING** | (Streame)", false)
        .addField("Solution 4", "**LISTENING** | (Écoute)", true)
        .setColor("#fab7f4")

    let embedActivityUrl  = new Discord.MessageEmbed()
        .setTitle("Quel URL voulez vous mettre ?")
        .setDescription("Rentrez quelque chose d'aléatoire si votre status n'est pas \"STREAMING\".")
        .setColor("#fab7f4")
    
    await message.channel.send(embedActivityText);

    const msgActivityText = await message.channel.awaitMessages(msg => {
        if(msg.author.id !== authorid) return null;
        return msg.content;
    }, {time:60000, max:1})

    await message.channel.send(embedActivityType);

    const msgActivityType = await message.channel.awaitMessages(msg => {
        if(msg.author.id !== authorid) return null;
        return msg.content;
    }, {time:60000, max:1})

    await message.channel.send(embedActivityUrl);

    const msgActivityUrl = await message.channel.awaitMessages(msg => {
        if(msg.author.id !== authorid) return null;
        return msg.content;
    }, {time:60000, max:1})

    let activity = JSON.parse(fs.readFileSync("./config/activity.json", "utf8"));

    activity[message.guild.id] = {
        TEXT: msgActivityText.map(msg => msg.content).join(" ", ""),
        TYPE: msgActivityType.map(msg => msg.content).join(" ", ""),
        URL: msgActivityUrl.map(msg => msg.content).join(" ", "")
    };

    fs.writeFile("./config/activity.json", JSON.stringify(activity, null, "\t"), (err) => {
        if(err) console.log(err);
    });

    const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('./background.jpg');
    
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '40px sans-serif';
	ctx.fillStyle = '#ffffff';
    ctx.fillText(client.user.username, canvas.width / 2.5, canvas.height / 1.8);

    if(activity[message.guild.id].TYPE === "STREAMING") activitytype = "Streame";
    if(activity[message.guild.id].TYPE === "PLAYING") activitytype = "Joue à";
    if(activity[message.guild.id].TYPE === "WATCHING") activitytype = "Regarde";
    if(activity[message.guild.id].TYPE === "LISTENING") activitytype = "Écoute";
    if(activity[message.guild.id].TYPE !== "LISTENING" && activity[message.guild.id].TYPE !== "WATCHING" && activity[message.guild.id].TYPE !== "PLAYING" && activity[message.guild.id].TYPE !== "STREAMING") activitytype = "Inconnu";

    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#ffffff';
	ctx.fillText(activitytype+" "+activity[message.guild.id].TEXT, canvas.width / 2.5, canvas.height / 1.3);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(client.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'setActivity.png');

    message.channel.send("rien",attachment).then(async m => {
        m.react('✅').then(() => m.react('❌'));
        
        const filter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === authorid;
        };
        
        m.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
                if (reaction.emoji.name === '✅') {
                    client.user.setActivity(activity[message.guild.id].TEXT, { type: activity[message.guild.id].TYPE, url: activity[message.guild.id].URL});
					m.channel.send("Le status à été changé avec succès")
                } else {
                    m.channel.send("Annulation du message du status.")
                }
            })
            .catch(collected => {
                m.channel.send('Au bout des 30 secondes, vous n\'avez pas réagis au message.');
            });
    });
}

module.exports.help = {
    name: "setactivity"
};