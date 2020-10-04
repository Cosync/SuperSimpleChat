//
//  ChatView.swift
//  SuperSimpleChat
//
//  Created by Richard Krueger on 7/20/20.
//  Copyright © 2020 cosync. All rights reserved.
//

import SwiftUI

struct ChatView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var userDataState: UserDataState
    @EnvironmentObject var chatEntryState: ChatEntryState
    @State private var chatText = ""
    
    func addChatMessage() -> Void {
        let chatEntry = ChatEntry(partition: "chat", name: userDataState.name, text: self.chatText)
        try! RealmManager.shared.chatRealm.write {
            RealmManager.shared.chatRealm.add(chatEntry)
        }
        self.chatText = ""
    }

    var body: some View {
        NavigationView {
            ZStack {
                VStack(spacing: 25) {

                    List {

                        ForEach(0..<self.chatEntryState.count, id: \.self) { index in
                            VStack(alignment: .leading) {
                                Text(self.chatEntryState.chatEntryName(index))
                                    .foregroundColor(.gray)
                                    .font(Font.caption)
                                    .padding(.bottom)
                                Text(self.chatEntryState.chatEntryText(index)).font(Font.title)
                            }
                            .padding()
                            .rotationEffect(.radians(.pi))
                            .scaleEffect(x: -1, y: 1, anchor: .center)

                        }

                    }
                    .rotationEffect(.radians(.pi))
                    .scaleEffect(x: -1, y: 1, anchor: .center)
                    
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
                                    self.chatEntryState.cleanup()
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

struct ChatView_Previews: PreviewProvider {
    static var previews: some View {
        ChatView()
        .environmentObject(AppState())
        .environmentObject(UserDataState())
        .environmentObject(ChatEntryState())
    }
}
