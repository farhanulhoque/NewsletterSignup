const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public")); // this is for our server to serve up static files such as CSS and images. "public" is the name of the folder that we keep as our static folder.

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fname;
  const lastName =req.body.lname;
  const email =  req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/07fcf577d4"; // 07fcf577d4 is the list ID

  const options = {  // this is a JS object
    method: "POST", // specifying http request method
    auth: "farhanul24:2b078cba3ef81793e40e5728231c3f77-us5" // Basic authentication. It includes the username and API key
  }

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname +"/successPage.html");  // if subscribtion is successful
    }
    else{
      res.sendFile(__dirname +"/failurePage.html");  // if subscription fails
    }

    response.on("data", function(data){ // checking what data they sent us. Looking out for any data that we get sent back from the mailchimp server.
      console.log(JSON.parse(data));
    });

  }); //Makes a request to a web server

  request.write(jsonData); // passing the data to the mailchimp server
  request.end(); // to specify that we are done with the request

});

app.post("/failure", function(req, res){
  res.redirect("/"); // redirects to home page when "Try again" button is clicked
});

app.listen(process.env.PORT || 3000, function(){ //Heroku defines the port on the go, whatever it is on their local system. It runs on port 3000 locally.
  console.log("Server is running on port 3000");
});
