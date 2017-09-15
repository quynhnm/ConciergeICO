#!/bin/bash

geth=${GETH:-geth}

$geth --datadir data --networkid 31415926 --rpc --rpcport "8545" --rpcapi="db,eth,net,web3,personal" --mine
