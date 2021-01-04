/**
    ChatActivity.kt
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

package com.cosync.supersimplechatandroid.chat

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.cosync.supersimplechatandroid.realm.ChatEntry
import com.cosync.supersimplechatandroid.realm.ChatManager
import com.cosync.supersimplechatandroid.realm.RealmManager
import com.cosync.supersimplechatandroid.R
import com.cosync.supersimplechatandroid.main.MainActivity
import org.bson.types.ObjectId

class ChatActivity : AppCompatActivity() {

    private lateinit var enterMessage: EditText
    private lateinit var send: Button
    private lateinit var logout: Button
    private lateinit var messagesList: RecyclerView
    private lateinit var messagesAdapter: MessagesAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat)

        enterMessage = findViewById(R.id.enter_message)
        send = findViewById(R.id.send_message)
        logout = findViewById(R.id.button_logout)
        messagesList = findViewById(R.id.messages)
        val layoutMgr = LinearLayoutManager(this)
        layoutMgr.stackFromEnd = true
        messagesList.layoutManager = layoutMgr

        messagesAdapter = MessagesAdapter("foo")
        messagesList.adapter = messagesAdapter

        send.setOnClickListener {
            sendMessage()
        }

        logout.setOnClickListener {
            logout()
        }

        initializeListeners()
    }

    private fun sendMessage() {

        val chatEntry = ChatEntry(ObjectId(), ChatManager.me.uid, ChatManager.me.name, enterMessage.text.toString())
        RealmManager.chatRealm?.executeTransaction(){ transactionRealm ->
            transactionRealm.insert(chatEntry)
        }
        enterMessage.setText("")
        scrollToBottom()
    }

    private fun logout() {
        RealmManager.logout()
        val intent = Intent(this, MainActivity::class.java).apply {
        }
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(intent)
    }

    fun initializeListeners() {
        ChatManager.AddUserListener {
            val textMe: TextView = findViewById(R.id.text_me)
            textMe.text = ChatManager.me.name
        }

        ChatManager.AddChatListener {
            messagesAdapter.notifyDataSetChanged()
            scrollToBottom()
        }
    }

    private fun scrollToBottom() {
        messagesList.scrollToPosition(messagesAdapter.itemCount - 1)
    }
}