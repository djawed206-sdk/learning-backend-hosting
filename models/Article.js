const mongoose=require("mongoose")

// 1) the schema = the rules of an article
const articleSchema=new mongoose.Schema(
    {
        articleTitle:String,
        articleBody:String,
        articleLikes:Number
    }
)

// 2) the model = created from the schema
const Article=mongoose.model("Article",articleSchema)

// 3) export it so other files can use it
module.exports=Article