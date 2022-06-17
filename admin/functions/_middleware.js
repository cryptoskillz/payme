const hello = async ({ next }) => {
    const response = await next();
    response.headers.set('X-Hello', 'Hello from functions Middleware!');
    const contentType = response.headers.get('content-type')

    if (contentType == "application/json") {
        console.log("contentType")
        console.log(contentType)
        //get the login credentials
        console.log("payLoad")
        let payLoad = await response.json();
        //console.log(payLoad)
    }
    //console.log(contentType)
    return response;
};

//just playing with middle ware add the function name if you want to see it fail wonderfully

export const onRequest = [];