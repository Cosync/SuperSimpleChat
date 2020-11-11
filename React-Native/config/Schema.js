 

exports.ChatEntry = {
    "name":"ChatEntry",
    "primaryKey":"_id",
    "properties": {
        "_id":{ "type": "objectId", "indexed": true }, 
        "_partition": "string",
        "chatId":{ "type": "string", "indexed": true },  
        "uid":{ "type": "string", "indexed": true },   
        "entryType":{ "type": "string", "indexed": true },
        "content":{ "type": "string", "indexed": true },
        "asset": { "type": "CosyncAsset", "optional": true },
        "status":{ "type": "string", "indexed": true, "default": 'active' },
        "createdAt": {  "type": "date" , "optional": true , "indexed": true },
        "updatedAt": {  "type": "date" , "optional": true, "indexed": true } 
    }
}; 

 

exports.CosyncAsset = {
    "name":"CosyncAsset",
    "primaryKey":"_id",
    "properties": {
        "_id":{ "type": "objectId", "indexed": true }, 
        "_partition": "string",
        "uid":{ "type": "string", "indexed": true },
        "contentType":{ "type": "string", "indexed": true},   
        "assetType":{ "type": "string", "indexed": true },
        "path":{ "type": "string", "indexed": true},
        "expires":{ "type": "bool", "indexed": true, "default": false},
        "caption": { "type": "string", "default": "" },
        "url":{ "type": "string", "optional": true },
        "urlSmall": { "type": "string", "optional": true },
        "urlMedium": { "type": "string", "optional": true },
        "urlLarge": { "type": "string", "optional": true },
        "urlVideoPreview": { "type": "string", "optional": true },
        "color": { "type": "string", "default":"#000000" },
        "xRes": { "type": "int", "default": 0 },
        "yRes": { "type": "int", "default": 0 },
        "size":{ "type": "int", "optional": true },
        "duration":{ "type": "int", "optional": true },
        "chatId":{ "type": "string", "indexed": true, "optional": true },
        "applianceId":{ "type": "string", "indexed": true, "optional": true },
        "status":{ "type": "string", "default": "active", "indexed": true },
        "createdAt": { "type": "date" , "optional": true, "indexed": true },
        "updatedAt": { "type": "date" , "optional": true } 
         
    }
}; 
