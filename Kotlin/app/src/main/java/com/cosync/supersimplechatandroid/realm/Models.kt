/**
    Models.kt
    SuperSimpleChatAndroid

    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.

    Copyright © 2020 cosync. All rights reserved.
 */

package com.cosync.supersimplechatandroid.realm

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey
import org.bson.types.ObjectId
import java.util.*

/**
 * Chat user model for Realm
 */
open class UserData(
    @PrimaryKey var _id: ObjectId = ObjectId(),
    var _partition: String = "",
    var uid: String = "",
    var name: String = ""
):RealmObject() {}

/**
 * Chat item model for Realm
 */
open class ChatEntry(
    @PrimaryKey var _id: ObjectId = ObjectId(),
    var _partition: String = "",
    var name: String = "",
    var text: String = "",
    var createdAt: Date? = Date()
) :RealmObject() {}
