//
//  LoginView.swift
//  SuperSimpleChat
//
//  Created by Richard Krueger on 7/20/20.
//  Copyright © 2020 cosync. All rights reserved.
//

import SwiftUI

struct LoginView: View {

    var body: some View {

        TabView {

            LoginTab().tabItem {
                Image(systemName: "arrow.right.square")
                Text("Login")
            }
            SignupTab().tabItem {
                Image(systemName: "person.badge.plus")
                Text("Signup")
            }
        }
    }
}

struct LoginTab: View {
    @State private var email = ""
    @State private var password = ""
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var userDataState: UserDataState
    @State var isLoggingIn = false

    var body: some View {
        VStack(spacing: 20) {
            
            Text("Super Simple Chat")
                .font(.largeTitle)
            
            Divider()
            
            Group {
                TextField("Email", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .disableAutocorrection(true)
                .keyboardType(.emailAddress)
                .autocapitalization(UITextAutocapitalizationType.none)
            
                SecureField("Password", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .disableAutocorrection(true)
                .autocapitalization(UITextAutocapitalizationType.none)
                
                if isLoggingIn {
                    ProgressView()
                }
            }
            .padding(.horizontal)
            
            Divider()
            
            Button(action: {
                isLoggingIn = true
                RealmManager.shared.login(self.email, password: self.password, onCompletion: { (error) in
                        DispatchQueue.main.async {
                            isLoggingIn = false
                            NSLog("Login success")
                            self.userDataState.setup()
                            self.appState.target = .chat
                        }
                    }
                )
            }) {
                Text("Login")
                    .padding(.horizontal)
                Image(systemName: "arrow.right.square")
            }
            .padding()
            .foregroundColor(Color.white)
            .background(Color.green)
            .cornerRadius(8)

        }.font(.title)
    }
}

struct SignupTab: View {
    @State private var email = ""
    @State private var password = ""
    @State private var name = ""
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var userDataState: UserDataState
    @State var isLoggingIn = false
    var body: some View {
        VStack(spacing: 20) {
            
            Text("Super Simple Chat")
                .font(.largeTitle)
            
            Divider()
            
            Group {
                TextField("Email", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .disableAutocorrection(true)
                .keyboardType(.emailAddress)
                .autocapitalization(UITextAutocapitalizationType.none)
            
                SecureField("Password", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .disableAutocorrection(true)
                .autocapitalization(UITextAutocapitalizationType.none)
                
                TextField("Name", text: $name)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                
                if isLoggingIn {
                    ProgressView()
                }

            }
            .padding(.horizontal)
            
            Divider()
            
            Button(action: {
                isLoggingIn = true
                RealmManager.shared.signup(self.email, password: self.password, name: self.name, onCompletion: { (error) in
                        DispatchQueue.main.async {
                            NSLog("Signup success")
                            isLoggingIn = false
                            self.userDataState.setup()
                            self.appState.target = .chat
                        }
                    }
                )
            }) {
                Text("Signup")
                    .padding(.horizontal)
                Image(systemName: "person.badge.plus")
            }
            .padding()
            .foregroundColor(Color.white)
            .background(Color.blue)
            .cornerRadius(8)

        }.font(.title)
    }
}

