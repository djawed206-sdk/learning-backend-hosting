//fixe the probleme of dns that block the connection
if (process.env.NODE_ENV !== 'production') {
  const dns = require('node:dns');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

//file of app.js (btw no react here just a name)
const express=require('express'); //this is the old method 

const app=express()
app.use(express.json())
let users=[]

//connection with the database
/*import mongoose from 'mongoose';*/ //dont use this when u already used require because it can causes problems
const mongoose = require('mongoose');

 async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb+srv://sadekdjawed2006_db_user:G4dUdOWs4bqgrfBf@cluster0.wfytt0q.mongodb.net/?appName=Cluster0");
    console.log("You successfully connected to MongoDB!");
    return mongoose;
  } catch (err) {
    console.log("rah kayan error a w9",err);
  }
}

// Call this only when your application terminates
 async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}

connectToMongoDB()

//importing the models like the model Article to use it
const Article=require('./models/Article')

app.get("/",(req,res)=>{
    res.send("welcome home bro")
})

app.get('/users',(req,res)=>{
    if(users.length==0){
        res.status(404).send("no users found")
        return
    }
    res.status(200).send(users)   
})

app.post('/users',(req,res)=>{
    console.log(req.body)  //now this will show up in command line { name: 'djawed', age: 19 }
    let user1=req.body
    let findUser=users.find(user=>{
        if(user.id==user1.id){
            return true
        } 
    })
   if(findUser){
    res.status(400).send("user already found")
    return
   }
   users.push(user1)
   res.status(200).send("created succussfully")
})

app.delete('/users/:id',(req,res)=>{
    let {id}=req.params
    id=Number(id)
    console.log(typeof(id))
    let findUserIndex=users.findIndex(user=>{
        if(user.id==id){
            return true
        }
    })
    if(findUserIndex){
       users.splice(findUserIndex,1)
       res.status(200).send("deleted succusfully")
       return
    }
    res.status(404).send("user not found")
})

//so this is only to learn how to send parametres 
//so like in postman there is 3 ways to send parametre 

//1:by only writting it in the url like this /: this means now u gonna type a parametre 
app.get('/sum/:number1/:number2',(req,res)=>{
let number1=req.params.number1
let number2=req.params.number2
console.log("hna g3 parametres",req.params)  // { number1: '10', number2: '20' }
console.log("hna number1w2",number1,number2) //hna number1w2 10 20
let sum=Number(number1)+Number(number2)
res.send(`the sum of the params:${sum}`)  //in postman: the sum of the params:30
})


//2:using body params in postmane
app.get('/sum',(req,res)=>{
let number1=req.body.number1
let number2=req.body.number2
console.log("hna g3 parametres",req.body)  // { number1: '10', number2: '20' }
console.log("hna number1w2",number1,number2) //hna number1w2 10 20
let sum=Number(number1)+Number(number2)
res.send(`the sum of the params:${sum}`)  //in postman: the sum of the params:30
})

//3:using querry parametres in postman (but attention change the path so it dont mixed up with the onr above that uses body params)
app.get('/sum2',(req,res)=>{
let number1=req.query.number1
let number2=req.query.number2
console.log("hna g3 parametres",req.query)  // { number1: '10', number2: '20' }
console.log("hna number1w2",number1,number2) //hna number1w2 10 20
let sum=Number(number1)+Number(number2)
res.send(`the sum of the params:${sum}`)  //in postman: the sum of the params:30
})


//send json :here we gonna use also body params and query params to not forget about them
app.get('/hello',(req,res)=>{
    res.json({
        name:req.body.name,
        age:req.query.age
    }) //the response: {"name": "djawed","age": "20"}
})

//send html file:
app.get('/wech',(req,res)=>{
    let numbers=""
for(let i=0;i<=40;i++){
    numbers+=i+"-"
}
console.log(numbers)
    //res.send('<h1>hello world<h1/>')
   // res.sendFile(__dirname+("/wech/numbers.html"))
    res.render("numbers.ejs",{   
        name:"djawed",
        numbers:numbers
    }) //so here render does directly find the file because it has relation with views and send to it the data that we need , where the file.ejs will handle it
})


//for database mongoDB
//Write data (Create) in mongoDB
app.post('/article',async(req,res)=>{
    try{
let title=req.body.title
let body=req.body.body
let likes=0
const newArticle=new Article
newArticle.articleTitle=title
newArticle.articleBody=body
newArticle.articleLikes=likes
    
const save=await newArticle.save()
res.status(200).json(save)
    }

catch(error){
    res.status(400).json({error:error.message})
}

})


//read all data (articles) from mongoDB
app.get('/article',async(req,res)=>{
try{
const articles=await Article.find()
res.status(200).json(articles)
}

catch(error){
res.status(500).json({error:error.message})
}
})


//Read one article by id
app.get('/article/:articleId',async(req,res)=>{
    try{
let id =req.params.articleId
const article =await Article.findById(id)
res.status(200).json(article)
    }

    catch(error){
        res.status(500).json({error:error.message})
    }
})


//Update an article
app.put('/article/:articleId',async(req,res)=>{
    try{
let id=req.params.articleId
const article=await Article.findByIdAndUpdate(id,req.body)
res.status(200).json(article)
    }
    catch(error){
res.status(400).json({error:error.message})
    }
})

//Delete an article
app.delete('/article/:articleId',async(req,res)=>{
    try{
let {articleId}=req.params
const article= await Article.findByIdAndDelete(articleId)
res.status(200).json(article)
    }
    catch(error){
res.status(400).json({error:error.message})
    }
})

//show all articles in ejs format (what fullstack developers actually do with apis)(render)
app.get('/showArticles',async(req,res)=>{
    try{
const articles=await Article.find()
    res.status(200).render('articles.ejs',{allArticles:articles})  
    }
    catch(error){
res.status(500).json({error:error.message})
    }
    
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});