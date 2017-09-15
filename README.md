# Concierge Coin

Through the methods described in this article and the script, we can quickly build our own private chain for development testing.

The repository contains the following tools:

* A test account import script that imports five test account private keys into the Ether Square node during the first deployment.
* A genesis.json configuration file, corresponding to five test accounts to provide initial funding (Concierge currency), to facilitate the development of testing.
* A script that quickly starts a private chain node and enters interactive mode.
* A sample：`contracts/Token.sol`。This is an intelligent contract written using the contract language [Solidity](http://solidity.readthedocs.org/en/latest/)The Token contract's function is to issue a token (which can be understood as money, points, etc.). Only the creator of the contract has the right to issue, the owner of the token has the right to use, and is free to transfer.

**Test account private key is public data placed on Github, do not use in the official environment or public chain. If you use these private keys outside the test environment, your funds will be stolen! Instead use a wallet program to generate some test accounts**

## Setup

1. In the installation folder of [go-ethereum](https://github.com/ethereum/go-ethereum) and [solc](http://solidity.readthedocs.org/en/latest/), can run `geth`and`solc` 
```
> yum install golang
> wget wget https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.7.0-6c6c7b2a.tar.gz
> tar -zxvf geth-linux-amd64-1.7.0-6c6c7b2a.tar.gz
> cd geth-linux-amd64-1.7.0-6c6c7b2a.tar.gz
> cp geth /usr/bin/geth
```
2. Using `git clone` to download this repository to local
3. Install [expect](http://expect.sourceforge.net/) `yum install expect`
4. For dapp, install nodejs `curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash - && sudo yum -y install nodejs`
5. For truffle on Centos, make sure to run `yum groupinstall 'Development Tools'`

## Start geth

1. Go to this: `cd ConciergeICO`
2. Import test accounts: `./bin/import_keys.sh`
3. Initialize blockchain: `./bin/private_blockchain_init.sh`
   The output is as follow：
   ```
    I0822 16:28:29.767646 ethdb/database.go:82] Alloted 16MB cache and 16 file handles to data/chaindata
    I0822 16:28:29.773596 cmd/geth/main.go:299] successfully wrote genesis block and/or chain rule set: 19425866b7d3298a15ad79accf302ba9d21859174e7ae99ce552e05f13f0efa3
   ```
4. To solve the problem account is lock, especially for miners, go with: `./bin/private_blockchain_miner.sh -u 0x3ae88fe370c39384fc16da2c9e768cf5d2495b48 -n enode://5bb10c2e52f7e879835b7a0f2f9b5bf2a3d6c1a53294b564be0ec547e7ce5908cbaee1874d3aa3fe3120402dddab613341885ef62b7caf52e368ab770f0d325c@88.208.245.230:30303`
Or you can put the enode in data/static-nodes.json
5. Start the private chain node: `./bin/private_blockchain.sh`. The result is as follow:
  ![private-started.png](screenshots/private-started.png)
Note: for the first node as static node on server, use nohup to run at background like this `nohup ./bin/private_blockchain_server.sh > blockchain.log 2>&1&`
6. At this point the etherbox interactive console has been launched, we can start testing and development.

Note: The tool script assumes that your `geth` is installed in the default location and can be passed directly geth. If the geth command is installed in a non-standard location, you can set the `GETH` environment variable to specify the path of the geth executable file. E.g:

`GETH=/some/weird/dir/geth ./bin/import_keys.sh`

## Publish ether by digging for account
Setup account for mining, you can ignore this step if use step 3 in **start geth**
``` javascript
// for fist node, just run private_blockchain.sh with nohup for background mode
// after that, we can go console by geth attach http://ip:8545
// second node, using --bootnodes to connect
> miner.setEtherbase(eth.accounts[0])
> personal.unlockAccount(eth.accounts[0], "123456", 1500)
```
View account balance：
```
> web3.eth.getBalance(web3.eth.accounts[0])
0
```
You can mine ether:
```
> miner.start(1)
I0822 17:17:43.496826 miner/miner.go:119] Starting mining operation (CPU=1 TOT=3)
I0822 17:17:43.497379 miner/worker.go:573] commit new work on block 30 with 0 txs & 1 uncles. Took 527.407µs
```
Call miner.stop to stop mining:
```
> miner.stop()
true
> web3.eth.getBalance(web3.eth.accounts[0])
309531250000000000000
```
Unlock account to use
```
> personal.unlockAccount(web3.eth.accounts[0])
```

## Use truffle to compile and deploy smart contracts

Type this:

```javascript
> truffle compile
> truffle migrate
```


Let's buy some CC1 tokens.

```javascript
> truffle console
```

Then setup an account that will buy CC1 tokens:
*Please remove .DS_Store in build/contracts folder*

```javascript
> account1 = web3.eth.accounts[1]
// The address of the CC1 token instance that was created when the crowdsale contract was deployed
> ConciergeCoinCrowdsale.deployed().then(inst => { crowdsale = inst })
> crowdsale.token().then(addr => { tokenAddress = addr })
> conciergeCoinInstance = ConciergeCoin.at(tokenAddress)
> conciergeCoinInstance.balanceOf(account1).then(balance => balance.toString(10))
// Buying CC1 tokens
> web3.personal.unlockAccount(account1, "123456")
> crowdsale.sendTransaction({ from: account1, value: web3.toWei(10, "ether")})

// // Check the amount of CC1 tokens for account1 again. It should have some now.
> conciergeCoinInstance.balanceOf(account1).then(balance => account1CC1TokenBalance = balance.toString(10))

// When we created our token we made it with 18 decimals, which the same as what ether has. That's a lot of zeros, let's display without the decimals:
> web3.fromWei(account1CC1TokenBalance, "ether")
```
