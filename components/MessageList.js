import React, { useRef } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
 
export default function MessagesList({ messages, currentUser }) {
 
 const flatListRef = useRef(); // used to reference the FlatList itself to perform scroll to end operation when new messages come in
 
 const renderFlatListItem = (item) => {
   return (
     <View>
       <View
         style={
            currentUser.uid === item.authorUid
             ? styles.message__fromCurrentUser
             : styles.message__fromOthers
         }
       >
         <View style={styles.message__header}>
           <Text style={styles.message__author}>{item.author}</Text>
           <Text>{item.date}</Text>
           
         </View>

         {
            item.type == 'image'
            ?
            <Image style={styles.img} source={{ uri: item.content}}/>
            :
            <Text>{item.content}</Text>
        }
            
         
         
        
       </View>
     </View>
   );
 };
 
 return (
   <FlatList
     style={styles.messagesList}
     data={messages}
     onContentSizeChange={() =>
       flatListRef.current.scrollToEnd({ animated: true })
     }
     renderItem={(item) => renderFlatListItem(item.item)}
     keyExtractor={(item) => item.id} // needed for the FlatList to set an unique key for each item of the list
 
     ref={flatListRef}
   />
 );
}
 
const styles = StyleSheet.create({
    img: {
        width: 150,
        height: 150 
    },
    messagesList: {
        marginTop: 30,
        marginBottom: 30,
        alignSelf: "stretch",
    },
    message__fromCurrentUser: {
        backgroundColor: "#9EE493",
        alignSelf: "flex-end",
        margin: 5,
        width: 250,
        padding: 5,
        borderRadius: 5,
    },
    message__fromOthers: {
        backgroundColor: "#86BBD8",
        alignSelf: "flex-start",
        margin: 5,
        width: 250,
        padding: 5,
        borderRadius: 5,
    },
    message__header: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    message__author: {
        fontWeight: "bold",
    },
});