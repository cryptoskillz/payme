I use sublime and plainstasks for my todo

https://github.com/aziz/PlainTasks

PAGES


global

 ☐ fix the spinner with my wicked CSS skills :[
 ☐ check the sendemail works for forogot password
 ☐ add a parse  / stringy flag to the cache renders
 ✔ add required field to elementdata @done (22-06-23 23:25)
 ✔ add a create new to the menu on the left* @done (22-06-28 15:10)
 ✔ remove the datacount from the user object as we are doing it live! @done (22-06-28 15:12)



create / edit data


check payment (we only want to do this when we have bitcoin js running in the serverless)

  ☐ check payment view
  ☐ create a subdmain that points to this
  ☐ take a check payment secret and id and it checks the status every 30 seconds

login.njk

 ☐ remove the error messages when there is a valid (may just remove them alogether and just use show alert)

settings 

 ☐ verify it is a valid BTC address
 ☐ verify it is an XPUB

forgot password

  ☐ add forgot password logic

data

 ☐ show both buttons and hide the one that is not used*
 ☐ when a payment checks is true hide check payment and show view payment button*
 ☐ update buildForm to use the new data types to have richtext edit etc

 
data edit

dashboard
  ✔ id the local storage data object is empty then pull down the data so the counter works.* @done (22-06-23 23:08)

API

user.js
 ☐ put the jwt token into the object  when they login so we can verify it later if required.
 ☐ move login.js post to here when  we add routing


api data.js
 ☐ add routing 
 
api settings.js

payment
 ☐ add price check function https://blockchain.info/tobtc?currency=" + currencyType + "&value=" + amount*
 

WORKERS

 
check payment

 ☐ add a way to to notify the store / owner payer that the payment has been processed,maybe via webhook and / or email
 ☐ add the full payment info into the payment KV object when a payment has been processed
 ☐ you only want to check the payment if it has a secret and an id otherwise it is the fallback address and this coult have random payments come into to it all the time.  We could also make the checker more sophisctaed and have it figure out mutiliple payments, look into how wallets do this later.
 ☐ wait for 3 confirmaitons to say its paid / 0-2 unconfirmed

payme

  ☐ style the hmtl so it looks super duper slick.

pay me
 ☐ fix the kv bindings when you are deploying 






