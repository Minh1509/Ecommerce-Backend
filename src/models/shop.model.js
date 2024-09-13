'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const document_name = 'shop';
const collection_name = "shops";
// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name:{
        type:String,
        trim: true,
        maxLength : 150
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true
    },
    password:{
        type:String,
        required:true,
    },
    status : {
        type: String,
        enum : ['active', 'inactive'],
        default: 'inactive'
    },
    roles : {
        type : Array,
        default: []
    }},
    {timestamps : true,
    collection: collection_name
    
});

//Export the model
module.exports = model(document_name, shopSchema);