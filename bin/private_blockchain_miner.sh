#!/bin/bash

usage() { echo "Usage: $0 [-u <account>]" 1>&2; exit 1; }

while getopts ":u:" o; do
    case "${o}" in
        u)
            u=${OPTARG}            
            ;;       
        *)
            usage
            ;;
    esac
done

shift $((OPTIND-1))

if [ -z "${u}" ]; then
    usage
fi

geth=${GETH:-geth}

$geth --datadir data --networkid 31415926 --rpc --rpccorsdomain "*" --rpcport "8545" --rpcapi="db,eth,net,web3,personal" --nodiscover --unlock $u --etherbase $u --mine console
