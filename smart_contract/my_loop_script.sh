#!/bin/bash

# Loop from 1 to 10
for i in {6..100}
do
  sui client call --package 0x21587dd79fc0cbf33c0a8a0a8df0274538120fb839f08982e48e6b48aba595b1 --module suilaxy_nft --function  mint_to_sender --args "thefirstgun_$i" "suilaxy future weapon" "golden" "https://bafkreid4t3haxbpqcya7nqybt2l64rkk4iterqgdkx4waa62nwmsobbjpm.ipfs.nftstorage.link/"
done

