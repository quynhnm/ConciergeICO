#!/bin/bash

geth=${GETH:-geth}

$geth --datadir data --networkid 31415926 --rpc --rpccorsdomain "*" --rpcport "8545" --rpcapi="db,eth,net,web3,personal" init ./genesis.json
