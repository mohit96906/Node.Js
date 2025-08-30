const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {connectToMongoDB} = require('./connect');

const{restrictLoggedinUserOnly , checkAuth} = require("./Middleware/auth");
const URL = require("./models/url");
const urlRoute  = require('./routes/url');
const staticRoute = require("./routes/staticRouter");
const userRoute = require('./routes/user');
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url').then(()=> console.log("Mongodb connected")
);
app.set("view engine" ,"ejs");
app.set("views",path.resolve("./views"))
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.get("/test" , async (req ,res)=>{
    const allUrls = await URL.find({});
    return res.render("home",{
        urls:allUrls,
    });
});

app.use("/url",restrictLoggedinUserOnly,urlRoute);
app.use("/user", userRoute);
app.use("/" ,checkAuth, staticRoute);
app.get('/:shortId' ,async (req ,res)=>{
    const shortId =req.params.shortId;
    await URL.findOneAndUpdate({
        shortId
    } ,{
        $push:{
            visitHistory:{
                timestamp:Date.now(),
            }

    },
}
);
   res.redirect(entry.redirectURL);
});


app.listen(PORT, ()=>console.log(`Server Started at PORT:${PORT}`)
);
