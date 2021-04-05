const Web3 = require("web3");
const ethWallet = require('ethereumjs-wallet');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonicPhrase = "river spare typical endorse tragic egg twelve brisk call farm obscure bunker";
const TTS = require("./build/contracts/TTS.json")
const Discord = require('discord.js');
const client = new Discord.Client();

const eventProvider = new Web3.providers.WebsocketProvider('ws://localhost:7545')


let provider = new HDWalletProvider({
    mnemonic: {
        phrase: mnemonicPhrase
    },
    providerOrUrl: "https://rinkeby.infura.io/v3/50aa19ab84df4855923c094d5b4d0c2a"
});

async function main() {

    let web3 = new Web3(provider);
    let web3EventSubscriber = new Web3("wss://rinkeby.infura.io/ws/v3/50aa19ab84df4855923c094d5b4d0c2a");

    const id = await web3.eth.net.getId()

    const tts = new web3.eth.Contract(TTS.abi, TTS.networks[id].address)


    client.login('NTQ0MTEyMDc1MjI0NTE0NTcw.XGAF2w.q6Ewo3_Qx58MWng2sBsfmiHmz74');
    client.on('message', async (msg) => {
        console.log(msg.content)
        const accounts = await web3.eth.getAccounts()
        const mseToken = msg.content.replace(/\s+/g, ' ').trim().split(' ')
        if (mseToken[0] === '$mine') {
            console.log(msg.author.id)
            console.log(BigInt(msg.author.id))
            const receipt = tts.methods.mine(BigInt(msg.author.id), BigInt(100)).send({
                from: accounts[0]
            }).catch(err => {
                console.log(err)
                msg.reply("掘礦失敗")
            })
            msg.reply("掘礦中，⛏⛏⛏⛏⛏⛏⛏⛏")
            console.log(receipt)
        } else if (mseToken[0] === '$balance') {
            const rst = await tts.methods.getBalance(BigInt(msg.author.id)).call().catch(err => {
                msg.reply(`你未註冊`)
            })
            msg.reply(`你有 $${rst} 傻聖幣`)
            console.log(rst)
        } else if (mseToken[0] === '$transfer') {
            const amount = mseToken[2]
            const re = /\b[0-9]+\b/g
            const to = mseToken[1].match(re)[0]
            const receipt = tts.methods.discordTransfer(BigInt(msg.author.id), BigInt(to), BigInt(amount)).send({
                from: accounts[0]
            }).catch(err => {
                console.log("fffff", err)
                msg.reply("交易失敗")
            })
            msg.reply("轉帳中，等待區塊鏈確認💸💸💸💸💸💸")

        } else if (mseToken[0] === '$wallet') {
            const addr = await tts.methods.getWalletAddres(BigInt(msg.author.id)).call()
            const pk = await tts.methods.getPrivateKey(BigInt(msg.author.id)).call()
            msg.reply(`銀包地址係：${addr}\nprivate key係：${pk}`)
        } else if (mseToken[0] === "$help") {
            msg.reply(`
            $register
            $mine （掘礦）
            $transfer @傻聖 100 （轉帳）
            $balance （餘額）
            $wallet （銀包資料）
            $address 0x34E1BC5...（連結外部銀包）
            `)
        } else if (mseToken[0] === "$address") {
            tts.methods.setWalletAddress(BigInt(msg.author.id), mseToken[1]).send({
                from: accounts[0]
            }).catch(err => {
                console.log("fffff", err)
                msg.reply("更改銀包地址失敗")
            })
        } else if (mseToken[0] === "$register") {
            let addressData = ethWallet['default'].generate()
            const pk = addressData.getPrivateKeyString()
            const addr = addressData.getAddressString()
            tts.methods.register(BigInt(msg.author.id), pk, addr).send({
                from: accounts[0]
            }).catch(err => {
                console.log("fffff", err)
                msg.reply("註冊失敗")
            })
            msg.reply("註冊中")
        }
    });

    client.on('ready', () => {
        client.user.setActivity('$help', { type: 'WATCHING' });
    });

    const eventAbis = tts.options.jsonInterface.filter((abiObj) => abiObj.type === 'event')

    var subscription = web3EventSubscriber.eth.subscribe('logs', {
        address: '0x9BB90DA25fc66BEe65D9AF7e1D48eECfb68B8cd2',
        topics: []
    }, function (error, result) {
        if (!error) {
            const eventSig = result.topics[0]
            console.log(result);

            for (let abi of eventAbis) {
                if (eventSig == abi.signature) {
                    if (abi.name == "Mine") {
                        const user = parseInt(result.topics[1])
                        const amount = parseInt(result.topics[2])
                        client.channels.cache.get('685731255026712598').send(`<@!${user}> 掘了 $${amount} 傻聖幣⛏`)
                    } else if (abi.name == "DiscordTransfer") {
                        const from = parseInt(result.topics[1])
                        const to = parseInt(result.topics[2])
                        const amount = parseInt(result.topics[3])
                        client.channels.cache.get('685731255026712598').send(`<@!${from}> 轉帳了 $${amount} 傻聖幣給 <@!${to}>\n交易紀錄：https://rinkeby.etherscan.io/tx/${result.transactionHash}`)
                    } else if (abi.name == "SetWalletAddress") {
                        const user = parseInt(result.topics[1])
                        client.channels.cache.get('685731255026712598').send(`<@!${user}> 更改錢包成功`)
                    } else if (abi.name == "Register") {
                        const user = parseInt(result.topics[1])
                        client.channels.cache.get('685731255026712598').send(`<@!${user}> 註冊成功`)
                    }
                }
            }
        }
    });
    // unsubscribes the subscription
    // subscription.unsubscribe(function (error, success) {
    //     if (success)
    //         console.log('Successfully unsubscribed!');
    // });
}

main()
