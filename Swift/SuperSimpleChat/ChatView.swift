//
//  ChatView.swift
//  SuperSimpleChat
//
//  Created by Richard Krueger on 7/20/20.
//  Copyright © 2020 cosync. All rights reserved.
//

import SwiftUI
import RealmSwift

struct ChatView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var userDataState: UserDataState
    @State private var chatText = ""
    
    @ObservedResults(ChatEntry.self, sortDescriptor: SortDescriptor(keyPath: "createdAt", ascending: true)) var chatEntries
    
    @State private var realmChatsNotificationToken: NotificationToken?

    func addChatMessage() -> Void {
        let chatEntry = ChatEntry(name: userDataState.name, text: self.chatText)
        $chatEntries.append(chatEntry)
        self.chatText = ""
    }
    
    var body: some View {
        
        NavigationView {
            ZStack {
                VStack(spacing: 25) {
                    
                    ScrollView {
                        ScrollViewReader { proxy in
                            LazyVStack(alignment: .leading, spacing: 5) {
                                ForEach(chatEntries) { chatEntry in
                                    VStack(alignment: .leading) {
                                        Text(chatEntry.name)
                                            .foregroundColor(.gray)
                                            .font(Font.caption)
                                            .padding(.bottom)
                                        Text(chatEntry.text).font(Font.title)
                                    }
                                    .id(chatEntry._id)
                                    .padding()
                                }

                            }
                            .onAppear() {
                                if let last = chatEntries.last {
                                    proxy.scrollTo(last._id, anchor: .bottom)
                                }                            }
                            .onChange(of: chatEntries.count) { _ in
                                if let last = chatEntries.last {
                                    proxy.scrollTo(last._id, anchor: .bottom)
                                }
                            }
                        }
                    }
                    
                   // Spacer()
                    HStack(spacing: 10) {
                        TextField("Type a message", text: $chatText, onCommit: {
                            self.addChatMessage()
                           
                        })
                           .padding(10)
                           .overlay(
                               // Add the outline
                               RoundedRectangle(cornerRadius: 8)
                                   .stroke(Color.blue, lineWidth: 2)
                           )
                        
                        Button(action: {
                            self.addChatMessage()
                        }) {
                            Image(systemName: "arrow.up.circle.fill")
                        }
                        .font(.largeTitle)
                    }
                .padding()
                    
                }
                .font(.title)
                .padding(.top, 25)
            }
            // Use .inline for the smaller nav bar
            .navigationBarTitle(Text(self.userDataState.name), displayMode: .inline)
            .navigationBarItems(
                    // Button on the leading side
                    leading:
                    Button(action: {
                        RealmManager.shared.logout( onCompletion: { (error) in
                                DispatchQueue.main.sync {
                                    self.appState.target = .login
                                    self.userDataState.cleanup()
                                }
                            }
                        )
                    }) {
                        Text("Logout")
                    }.accentColor(.blue)
            )
            .edgesIgnoringSafeArea(.bottom)
        }
    }
}
