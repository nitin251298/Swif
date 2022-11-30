import React,{useEffect,useState} from 'react';
import { View, TouchableOpacity, Text,SafeAreaView,Image,FlatList,Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite'
import InternetConnectionAlert from "react-native-internet-connection-alert";

const db = SQLite.openDatabase('SwifDb');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let bottomtab = [
    {
        key: 1,
        iconName: 'home-outline'
    },
    // {
    //     key: 2,
    //     iconName: 'list'
    // },
    {
        key: 3,
        iconName: 'notifications-outline'
    },
    {
        key: 4,
        iconName: 'person-outline'
    }
]

const Notification = ({navigation}) => {

    const dispatch = useDispatch();
    const [activeIndex, setactiveIndex] = useState(0)
    const [loading, setloading] = useState(false)
    const [logindata, setLoginData] = useState([]);

    useEffect(() => {
        // console.log('dsh');
        // AsyncStorage.getItem('USER',(err,result)=>{
        //     if(err){
        //         console.log(err);
        //       }
        //       if(result){
        //           var res = JSON.parse(result);
        //           // console.log("pop",result);
        //           if(res.loginERR){
        //           }
        //           setLoginData(JSON.parse(result));
                  
        //           // console.log("boooooooo",res);
        //       }
        //   })
        // console.log("booo",logindata);

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                [],
                (tx, results) => {
                    console.log("USER:", JSON.stringify(results));
                    setting(results)
                }
            );
        });


        
    },[])

    const setting = (value) => {
        setLoginData(value.rows._array[0])
        console.log(logindata);
    }


    const SelectTab = (item, index) => {
        // this function is used for bottom tab navigation in dashboard,connection,notification and profle screen
        setactiveIndex(index)
        // console.log(Profiledata.userdetail.id)
        if (index === 0) {
            setloading(true)
            navigation.navigate('Dashboard')
            setloading(false)
        }
        // if (index === 1) {
        //     navigation.navigate('HistroyPage')
        // }
        if (index === 1) {
            navigation.navigate('Notification')
        }
        if (index === 2) {
            navigation.navigate('Profile')
        }
    }

    return (
        <SafeAreaView style={{flex:1}}>
        <InternetConnectionAlert
  onChange={(connectionState) => {
    console.log("Connection State: ", connectionState);
  }}
>
            <View style={{height:'92%'}}>
        <View style={{ paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Image
                        source={{ uri: logindata.profile_image }}
                        style={{ height: 50, width: 50, resizeMode: 'cover', borderRadius: 50, }}
                    />
                    <Text style={{ alignSelf: 'center', paddingLeft: 15, color: '#6F00C5', fontSize: 18, fontWeight: 'bold', fontFamily: 'Roboto' }}>{logindata.name}</Text>
                </View>
                <View style={{ alignContent: 'flex-end', alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
                    <Image
                        source={{ uri: logindata.company_logo }}
                        style={{ height: 50, width: 50, resizeMode: 'cover', borderRadius: 50 }}
                    />
                </View>
            </View>
            <View style={{alignSelf:'center',justifyContent:'center',paddingTop:'68%'}}>
                <Text style={{textAlign:'center',fontSize:20,fontWeight:'500'}}>
                    No Data
                </Text>
            </View>
            </View>
            <View style={{  backgroundColor: '#fff',alignSelf:'auto',}}>
                <FlatList
                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'space-between',marginBottom:10 }}
                    horizontal={true}
                    data={bottomtab}    // CALL BACK FUNCTIONS FOR BOTTOM TAB
                    keyExtractor={(item) => item.key}
                    renderItem={({ item, index }) =>
                        <TouchableOpacity
                            onPress={() => SelectTab(item, index)}     // CALL BACK FUNCTION FOR SELECT BOTTOM TAB ICONS
                            style={{ flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 50, paddingLeft: 20, paddingRight: 20, paddingBottom: 20, margin: 10 }}>
                            <Icon name={item.iconName} size={20} color={"#000"} />

                        </TouchableOpacity>
                    }
                />
            </View>
            </InternetConnectionAlert>
            </SafeAreaView>
    )
}

export default Notification