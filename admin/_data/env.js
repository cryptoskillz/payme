/*

add your enviorment files to a .env file in the root


SANITYPROJECTID=
SANITYDATASET=
SANITYAPIVERSION=
SANITYTOKEN=

to use them the api.js

process.env.SANITYPROJECTID,
process.env.SANITYDATASET,
process.env.SANITYAPIVERSION,
process.env.SANITYTOKEN,

*/
require('dotenv').config();


let todaysDate = new Date();
let _YEAR = todaysDate.getFullYear();
console.log(process.env.API)
module.exports = {
    YEAR: _YEAR,
    TITLE: "BACKPAGE GENERATOR",
    APIURL: process.env.API,
    COPYRIGHT: "CRYPTOSKILLZ " + _YEAR,
    ENVIRONMENT: process.env.ELEVENTY_ENV,
    SECRET: process.env.SECRET
}