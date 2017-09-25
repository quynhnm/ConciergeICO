// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import conciergecoin_artifacts from '../../build/contracts/ConciergeCoin.json'
import conciergecoin_crowdsale_artifacts from '../../build/contracts/ConciergeCoinCrowdsale.json'

// ConciergeCoin is our usable abstraction, which we'll use through the code below.
var ConciergeCoin = contract(conciergecoin_artifacts);
var ConciergeCoinCrowdsale = contract(conciergecoin_crowdsale_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var conciergeCoinInstance;
var crowdsale;
var filter;

window.App = {
  start: function() {
    var self = this;        

    // Bootstrap the ConciergeCoin abstraction for Use.
    // need to setup provider, provider connected to network
    ConciergeCoinCrowdsale.setProvider(web3.currentProvider);
    ConciergeCoin.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(async function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];      

      crowdsale = await ConciergeCoinCrowdsale.deployed();      
      var tokenAddress = await crowdsale.token();
      // console.log(tokenAddress)
      document.getElementById('token').value = tokenAddress
      conciergeCoinInstance = ConciergeCoin.at(tokenAddress);           

    });

    filter = web3.eth.filter('latest')

  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: async function() {
    var self = this;
    try{      
      var receiver = document.getElementById("receiver").value;
      var balance = await conciergeCoinInstance.balanceOf(receiver);              
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = web3.fromWei(balance.toString(10), "ether");
    } catch(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    }
  },

  sendCoin: async function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var investor = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    try{      
      var password = prompt("Enter passphrase")
      web3.personal.unlockAccount(investor, password, 150000)
      await crowdsale.sendTransaction({ from: investor, value: web3.toWei(amount, "ether")})   
      self.setStatus("Transaction completed!");   
      self.refreshBalance()                             
    } catch(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    }
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 ConciergeCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);    
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    // var host = location.hostname || 'localhost';
    var host = '88.208.245.230';
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://"+host+":8545"));   
  }

  App.start();
});
