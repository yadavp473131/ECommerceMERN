const Address = require("../../models/Address");


const addAddress = async(req , res)=>{
    try{
         const {userId, address, city, pincode, phone, notes} = req.body;

         if(!userId || !address || !city || !pincode || !phone || !notes){
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!"
            })
         }
         const newlyCreatedAddress = new Address({userId, address, city, pincode, phone, notes});
         await newlyCreatedAddress.save();
         return res.status(201).json({
            success: true,
            data: newlyCreatedAddress
         })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "some error occured"
        });
    }
}
const fetchAllAddress = async(req , res)=>{
    try{
       const { userId } = req.params;
       if(!userId){
        return res.status(400).json({
                success: false,
                message: "Invalid data provided!"
            })
       }
       const addressList = await Address.find({userId});
       if(!addressList){
        return res.status(404).json({
                success: false,
                message: "Address Not Found!"
            })
       }
       return res.status(200).json({
            success: true,
            data: addressList
         })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "some error occured"
        });
    }
}
const editAddress = async(req , res)=>{
    try{
        const {userId, addressId} = req.params;
        const formData = req.body;
        if(!userId || !addressId){
            return res.status(400).json({
                success: false,
                message: "User and address id is required!"
            })
         }

         const address = await Address.findOneAndUpdate({_id: addressId, userId }, formData, { new:true });
         if(!address){
            return res.status(404).json({
                success: false,
                message: "Address not found!"
            })
         }
         return res.status(200).json({
            success: true,
            message: address
         })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "some error occured"
        });
    }
}
const deleteAddress = async(req , res)=>{
    try{
       const {userId, addressId} = req.params;
       if(!userId || !addressId){
            return res.status(400).json({
                success: false,
                message: "User and address id is required!"
            })
         }
         
         const address = await Address.findOneAndDelete({_id: addressId, userId });
         if(!address){
            return res.status(404).json({
                success: false,
                message: "Address not found!"
            })
         }
         return res.status(200).json({
            success: true,
            message: "Address deleted successfully"
         })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "some error occured"
        });
    }
}

module.exports = { addAddress, fetchAllAddress, editAddress, deleteAddress};