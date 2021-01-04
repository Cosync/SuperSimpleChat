/**
    RealmManager.kt
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

import android.content.Context
import android.util.Log
import io.realm.Realm
import io.realm.mongodb.App
import io.realm.mongodb.AppConfiguration
import io.realm.mongodb.Credentials
import io.realm.mongodb.User
import io.realm.mongodb.auth.EmailPasswordAuth
import io.realm.mongodb.sync.SyncConfiguration

const val APP_ID = "cosyncchat-naqms"

/**
 * Provides utility functions that implement realm operations such as initialization and
 * user management.
 */
object RealmManager {

    var app: App? = null
    var userRealm: Realm? = null
    var chatRealm: Realm? = null

    init {
    }

    /**
     * Function must be called before using this singleton. Initializes realm app.
     */
    fun initialize(context: Context) {
        Realm.init(context)

        val appID : String = APP_ID;
        app = App(
            AppConfiguration.Builder(appID)
            .build())
    }

    /**
     * Logs in a realm user.
     *
     * Returns: 0 if success, -1 otherwise
     */
    fun login(user: String, password: String, completion: (result: Int) -> Unit) {

        val credentials: Credentials = Credentials.emailPassword(user, password)
        app?.loginAsync(credentials) {
            if (it.isSuccess) {
                Log.v("Login", "Successfully authenticated with email/password.")
                val user: User? = app?.currentUser()
                initRealms(completion)
            } else {
                Log.e("Login", "Failed to log in. Error: ${it.error}")
                completion(-1)
            }
        }
    }

    /**
     * Logs out the current realm user.
     *
     * Returns: NA
     */
    fun logout() {
        val user: User? = app?.currentUser()
        user?.logOut();
    }

    /**
     * Registers a new realm user.
     *
     * Returns: 0 if success, -1 otherwise
     */
    fun signup(email: String, password: String, completion: (result: Int) -> Unit){
        val authProvider: EmailPasswordAuth? = app?.emailPassword
        authProvider?.registerUserAsync(email, password){
            if (it.isSuccess) {
                completion(0)
            } else {
                completion(-1)
            }
        }
    }

    /**
     * Initialiizes the realms used in the chat application. Called on successful login.
     *
     * Returns: 0 if success, -1 otherwise
     */
    private fun initRealms(completion: (result: Int) -> Unit) {

        val user: User? = app?.currentUser()
        if (user != null) {

            val uid: String = user.id

            val config = SyncConfiguration.Builder(user!!, uid)
                .allowQueriesOnUiThread(true)
                .allowWritesOnUiThread(true)
                .build()

            Realm.getInstanceAsync(config, object : Realm.Callback () {
                override fun onSuccess(realm: Realm) {
                    userRealm = realm
                    val configChat = SyncConfiguration.Builder(user!!, "chat")
                        .allowQueriesOnUiThread(true)
                        .allowWritesOnUiThread(true)
                        .build()
                    Realm.getInstanceAsync(configChat, object : Realm.Callback () {
                        override fun onSuccess(realm: Realm) {
                            chatRealm = realm
                            completion(0)
                        }

                        override fun onError(exception: Throwable) {
                            completion(-1)
                        }
                    })
                }

                override fun onError(exception: Throwable) {
                    completion(-1)
                }
            })
        }
    }
}