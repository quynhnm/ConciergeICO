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

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the ConciergeCoin abstraction for Use.
    ConciergeCoinCrowdsale.setProvider(web3.currentProvider);

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

      var crowdsale = await ConciergeCoinCrowdsale.deployed();
      var tokenAddress = await crowdsale.token();
      conciergeCoinInstance = ConciergeCoin.at(tokenAddress);                

    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: async function() {
    var self = this;
    try{
      var receiver = document.getElementById("receiver").value;
      var balance = conciergeCoinInstance.balanceOf(receiver);        
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = balance.toString(10);
    } catch(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    }
  },

  sendCoin: async function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    try{
      var crowdsale = await ConciergeCoinCrowdsale.deployed();
      web3.personal.unlockAccount(receiver, "123456")
      crowdsale.sendTransaction({ from: receiver, value: web3.toWei(amount, "ether")})      
    
      self.setStatus("Transaction complete!");
      self.refreshBalance();
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
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));    
  }

  App.start();
});
