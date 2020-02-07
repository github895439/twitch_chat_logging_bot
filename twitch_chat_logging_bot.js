const tmi = require('tmi.js');
const Discord = require('discord.js');

const config =
    {
        twitch:
            {
                botUsername: "<BOT用twitchアカウント名>",
                botPassword: "<twitch BOTのOAuthトークン(Webページにある先頭の「oauth:」も含めて)>",
                channel: "<配信者のアカウント名>"
            },
        discord:
            {
                guild: "<ロギングするdiscordサーバ名>",
                token: "<discord BOTのOAuthトークン>"
            }
    };

const opts =
    {
        options:
            {
                debug: true
            },
        identity:
            {
                username: config.twitch.botUsername,
                password: config.twitch.botPassword
            },
        channels: [config.twitch.channel]
    };
const clientTwitch = new tmi.client(opts);
const clientDiscord = new Discord.Client();
const DISCORD_CHANNEL = "#twitch_chat_log";

var channelDiscord;

clientTwitch.on('message', onMessageHandler);

function sendToDiscordChannel(target, context, msg, self)
{
    channelDiscord.send(context["display-name"] + ": " + msg);
    return;
}
  
function onMessageHandler(target, context, msg, self)
{
    if (self)
    {
        return;
    }

    sendToDiscordChannel(target, context, msg, self);

    return;
}

function makeDiscordChannel()
{
    let guild = clientDiscord.guilds.find((val)=>val.name === config.discord.guild);
    guild.createChannel(DISCORD_CHANNEL,
        {
            type: "text"
        })
        .then(
            (ch)=>
            {
                channelDiscord = ch;
                channelDiscord.send("I am ready for Discord!")
                    .then(
                        ()=>
                        {
                            console.log("Ready Discord.");
                            channelDiscord.overwritePermissions(channelDiscord.guild.defaultRole,
                                {
                                    SEND_MESSAGES: false
                                })
                                .then(
                                    (updated_guild_id)=>
                                    {
                                        channelDiscord.overwritePermissions(clientDiscord.user.id,
                                            {
                                                SEND_MESSAGES: true
                                            })
                                            .then(
                                                (updated_client_id)=>
                                                {
                                                    console.log("Overwrote permission.");
                                                });
                                    });
                        });
            });
    return;
}

function removeDiscordChannel()
{
    channelDiscord.delete()
        .then(
            (channel)=>
            {
                console.log("Removed Discord channel.");
                clientDiscord.destroy();
                console.log("Completed cleanup.");
                process.exit();
            });
    return;
}

clientDiscord.login(config.discord.token)
    .then(
        ()=>
        {
            console.log("Connected Discord.");
            clientTwitch.connect()
                .then(
                    (data)=>
                    {
                        console.log("Connected Twitch.");
                        clientTwitch.say(config.twitch.channel, "I am ready for Twitch!")
                            .then(
                                (data)=>
                                {
                                    console.error("Ready Twitch.");

                                    makeDiscordChannel();
                                });
                    });
        });
console.log("INPUT 'E' TO STOP");
process.stdin.on('readable',
    () =>
    {
        let chunk;

        while ((chunk = process.stdin.read()) !== null)
        {
            if (chunk == "e\r\n")
            {
                clientTwitch.disconnect()
                    .then(
                        (reason)=>
                        {
                            console.log("Disconnected Twitch.");

                            removeDiscordChannel();
                        });
            }
        }
    });
