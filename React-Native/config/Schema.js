 

exports.ChatEntry = {
    "name":"ChatEntry",
    "primaryKey":"_id",
    "properties": {
        "_id":{ "type": "objectId", "indexed": true }, 
        "_partition": "string", 
        "name":{ "type": "string", "indexed": true }, 
        "text":{ "type": "string", "indexed": true }, 
        "createdAt": {  "type": "date" , "optional": true , "indexed": true },
        
    }
}; 

  