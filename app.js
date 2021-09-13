//jshint esversion: 6


const express = require("express");
const https = require("https");




const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


app.post("/", function (req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const emailAddress = req.body.Email;
    const data = {
        members: [
            {
                email_address: emailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us5.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;
    const options = {
        method: "POST",
        auth: process.env.YOUR_NAME + ":" + process.env.API_KEY
    }
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (d) {
            console.log(JSON.parse(d));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});


app.post("/success", function (req, res) {
    res.redirect("/");
});



app.listen(process.env.PORT || 3000, function () {
    console.log("server is running on port 3000");
});






