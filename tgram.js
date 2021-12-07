var fs = require('fs')
//var Tx = require('ethereumjs-tx').Transaction;
const { FeeMarketEIP1559Transaction } = require( '@ethereumjs/tx' );
const Common = require( '@ethereumjs/common' ).default;
var Web3 = require('web3');
const routerABI = require('./uniswapABI.json');
var add = 'wss://ropsten.infura.io/ws/v3/3b7928f4026a4e12a18f3ff6810d9cdb'
var web3 = new Web3(new Web3.providers.WebsocketProvider(add));

var TelegramBot = require('node-telegram-bot-api')
var token = '2103562216:AAG5AABt9NtSjFO5fmeYF5Ca4ft5XZ2rnTY';
var bot = new TelegramBot(token, {polling:true});

const usrAdmin = [912008246];
const usrLis = [912008246];
// Variables To Change via Telegram

let weth = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
let router = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

let tokenaddy = '0x67D3899e20395b8476860da7511d03D88a142FB0';
let originalAmountToBuyWith = '0.002';
let gaslimit = 500000;
let maxfee = '150';
let priorityfee = '120';
// SPECIFY_THE_AMOUNT_OF_Eth_YOU_WANT_TO_BUY_FOR_HERE

const EthAmount = web3.utils.toWei(originalAmountToBuyWith, 'ether');

var PrivateKeys = 'b4b2fa50c192bf8f94d7a8cfc4a989240084c1babaf3befd74b44a348ed1c20a'
var walletAddress = '0x273b1E4f0f3b697765d929d10f10Fe3BA07db0eA';
console.log(`Buying ONLYONE for ${originalAmountToBuyWith} BNB from pancakeswap for address ${walletAddress}`);




async function buyOnlyone(targetAccount, amount, msgid) {
    try {
    var amountToBuyWith = web3.utils.toHex(amount);
    var privateKey = Buffer.from(PrivateKeys, 'hex');
    var tokenAddress = tokenaddy; // contract address
    var WethAddress = weth; // weth token address    
    var amountOutMin = '0';
    var UniswapRouterAddy = router;

    var chain = new Common( { chain : 'ropsten', hardfork : 'london' } );

    var routerAbi = routerABI;
    var contract = new web3.eth.Contract(routerAbi, UniswapRouterAddy);
    var data = contract.methods.swapExactETHForTokens(
        web3.utils.toHex(amountOutMin),
        [WethAddress,
         tokenAddress],
        walletAddress,
        web3.utils.toHex(Math.round(Date.now()/1000)+60*20),
    );

    var count = await web3.eth.getTransactionCount(walletAddress);
    var rawTransaction = {
        "from":walletAddress,
        //"gasPrice":web3.utils.toHex( web3.utils.toWei( '120' , 'gwei' ) ),
        "gasLimit":web3.utils.toHex(gaslimit),
        "maxFeePerGas": web3.utils.toHex( web3.utils.toWei(maxfee,'gwei')),
        "maxPriorityFeePerGas": web3.utils.toHex(web3.utils.toWei(priorityfee,'gwei')),
        "to":UniswapRouterAddy,
        "value":web3.utils.toHex(amountToBuyWith),
        "data":data.encodeABI(),
        "nonce":web3.utils.toHex(count),
        "type": "0x02"
    };

    const tx = FeeMarketEIP1559Transaction.fromTxData( rawTransaction , { chain } );
    //var transaction = new Tx(rawTransaction);
    const signedTransaction = tx.sign( privateKey );
    //transaction.sign(privateKey);

    const serializedTransaction = '0x' + signedTransaction.serialize().toString( 'hex' );
    const txHash = await web3.utils.sha3( serializedTransaction );
    console.log( "Tx Hash: " + txHash );
    bot.sendMessage( msgid, "Tx Hash: " + txHash)
    // await web3.eth.sendSignedTransaction( serializedTransaction )
    // .on( 'error' , function( error ) {
    //     console.error( error )
    // });

    //var result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
    //console.log(result)
    //return result;
}
catch(err) {
    bot.sendMessage( msgid, err.message)
}
}

bot.onText(/\/echo (.+)/, function(msg,match){
    if(usrLis.indexOf(msg.chat.id) !== -1)  
    {  
        var chatId = msg.chat.id;
        var echo = match[1];
        bot.sendMessage(chatId, echo);
    }   
    else  
    {  
        bot.sendMessage(msg.chat.id, "Kindly contact admin");
    }  
    
})



bot.onText(/\/weth (.+)/, function(msg,match){
    if(usrLis.indexOf(msg.chat.id) !== -1)  
    {  
        var chatId = msg.chat.id;
        weth = match[1];
        bot.sendMessage(chatId, "weth has changed");
    }   
    else  
    {  
        bot.sendMessage(msg.chat.id, "Kindly contact admin");
    }  
    
});
bot.onText(/\/router (.+)/, function(msg,match){
    if(usrLis.indexOf(msg.chat.id) !== -1)  
    {  
        var chatId = msg.chat.id;
        router = match[1];
        bot.sendMessage(chatId, "router has changed");
    }   
    else  
    {  
        bot.sendMessage(msg.chat.id, "Kindly contact admin");
    }  
    
});

bot.onText(/\/tokenaddy (.+)/, function(msg,match){
    if(usrLis.indexOf(msg.chat.id) !== -1)  
    {  
        var chatId = msg.chat.id;
        tokenaddy = match[1];
        bot.sendMessage(chatId, "tokenaddy has changed");
    }   
    else  
    {  
        bot.sendMessage(msg.chat.id, "Kindly contact admin");
    }  
    
});

bot.onText(/\/oAmtBuy (.+)/, function(msg,match){
    if(usrLis.indexOf(msg.chat.id) !== -1)  
    {  
        var chatId = msg.chat.id;
        originalAmountToBuyWith = match[1];
        bot.sendMessage(chatId, "originalAmountToBuyWith has changed");
    }   
    else  
    {  
        bot.sendMessage(msg.chat.id, "Kindly contact admin");
    }  
    
});

bot.onText(/\/gaslimit (.+)/, function(msg,match){
    if(usrLis.indexOf(msg.chat.id) !== -1)  
    {  
        var chatId = msg.chat.id;
        gaslimit = match[1];
        bot.sendMessage(chatId, "gaslimit has changed");
    }   
    else  
    {  
        bot.sendMessage(msg.chat.id, "Kindly contact admin");
    }  
    
});

bot.onText(/\/maxfee (.+)/, function(msg,match){
    if(usrLis.indexOf(msg.chat.id) !== -1)  
    {  
        var chatId = msg.chat.id;
        maxfee = match[1];
        bot.sendMessage(chatId, "maxfee has changed");
    }   
    else  
    {  
        bot.sendMessage(msg.chat.id, "Kindly contact admin");
    }  
   
});

bot.onText(/\/priorityfee (.+)/, function(msg,match){
    if(usrAdmin.indexOf(msg.chat.id) !== -1)  
    {  
        var chatId = msg.chat.id;
        priorityfee = match[1];
        bot.sendMessage(chatId, "priorityfee has changed");
    }   
    else  
    {  
        bot.sendMessage(msg.chat.id, "Kindly contact admin");
    }  
    
});


bot.onText(/\/view/, function(msg) {
    if(usrLis.indexOf(msg.chat.id) !== -1)  
    {  
        var msgVariables = "weth = " + weth+ "\n router = "+ router+ "\n tokenaddy = " + tokenaddy+ "\n originalAmountToBuyWith = " + originalAmountToBuyWith+ "\n gaslimit = "+ gaslimit + "\n maxfee = "+ maxfee+ ",\n priorityfee = "+ priorityfee;
        bot.sendMessage(msg.chat.id, msgVariables);
    }   
    else  
    {  
        bot.sendMessage(msg.chat.id, "Kindly contact admin");
    }  
    
});

bot.onText(/\/start/, function(msg) {
    if(usrLis.indexOf(msg.chat.id) !== -1)  
    {  
        var msgVariables = "/weth = " + "To change weth variable" +"\n /router = "+ "To change router variable"+ "\n /tokenaddy = " + "To change tokenaddy variable"+ "\n /oAmtBuy = " + "To change originalAmountToBuyWith variable"+ "\n /gaslimit = "+ "To change gaslimit variable" + "\n /maxfee = "+ "To change maxfee variable"+ ",\n /priorityfee = "+ "To change priorityfee variable" +"\n /view = "+ "To view all the variables"+"\n /run = "+ "To run the function";
        bot.sendMessage(msg.chat.id, msgVariables);
    }   
    else  
    {  
        console.log(msg.chat.id);
        bot.sendMessage(msg.chat.id, "Kindly contact admin");
    }  
    
});

bot.onText(/\/ak/, function(msg) {
    console.log(usrLis);
    
});


bot.onText(/\/run/, function(msg) {
    if(usrLis.indexOf(msg.chat.id) !== -1)  
    {  
        var res = buyOnlyone(PrivateKeys, EthAmount, msg.chat.id);
        bot.sendMessage(msg.chat.id, "Running");
    }   
    else  
    {  
        bot.sendMessage(msg.chat.id, "Kindly contact admin");
    }  
    
});



bot.onText(/\/adduser (.+)/, function(msg,match){
    console.log(msg.chat.id);
    console.log(match[1]);
    if(usrAdmin.indexOf(msg.chat.id) !== -1)  
    {  
        console.log(match[1]);
        console.log(usrLis);
        usrLis.push(Number(match[1]));
        console.log(usrLis);
        bot.sendMessage(msg.chat.id, "Usr Added");
    }   
    else  
    {  
        bot.sendMessage(msg.chat.id, "Kindly contact admin");
    }  
});

    


