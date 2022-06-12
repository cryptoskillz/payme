# payme

Payme is a simple e-commerce server that lets you get paid in the simplest way possible. 

It also integrates with our xpub service which creates Bitcoin addresses from your XPub. You can view this source here.

https://github.com/cryptoskillz/xpubaas

Currently porting to a serverless architect to complete a completely serverless Bitcoin Payment gateway.

Workers

cryptoapi

a port of the the cryptpoapi js

payme

payme QR code generator


xpub 

serverless wrapper for xpubaas until the bitcoinjsport is ready 

bitocoinjsport

A port of the popuplar BitcoinJs to serverless (WIP may never be finished)

checkpayment

A worker that looks for payments on the Bitcoin blockchain


to run a worker use the following

local 

sudo wrangler dev --env local

push to production 

sudo wrangler publish --env production