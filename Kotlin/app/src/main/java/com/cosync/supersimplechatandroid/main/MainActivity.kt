/**
  MainActivity.kt
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

package com.cosync.supersimplechatandroid.main

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.viewpager.widget.ViewPager
import com.cosync.supersimplechatandroid.realm.*
import com.cosync.supersimplechatandroid.chat.*
import com.cosync.supersimplechatandroid.R
import com.cosync.supersimplechatandroid.realm.UserData
import com.google.android.material.tabs.TabLayout
import org.bson.types.ObjectId

/**
 *
 */
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val sectionsPagerAdapter = SectionsPagerAdapter(this, supportFragmentManager)
        val viewPager: ViewPager = findViewById(R.id.view_pager)
        viewPager.adapter = sectionsPagerAdapter
        val tabs: TabLayout = findViewById(R.id.tabs)
        tabs.setupWithViewPager(viewPager)

        Log.i("Main", "Initializing realm...")
        RealmManager.initialize(this)
    }


    fun onLogin(view: View) {
        val user = findViewById<EditText>(R.id.editUserName).text.toString()
        val password = findViewById<EditText>(R.id.editLoginPassword).text.toString()
        if (!password.isEmpty() && !user.isEmpty()) {
            RealmManager.login(user, password) {
                if (it == 0) {
                    Log.i("Main", "Realm login success")
                    val intent = Intent(this, ChatActivity::class.java).apply {
                    }
                    startActivity(intent)
                } else {
                    Log.i("Main", "Realm login error")
                }
            }
        }
    }

    fun onSignup(view: View) {

        val user = findViewById<EditText>(R.id.editSignupEmail).text.toString()
        val password = findViewById<EditText>(R.id.editSignupPassword).text.toString()
        val name = findViewById<EditText>(R.id.editSignupName).text.toString()
        RealmManager.signup(user, password){
            if (it == 0){
                Log.i("Main", "Realm register success")
                RealmManager.login(user, password) {
                    if (it == 0) {
                        Log.i("Main", "Realm login success")
                        val uid = RealmManager.app?.currentUser()!!.id
                        val userEntry = UserData(ObjectId(), uid, uid, name)
                        RealmManager.userRealm?.executeTransaction() { transactionRealm ->
                            transactionRealm.insert(userEntry)
                        }
                        val intent = Intent(this, ChatActivity::class.java).apply {
                        }
                        startActivity(intent)
                    } else {
                        Log.i("Main", "Realm login failure")
                    }
                }
            } else {
                Log.i("Main", "Realm register failure")
            }
        }
    }
}