/**
    MessagesAdapter.kt
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

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.cosync.supersimplechatandroid.realm.ChatEntry
import com.cosync.supersimplechatandroid.realm.ChatManager
import com.cosync.supersimplechatandroid.R

class MessagesAdapter(private val uid: String) : RecyclerView.Adapter<MessagesAdapter.MessageViewHolder>() {

    companion object {
        private const val SENT = 0
        private const val RECEIVED = 1
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MessageViewHolder {
        val view = when (viewType) {
            SENT -> {
                LayoutInflater.from(parent.context).inflate(R.layout.item_sent, parent, false)
            }
            else -> {
                LayoutInflater.from(parent.context).inflate(R.layout.item_received, parent, false)
            }
        }
        return MessageViewHolder(view)
    }

    override fun getItemCount() = ChatManager.chatEntries.size

    override fun onBindViewHolder(holder: MessageViewHolder, position: Int) {
        holder.bind(ChatManager.chatEntries[position]!!)
    }

    override fun getItemViewType(position: Int): Int {
        return if (ChatManager.chatEntries[position]!!.name == ChatManager.me.name) {
            SENT
        } else {
            RECEIVED
        }
    }

    inner class MessageViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView){
        private val messageText: TextView? = itemView.findViewById(R.id.message_text)
        private val messageName: TextView? = itemView.findViewById(R.id.text_name)
        fun bind(message: ChatEntry) {
            messageText?.text = message.text
            if (messageName != null){
                messageName.text = message.name
            }
        }
    }
}