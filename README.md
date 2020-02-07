本内容を利用した場合の一切の責任を私は負いません。

# 環境
- OS  
OS 名:                  Microsoft Windows 10 Home  
OS バージョン:          10.0.18362 N/A ビルド 18362  
システムの種類:         x64-based PC

- node.js  
node-v10.16.0-win-x64  
discord.js@11.5.1  
tmi.js@1.5.0

# 概要
以前に使用していた配信サイトは掲示板の機能を使っていたためなのか、配信中にチャットのログを視聴者が遡ることができた。  
これができると、配信を途中から見た人も話の流れがわかる。  
twitchとyoutubeはこれができないのが不便。  
てことで、discordでロギングすればいいのではと思った。  
(もちろん、遡るためには視聴者がdiscordに参加する必要がある。)  
実現方法は、twitch BOTとdiscord BOTを組み合わせる。  
twitch BOTがtwitchチャットのメッセージを検出したら、そのメッセージをdiscordチャネルに送信する。

# 手順
1. BOT用twitchアカウント作成

1. BOTのOAuthトークン作成  
BOT用twitchアカウントでログインして下記で作成する。  
(tmi.jsを使わない場合はこの限りではないかも。)  
https://twitchapps.com/tmi/

1. discord bot設定  
公式でわかりやすいものが見つからなかったので、参考のWebページで設定する。  
BOT PERMISSIONSはチャネルの作成・削除もするため、下記をONにする。
- Send Messages  
- Manage Channels

1. node.jsにtmi.jsモジュールをインストール(※markdownのせいで番号がおかしく、手順の続き)  
`npm install tmi.js`

1. node.jsにdiscord.jsモジュールをインストール  
`npm install discord.js`

1. 本ツールをダウンロード  
https://github.com/github895439/twitch_chat_logging_bot

1. ダウンロードしたものを展開

1. ツールの設定  
twitch_chat_logging_bot.js内の下記を設定する。

```javascript:twitch_chat_logging_bot.js
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
```

1. ツールを実行(※markdownのせいで番号がおかしく、手順の続き)
```plaintext:標準出力
>node twitch_chat_logging_bot.js
INPUT 'E' TO STOP
Connected Discord.
[21:30] info: Connecting to irc-ws.chat.twitch.tv on port 80..
[21:30] info: Sending authentication to server..
[21:30] info: Connected to server.
[21:30] info: Executing command: JOIN #cyacya_1451
Connected Twitch.
[21:30] info: [#cyacya_1451] <twitch_chat_logging_bot>: I am ready for Twitch!
Ready Twitch.
Ready Discord.
[21:31] error: No response from Twitch.
```

1. BOTの終了(※markdownのせいで番号がおかしく、手順の続き)  
「e」キーを押し、Enterキーを押すと停止する。  
(discordチャネルを削除するため。  
Ctrl+cで強制終了した場合はロギングしているdiscordの#twitch_chat_logチャネルが増殖していくと思う。)

# 備考
配信中を目的としているため、配信が終わるとチャネルごと削除する。  
(配信終了後はtwitchのアーカイブを見れば配信中のチャットログがわかる。)  
ログのためpostできないようにしたいが、パーミッションの設定がまだわからず、それは後日。

# 参考
- twitch API  
https://dev.twitch.tv/docs/api/reference

- twitch Chatbots & IRC  
https://dev.twitch.tv/docs/irc

- tmi.js  
https://gist.github.com/twitchdevelopers/afda75fe0a43453e97e97b25232778de
https://github.com/tmijs/docs
https://github.com/tmijs/docs/tree/gh-pages/_posts

- discord bot設定  
https://note.com/bami55/n/ncc3a68652697
https://qiita.com/PinappleHunter/items/af4ccdbb04727437477f
https://liginc.co.jp/370260

- discord.js  
https://discord.js.org/#/
https://github.com/discordjs/discord.js
