const providerModel = require('../models/sprovider.model');

async function getAllProviders(req,res) {
 
    const providers = await providerModel.find();
    return res.status(200).json({success:true,providers});
}

async function getProviderById(req,res) {
    const {providerId} = req.params;
    console.log("Fetching provider with ID:", providerId);
    const provider = await providerModel.findById(providerId);
    if(!provider){
        return res.status(404).json({success:false,message:"Provider not found"});
    }
    return res.status(200).json({success:true,provider});
}

module.exports = {getAllProviders,getProviderById};