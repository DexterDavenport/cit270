const express = require('express'); // need to download express
const https = require('https');
const port = 3000;
const app = express();
const md5 = require('md5');
const bodyParser = require('body-parser'); //body parser is called middleware
const {createClient} = require('redis');
const { response } = require('express');
const fs = require('fs');
const redisClient = createClient(
{
    url: 'redis://default@35.202.166.25:6379',
//     socket:{
//         port:6379,
//         host:"127.0.0.1",
// },
}
); // This creates a connection to the redis database


app.use(bodyParser.json()); //Use the middleware (call it before anything else happens on each request)

// https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert'),
//     passphrase: 'P@ssw0rd'
// }, app).listen(port, async()=>{
//     await redisClient.connect();//creating a TCP socket with Redis
//     console.log("Listening on port: "+port);
// })

app.listen(port, async()=>{
    await redisClient.connect();
    console.log('Listening on port: ', port);
});

const validatePassword = async (request, response) =>{
    // await redisClient.connect();//creating a TCP socket with Redis
    const requestHashedPassword = md5(request.body.password);//get the password form the body and hash it
    const redisHashedPassword = await redisClient.hmGet('passwords', request.body.userName); // read password from redis
    console.log('Redis hashed password: '+redisHashedPassword);
    const loginRequest = request.body;
    console.log("Request Body", JSON.stringify(request.body));
    //search database for username, and retrieve current password

    //compare the hashed version of the password that was sent with the hashed version from the database
    if (loginRequest.userName==request.body.userName && requestHashedPassword==redisHashedPassword){        //add this before requestHashedPassword to hardcode the user (loginRequest.userName=="derick.whitmer@gmail.com" &&) 
        response.status(200); //200 means okay
        response.send("Welcome");
    } else{
        response.status(401);//401 means unauthorized
        response.send("Unauthorized")
    }

}

const savePassword = async (request, response)=>{
    const clearTestPassword = request.body.password;
    const hashedTestPassword = md5(clearTestPassword);
    await redisClient.hSet('passwords',request.body.userName, hashedTestPassword);//This is wrong
    response.status(200); //status 200 means ok
    response.send({result:"Saved"});
}

/*async function savePassword(request,response){


}*/

app.get('/',(request,response)=>{//every time something calls your API that is a request
    response.send("This is working");//a response is when the API gives the information requested
})

app.post('/signup', savePassword);
app.post('/login', validatePassword);