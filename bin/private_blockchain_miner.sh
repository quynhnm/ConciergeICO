#!/bin/bash

usage() { echo "Usage: $0 [-u <account>] [-n <enode>]" 1>&2; exit 1; }

while getopts ":u:n:" o; do
    case "${o}" in
        u)
            u=${OPTARG}            
            ;;      
        n)
            n=${OPTARG}            
            ;;        
        *)
            usage
            ;;
    esac
done

shift $((OPTIND-1))

if [ -z "${u}" ] || [ -z "${n}" ]; then
    usage
fi

geth=${GETH:-geth}

$geth --datadir data --networkid 31415926 --unlock $u --etherbase $u --bootnodes $n --mine console
