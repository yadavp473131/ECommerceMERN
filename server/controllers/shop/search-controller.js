const Product = require("../../models/Product");


const searchProducts = async(req, res)=>{
    //by title, category
    try{
        const { keyword } = req.params;
        if(!keyword || typeof keyword !== 'string'){
            return res.status(400).json({
                success: false,
                message: "keyword is required and keyword must be in string format!"
            })
        }

        const regEx = new RegExp(keyword, 'i');
        const createSearchQuery = {
            $or:[
                { title: regEx },
                { description: regEx },
                { category: regEx },
                { brand: regEx },
            ]
        }
        const searchResult = await Product.find(createSearchQuery);
        if(!searchResult){
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            })
        }
        return res.status(200).json({
            success: true,
            data: searchResult
        })

    }catch(e){
       console.log(e);
       return res.status(500).json({
        success: false,
        message: "Some error occured"
       })
    }
}
module.exports = {searchProducts}