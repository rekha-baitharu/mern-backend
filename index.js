var express=require("express");
var mongoClient=require("mongodb").MongoClient;
var app=express();
var bodyParser = require("body-parser");
const {json} = require("body-parser");
var cors = require("cors");
var ObjectID = require("mongodb").ObjectID;

app.set("port",8000);
app.use(cors());
app.listen(app.get("port"),function(){
    console.log("app is running on port"+app.get("port"))
});
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

mongoClient.connect("mongodb://localhost:27017/learn",function(err, database){
//API TO ADD USERS
    app.post("/adduser", function(req,res){
        var newuser={
            name:req.body.name,
            email:req.body.email
        }
        database.db().collection("user").insertOne(newuser,function(err,doc){
            res.json({status:true});
        })
    });
//API TO GET USERS
    app.post("/get_users",function(req, res){
        var users=[];
        var cursor = database.db().collection("user").find().skip(parseInt(req.body.skip)).limit(parseInt(req.body.limit));
        cursor.forEach(function(doc, err){
            if(err){
                res.json({status:false, message:"error"});
            }else{
                users.push(doc);
            }
        },function(){
            res.json({status:true, result:users})
        });
    });

//API TO GET USERS BY FILTERING
    app.post("/getusers",function(req, res){
        var users=[];
        var cursor = database.db().collection("user").find({email:req.body.em});
        cursor.forEach(function(doc, err){
            if(err){
                res.json({status:false, message:"error"});
            }else{
                users.push(doc);
            }
        },function(){
            res.json({status:true, result:users})
        });
    });

//API TO GET ONLY ONE USER
    app.post("/get_single_users",function(req, res){
        var users=[];
        var cursor = database.db().collection("user").findOne({}, function(err,doc){
            if(err){
                res.json({status:false, message:"error"});
            }else{
                res.json({status:true, result:doc});
            }
        });
        });

//API TO DO SKIP AND LIMIT OPERATION
    app.post("/getuser",function(req, res){
        var users=[];
        var cursor = database.db().collection("user").find().skip(parseInt(req.body.skip)).limit(parseInt(req.body.limit));
        cursor.forEach(function(doc, err){
            if(err){
                res.json({status:false, message:"error"});
            }else{
                users.push(doc);
            }
        },function(){
            res.json({status:true, result:users});
        });
    });

    //API TO DELETE USERS
    // app.post("/delete_user",function(req,res){
    //     database.db().collection("user").deleteOne({email:req.body.em},function(err, obj){
    //         if(err){
    //             res.json({status:false, message:"error occured"})
    //         }else{
    //             res.json({status:true, message:"user deleted"})
    //         }
    //     })
    // })

    //API TO DELETE USERS BY ID
    app.post("/delete_user",function(req,res){
        if(req.body.hasOwnProperty("id")){
        database.db().collection("user").deleteOne({_id: new ObjectID(req.body.id)},function(err, obj){
            if(err){
                res.json({status:false, message:"error occured"});
            }else{
                res.json({status:true, message:"user deleted"});
            }
        })
    }else{
        res.json({status:false, message:"id parameter is missing"});
    }
    });

    //API TO DELETE MULTIPLE USERS USING AGE CRITERIA
    // app.post("/delete_user",function(req,res){
    //     database.db().collection("user").deleteMany({age>20},function(err, obj){
    //         if(err){
    //             res.json({status:false, message:"error occured"})
    //         }else{
    //             res.json({status:true, message:"user deleted"})
    //         }
    //     })
    // })

    //API TO UPDATE USER
    app.post("/update_user",function(req,res){
        database.db().collection("user").updateOne({_id:new ObjectID(req.body.id)},
        {
            $set:{
                name:req.body.name,
                email:req.body.email
            }
        },{upsert:false},function(err,result){
            if(err){
                res.json({status:false, message:"error occured"});
            }else{
                res.json({status:true, message:"user updated"});
            }
        })
    });

    

});

//LOGIN
app.get("/login",function(req,res){
    var email=req.query.email;
    var password=req.query.password;
    if(email=="rekhabaitharu@gmail.com" && password=="rekha1"){
        res.send("login successful");
    }else{
        res.send("login failed");
    }
});

//REGISTRATION
app.get("/registration",function(req,res){
    console.log("welcome to register api");
});

//CHECK PASSWORD
app.get("/checkpassword",function(req,res){
    var pwd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    if(req.query.password.match(pwd)){
        res.send("strong password");
    }
    else{
        res.send("weak password");
    }
});

//WHICH NUMBER IS THE LARGEST ONE USING GET METHOD
app.get("/numchk", function(req,res){
    if(parseInt(req.query.num1) >= parseInt(req.query.num2) && parseInt(req.query.num1) >= parseInt(req.query.num3)){
        res.send("num1 is the largest number");
    }else if(parseInt(req.query.num2) >= parseInt(req.query.num1) && parseInt(req.query.num2) >= parseInt(req.query.num3)){
        res.send("num2 is the largest value");
    }else{
        res.send("num3 is the largest value");
    }
});

//WHICH NUMBER IS THE LARGEST ONE USING POST METHOD
app.post("/num", function(req,res){
    if(parseInt(req.body.num1) >= parseInt(req.body.num2) && parseInt(req.body.num1) >= parseInt(req.body.num3)){
        res.json({status:true, message:"num1 is the largest number"});
    }else if(parseInt(req.body.num2) >= parseInt(req.body.num1) && parseInt(req.body.num2) >= parseInt(req.body.num3)){
        res.json({status:true, message:"num2 is the largest number"});
    }else{
        res.json({status:true, message:"num3 is the largest number"});
    }
});
// ADDITION OF TWO NUMBER USING POST METHOD
app.post("/add", function(req,res){
    req.body.num3 = parseInt(req.body.num2) + parseInt(req.body.num1);
    res.json({status:true, message:"Addition value is " + req.body.num3});
});

// SUBSTRACTION OF TWO NUMBER USING POST METHOD
app.post("/sub", function(req,res){
    req.body.num3 = parseInt(req.body.num2) - parseInt(req.body.num1);
    res.json({status:true, message:"Addition value is " + req.body.num3});
});

// ADDITION OF TWO NUMBER USING GET METHOD
app.get("/addition", function(req,res){
    req.query.num3 = parseInt(req.query.num2) + parseInt(req.query.num1);
    res.json({status:true, message:"Addition value is " + req.query.num3});
});

// SUBSTRACTION OF TWO NUMBER USING GET METHOD
app.get("/substraction", function(req,res){
    req.query.num3 = parseInt(req.query.num2) - parseInt(req.query.num1);
    res.json({status:true, message:"Addition value is " + req.query.num3});
});


