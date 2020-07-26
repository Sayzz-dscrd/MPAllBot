const Discord = require("discord.js");

module.exports.run = async(client, message, args) => {

        var authorid = message.author.id;
    
        let embedTitle = new Discord.MessageEmbed()
            .setTitle("Quel titre voulez vous mettre ?")
            .setDescription("Envoie un titre, markdown utilisable.")
            .setColor("#fab7f4")
        
        let embedDescription = new Discord.MessageEmbed()
            .setTitle("Quel description voulez vous mettre ?")
            .setDescription("Envoie une description, markdown utilisable.")
            .setColor("#fab7f4")

        let embedLink = new Discord.MessageEmbed()
            .setTitle("Quel lien voulez vous mettre ?")
            .setDescription("Envoyez l'url d'invitation de votre bot discord par exemple.")
            .setColor("#fab7f4")

        let embedImage = new Discord.MessageEmbed()
            .setTitle("Quel image voulez vous mettre ?")
            .setDescription("Envoyez l'url d'une image.")
            .setColor("#fab7f4")

        let embedColor = new Discord.MessageEmbed()
            .setTitle("Quel couleur voulez vous mettre ?")
            .setDescription("Envoie une couleur, en **couleur html** ou bien en **hexadécimale**.\n\n[Couleur HTML](https://htmlcolorcodes.com/fr/)\n[Couleur hexadéciamle](https://htmlcolorcodes.com/fr/)")
            .setColor("#fab7f4")
        await message.channel.send(embedTitle);

        const msgTitle = await message.channel.awaitMessages(msg => {
            if(msg.author.id !== authorid) return null;
            return msg.content;
        }, {time:60000, max:1})

        await message.channel.send(embedDescription);

        const msgDescription = await message.channel.awaitMessages(msg => {
            if(msg.author.id !== authorid) return null;
            return msg.content;
        }, {time:60000, max:1});

        await message.channel.send(embedLink);

        const msgLink = await message.channel.awaitMessages(msg => {
            if(msg.author.id !== authorid) return null;
            return msg.content;
        }, {time:60000, max:1});

        await message.channel.send(embedImage);

        const msgImage = await message.channel.awaitMessages(msg => {
            if(msg.author.id !== authorid) return null;
            return msg.content;
        }, {time:60000, max:1});

        await message.channel.send(embedColor);

        const msgColor = await message.channel.awaitMessages(msg => {
            if(msg.author.id !== authorid) return null;
            return msg.content;
        }, {time:60000, max:1});

        let Embed = new Discord.MessageEmbed()
            .setTitle(msgTitle.map(msg => msg.content).join(" ", ""))
            .setDescription(msgDescription.map(msg => msg.content).join(" ", ""))
            .addField("Lien", `[Clique ici !](${msgLink.map(msg => msg.content).join(" ", "")})`)
            .setColor(msgColor.map(msg => msg.content).join(" ", ""))
            .setImage(msgImage.map(msg => msg.content).join(" ", ""))
            .setFooter(client.user.username, client.user.avatarURL).setTimestamp()
        message.channel.send(Embed).then(async m => {
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
                                user.send(Embed)
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
    name: "puballembed"
};