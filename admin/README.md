This is cryptoskillz generic admin for cloudflare pages that can be found in the current repo


Change variables:

Open _data/env.js
	Change "TITLE" to your customers title
	Change "COPYRIGHT" to your company / product name 
	Change "DATAMAIN" if you want to call the your data view something else IE projects.
	chnage "DASHBOARDSTRAP" if you want to change the strapline
Change env vars

open .env
	Change secret to something else, this is they Key that JWT uses. 

Javacript

	All the resuable javascript is in /assets/app.js and 
	Each file has its own js file in _includes ie dashoard.njk has an accompayning _includes/dashboard.js file 

Building 

	./build.sh local   
		Build a local version of the site 
	./build.sh prod
		Build a prodction version of the site
	./build.sh cypress

	wrangler

	you can skip the build script and use wrangler directly

	wrangler pages dev _site --binding SECRET=fdfdf --kv=kvdata --local --live-reload  &


	api

	The api endpoints are all in the functions/api directory

	







