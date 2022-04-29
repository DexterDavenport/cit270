const express = require('express'); // import the library

const app = express(); // use the library

app.listen(3000,()=>{console.log('listening...')}) // Listen

app.get('/',(req,res)=>{res.send("Hello World!")}) // Respond
