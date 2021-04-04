const Web3 = require("web3");
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
        const mseToken = msg.content.split(' ')
        if (mseToken[0] === '$mine') {
            const re = /\b[0-9]+\b/g
            // const userId = mseToken[1].match(re)
            
            console.log(msg.author.id)
            console.log(BigInt(msg.author.id))
            const receipt = await tts.methods.mine(BigInt(msg.author.id), BigInt(100)).send({
                from: accounts[0]
            })
            console.log(receipt)
        }else if (mseToken[0] === '$balance'){
            const rst = await tts.methods.getBalance(BigInt(msg.author.id)).call()
            msg.reply(`你有 $${rst} 傻聖幣`)
            console.log(rst)
        }else if(mseToken[0] === '$transfer'){
            const to = mseToken[1]
            const amount = mseToken[2]

            const receipt = await tts.methods.discordTransfer(BigInt(msg.author.id),BigInt(to) , BigInt(amount)).send({
                from: accounts[0]
            })
            console.log(receipt)
            if(!receipt.status){

            }else{
                
            }
        }
    });

    client.on('ready', () => {
        client.channels.cache.get('544130029076873218').send('Hello here!')
    });

    const eventAbis = tts.options.jsonInterface.filter((abiObj) => abiObj.type === 'event')

    var subscription = web3EventSubscriber.eth.subscribe('logs', {
        address: '0xE66dc1C401b0850b2A62C360C839d750258AAd5A',
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
                        client.channels.cache.get('544130029076873218').send(`<@!${user}> 屌了 ${amount} 傻聖幣`)
                    }
                }
            }
        }
    });
    // unsubscribes the subscription
    subscription.unsubscribe(function (error, success) {
        if (success)
            console.log('Successfully unsubscribed!');
    });
}

main()
