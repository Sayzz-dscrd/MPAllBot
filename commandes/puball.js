const Discord = require("discord.js");

module.exports.run = async(client, message, args) => {

    var authorid = message.author.id;

    let embedMessage = new Discord.MessageEmbed()
        .setTitle("Quel message voulez vous mettre ?")
        .setDescription("Entrez un message de pub, pour incitez les personnes à rejoindre votre serveur par exemple.")
        .setColor("#fab7f4")
    
    await message.channel.send(embedMessage);

    const msgMessage = await message.channel.awaitMessages(msg => {
        if(msg.author.id !== authorid) return null;
        return msg.content;
    }, {time:300000, max:1})

    message.channel.send(msgMessage.map(msg => msg.content).join(" ", "")).then(async m => {
        m.react('✅').then(() => m.react('❌'));
        
        const filter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === authorid;
        };
        
        m.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
                if (reaction.emoji.name === '✅') {
                    m.channel.send('Envoi du message en cours...');
                    client.users.cache.forEach(async user => {
                        if (!user.bot) {
                            user.send(msgMessage.map(msg => msg.content).join(" ", ""))
                                .catch(err => {                  
                                    return console.log(`${user.tag} n'a pas pu recevoir le message !`)
                                })
                        } else {}
                    })
                } else {
                    m.channel.send("Annulation de l'envoi du message.")
                }
            })
            .catch(collected => {
                m.channel.send('Au bout des 30 secondes, vous n\'avez pas réagis au message.');
            });
    });
};

module.exports.help = {
    name: "puball"
};