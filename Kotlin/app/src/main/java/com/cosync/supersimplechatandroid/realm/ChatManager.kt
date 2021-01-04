/**
    ChatManager.kt
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

import android.util.Log
import io.realm.OrderedRealmCollectionChangeListener
import io.realm.RealmResults
import io.realm.Sort
import io.realm.kotlin.where

/**
 * Acts as the data source for realm user and chats used in the application. It depends
 * on Realm manager having opened a session and logged in user. Clients have access to user
 * and chat collections as well as the ability subscribe to change events.
 */
object ChatManager {

    var userEntries: RealmResults<UserData> = RealmManager.userRealm?.where<UserData>()?.findAllAsync()!!
    var chatEntries: RealmResults<ChatEntry> = RealmManager.chatRealm?.where<ChatEntry>()?.sort("createdAt", Sort.ASCENDING)!!.findAllAsync()
    lateinit var me: UserData
    private var usersInitialized: Boolean = false
    private var userListeners: MutableList<UserListener> = mutableListOf<UserListener>()
    private var chatListeners: MutableList<ChatListener> = mutableListOf<ChatListener>()

    class UserListener(var listener: (RealmResults<UserData>) -> Unit) {}
    class ChatListener(var listener: (RealmResults<ChatEntry>) -> Unit) {}

    init {
        userEntries.addChangeListener(OrderedRealmCollectionChangeListener<RealmResults<UserData>> { collection, changeSet ->
            if (!usersInitialized) {

                if (!ChatManager::me.isInitialized) {
                    var _me = RealmManager.app?.currentUser()!!
                    collection.forEach() {
                        if (it.uid == _me.id)
                        {
                            me = it
                            usersInitialized = true
                        }
                    }
                }

                userListeners.forEach() {
                    it.listener(userEntries)
                }

                chatEntries.addChangeListener(OrderedRealmCollectionChangeListener<RealmResults<ChatEntry>> { collection, changeSet ->
                    Log.i("User Observable", "Initialized")
                    chatListeners.forEach {
                        it.listener(chatEntries)
                    }
                })
            }
        })
    }

    fun AddChatListener(listener: (RealmResults<ChatEntry>) -> Unit) {
        chatListeners.add(ChatListener(listener))
    }

    fun AddUserListener(listener: (RealmResults<UserData>) -> Unit) {
        userListeners.add(UserListener(listener))
    }
}