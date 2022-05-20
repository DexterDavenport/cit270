const express = require('express'); // need to download express

const port = 3000;
const app = express();
const md5 = require('md5');
const bodyParser = require('body-parser'); //body parser is called middleware
const {createClient} = require('redis');
const redisClient = createClient(
    {
        socket:{
            port:6379,
            host:"127.0.0.1",
    },
    }
); // This creates a connection to the redis database
redisClient.connect();//creating a TCP socket with Redis

app.use(bodyParser.json()); //Use the middleware (call it before anything else happens on each request)

app.listen(port, async()=>{
    console.log("Listening on port: "+port);
})

const validatePassword = async (request, response) =>{
    // await redisClient.connect();//creating a TCP socket with Redis
    const requestHashedPassword = md5(request.body.password);//get the password form the body and hash it
    const redisHashedPassword = await redisClient.hmGet('password', request.body.userName); // read password from redis
    const loginRequest = request.body;
    console.log("Request Body", JSON.stringify(request.body));
    //search database for username, and retrieve current password

    //compare the hashed version of the password that was sent with the hashed version from the database
    if (requestHashedPassword==redisHashedPassword){        //add this before requestHashedPassword to hardcode the user (loginRequest.userName=="derick.whitmer@gmail.com" &&) 
        response.status(200); //200 means okay
        response.send("Welcome");
    } else{
        response.status(401);//401 means unauthorized
        response.send("Unauthorized")
    }

}
app.get('/',(request,response)=>{//every time something calls your API that is a request
    response.send("Hello");//a response is when the API gives the information requested
})

app.post('/login', validatePassword);