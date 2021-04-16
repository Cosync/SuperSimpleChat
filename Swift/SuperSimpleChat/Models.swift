//
//  Models.swift
//  SuperSimpleChat
//
//  Licensed to the Apache Software Foundation (ASF) under one
//  or more contributor license agreements.  See the NOTICE file
//  distributed with this work for additional information
//  regarding copyright ownership.  The ASF licenses this file
//  to you under the Apache License, Version 2.0 (the
//  "License"); you may not use this file except in compliance
//  with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing,
//  software distributed under the License is distributed on an
//  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//  KIND, either express or implied.  See the License for the
//  specific language governing permissions and limitations
//  under the License.
//
//  Created by Richard Krueger on 7/20/20.
//  Copyright © 2020 cosync. All rights reserved.
//

import Foundation
import RealmSwift

class UserData: Object, ObjectKeyIdentifiable {
    @objc dynamic var _id = ObjectId.generate()
    @objc dynamic var uid = ""
    @objc dynamic var name = ""
    override static func primaryKey() -> String? {
        return "_id"
    }
    override static func indexedProperties() -> [String] {
        return ["uid"]
    }
    
    convenience init(uid: String, name: String) {
        self.init()
        self.uid = uid
        self.name = name
    }
}

class ChatEntry: Object, ObjectKeyIdentifiable {
    @objc dynamic var _id = ObjectId.generate()
    @objc dynamic var name = ""
    @objc dynamic var text = ""
    @objc dynamic var createdAt: Date? = nil

    override static func primaryKey() -> String? {
        return "_id"
    }
    override static func indexedProperties() -> [String] {
        return ["createdAt"]
    }
    
    convenience init(name: String, text: String) {
        self.init()
        self.name = name
        self.text = text
        self.createdAt = Date()
    }
}
