#!/bin/bash

usage() { echo "Usage: $0 [-u <account>] [-n:optional <enode>]" 1>&2; exit 1; }

while getopts ":u:n:" o; do
    case "${o}" in
        u)
            u=${OPTARG}            
            ;;      
        n)
            n="--bootnodes ${OPTARG}"            
            ;;        
        *)
            usage
            ;;
    esac
done

shift $((OPTIND-1))

if [ -z "${u}" ]; then
  n="--bootnodes enode://5bb10c2e52f7e879835b7a0f2f9b5bf2a3d6c1a53294b564be0ec547e7ce5908cbaee1874d3aa3fe3120402dddab613341885ef62b7caf52e368ab770f0d325c@88.208.245.230:30303"
fi

if [ -z "${u}" ]; then
    usage
fi

geth=${GETH:-geth}

$geth --datadir data --networkid 31415926 --unlock $u --etherbase $u $n --mine console

#geth --datadir data --networkid 31415926 --unlock 0x0be1b6c6c1a72afe971040a2526f2d6dfe48bbb6 --etherbase 0x0be1b6c6c1a72afe971040a2526f2d6dfe48bbb6 --bootnodes enode://5bb10c2e52f7e879835b7a0f2f9b5bf2a3d6c1a53294b564be0ec547e7ce5908cbaee1874d3aa3fe3120402dddab613341885ef62b7caf52e368ab770f0d325c@88.208.245.230:30303 --mine --rpc --rpcaddr "0.0.0.0" --rpcport "8545" --rpccorsdomain "*" --rpcapi="db,eth,net,web3,personal" console