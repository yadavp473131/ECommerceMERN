const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");


const handleImageUpload = async(req, res) =>{
    try{
        // req.file contains the uploaded file (from multer)
        // req.file.buffer is the raw binary data of the file.
        // Buffer.from(...).toString('base64') converts that binary into a Base64 string (text-friendly encoding of binary data).
        //Now b64 is just the Base64 text of the file content.
       const b64 = Buffer.from(req.file.buffer).toString('base64');
       //req.file.mimetype might be something like "image/png" or "image/jpeg".
        //This line builds a Data URI like:
       //data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
       const url = "data:" +req.file.mimetype + ";base64," + b64;
       const result = await imageUploadUtil(url);

       res.json({
        success: true,
        result
       })

    }catch(error){
      console.log(error);
      res.json({
        success: false,
        message: 'Error Occured'
      })
    }
}

//add a new product
const addProduct = async(req, res) =>{
    try{

      const {image,title, description, brand, category, price, salePrice, totalStock} = req.body;
      const newlyCreatedProduct = new Product({image,title, description, brand, category, price, salePrice, totalStock});
      await newlyCreatedProduct.save(); 
      
      res.status(201).json({
        success: true,
        message: "Product added successfully",
        data : newlyCreatedProduct
      });
      
    }catch(e){
       console.log(e);
       return res.status(500).json({
        success : false,
        message : 'Error Occured'
       })
    }
}

//fetch all products
const fetchAllProducts = async(req, res) =>{
 
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
    try{
        const listOfProducts = await Product.find({});
        res.status(200).json({
            success:true,
            data: listOfProducts
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : 'Error Occured'
        })
    }
}

//edit a product
const editProduct = async(req, res)=>{

    try{
        const {id} = req.params;
        const {image,title, description, brand, category, price, salePrice, totalStock} = req.body;
        let findProduct = await Product.findById(id);
        if(!findProduct) return res.status(404).json({
            success : false,
            message:'Product not found'
        });

        findProduct.title = title || findProduct.title
        findProduct.description = description || findProduct.description
        findProduct.category = category || findProduct.category
        findProduct.brand = brand || findProduct.brand
        findProduct.price = price=== '' ?0:price || findProduct.price
        findProduct.salePrice = salePrice=== '' ?0: salePrice || findProduct.salePrice
        findProduct.totalStock = totalStock || findProduct.totalStock
        findProduct.image = image || findProduct.image

        await findProduct.save();
        return res.status(200).json({
            success: true,
            message: 'product edited successfully',
            data: findProduct
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : 'Error Occured'
        })
    }
    
}
//delete a product
const deleteProduct = async(req, res)=>{

    
    try{
        const {id} = req.params;
        const product = await  Product.findByIdAndDelete(id);
        
        if(!product) return res.status(404).json({
            success: false,
            message: "product was not found"
        });

        return res.status(200).json({
            success:true,
            message:'Product deleted successfully'
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : 'Error Occured'
        })
    }
}

module.exports = {handleImageUpload, addProduct, editProduct, fetchAllProducts, deleteProduct};