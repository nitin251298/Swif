import React,{useEffect,useState} from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import * as SQLite from 'expo-sqlite'
// import sqlite from 'react-native-sqlite-storage';


const db = SQLite.openDatabase('Swif');

const Splash = () => {

    useEffect(() => {

        db.transaction(function (txn) {
            txn.executeSql(
              "SELECT name FROM sqlite_master WHERE type='table' AND name='Student_Table'",
              [],
              function (tx, res) {
                console.log('item:', res.rows.length);
                if (res.rows.length == 0) {
                  txn.executeSql('DROP TABLE IF EXISTS Student_Table', []);
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS Student_Table(student_id INTEGER PRIMARY KEY AUTOINCREMENT, student_name VARCHAR(30), student_phone INT(15), student_address VARCHAR(255))',
                    []
                  );
                }
                insertData();
              }
            );
          })

           
            // db.transaction(tx => {
            //     tx.executeSql('SELECT * FROM USERS', [], (tx, results) => {
            //         console.log("Query completed");
            //         console.log( JSON.stringify(results) )
                     
            //         var data = results.rows._array;
            //         var len = results.rows.length;
        
            //         console.log('====================================');
            //         // console.log(len);
            //         console.log('====================================');
            //         // console.log(data);
            //         console.log('====================================');
                   
            //         // console.log('====================================');
            //         // for (let i = 0; i < len; i++) {
            //         //   let row = results.rows.item(i);
            //         //   console.log(`BrandName: ${row.brand_name}, Score: ${row.brand_score}`);
            //         // }
            //         });
            // })
    },[])
  const viewStudent = () => {
 
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Student_Table',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          console.log(temp);
        }
      );
    });
    // 'INSERT INTO USERS (id, name, contact,username,address,company_logo,email,gender,profile_image,token) VALUES (?,?,?,?,?,?,?,?,?)',
  }
  const insertData = () => {
 
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO Student_Table (student_name, student_phone, student_address) VALUES (?,?,?)',
        ["booi", "hoi", "bog"],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert('Data Inserted Successfully....');
          } else alert('Failed....');
        }
      );
    });
 
    viewStudent() ;
 
  }


    const createTable = () => {

          
    }

    const Entry = () => {
        
    }


   

    return (
        <View style={{flex:1,justifyContent:'center'}}>
            <Text>Hiiiii</Text>
        </View>
    )
}

export default Splash