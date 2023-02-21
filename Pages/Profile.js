import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, Image, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite'
import InternetConnectionAlert from "react-native-internet-connection-alert";
import NetInfo from "@react-native-community/netinfo";
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


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
    // {
    //     key: 3,
    //     iconName: 'notifications-outline'
    // },
    {
        key: 4,
        iconName: 'person-outline'
    }
]

const Profile = ({ navigation }) => {

    const dispatch = useDispatch();
    const [activeIndex, setactiveIndex] = useState(0)
    const [loading, setloading] = useState(false)
    const [logindata, setLoginData] = useState([]);
    const Db = useSelector(state => state.Db)
    const [IntStatus, setintStatus] = useState(false);
    const [ProfileImage, setProfileImage] = useState('');

    useEffect(() => {

        NetInfo.addEventListener(networkState => {
            console.log("Connection type - ", networkState.type);
            console.log("Is connected? - ", networkState.isConnected);
            setintStatus(networkState.isConnected);
        });


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
        // txn.executeSql('DROP TABLE IF EXISTS users', []);
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


    }, []);

    const refresh = () => {
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
    }


    const log = () => {
        db.transaction((tx) => {
            tx.executeSql('DROP TABLE IF EXISTS workorder', [])
            tx.executeSql('DROP TABLE IF EXISTS cancel', [])
            tx.executeSql('DROP TABLE IF EXISTS reschedule', [])
            tx.executeSql('DROP TABLE IF EXISTS status', [])
            tx.executeSql('DROP TABLE IF EXISTS hell', [])
            tx.executeSql('DROP TABLE IF EXISTS items', [])
            tx.executeSql('DROP TABLE IF EXISTS item', [])
            tx.executeSql('DROP TABLE IF EXISTS task', [])
            tx.executeSql('DROP TABLE IF EXISTS adhocitems', [])
            tx.executeSql('DROP TABLE IF EXISTS details', [])
            tx.executeSql('DROP TABLE IF EXISTS comment', [])
            tx.executeSql('DROP TABLE IF EXISTS cal', [])
            tx.executeSql('DROP TABLE IF EXISTS user',
                [], (tx, result) => {
                    AsyncStorage.clear();
                    navigation.navigate('OnboardingStep1')
                });
        })
    }

    const setting = (value) => {
        setLoginData(value.rows._array[0])
        console.log(logindata);
    }

    // const getPrice = (table) => {
    //     var query = "SELECT sum(amount) as total FROM " + table + " WHERE checked='1' AND workorderid=" + Id

    //     db.transaction((tx) => {
    //         tx.executeSql(
    //             query,
    //             [],
    //             (tx, result2) => {
    //                 console.warn("taskdsvftys:", result2);
    //                 if (result2.rows.length == 1) {
    //                     if (result2.rows._array[0].total != null) {
    //                         var hocPrice = result2.rows._array[0].total;
    //                         if (table == 'adhocitems') {
    //                             db.transaction((tx) => {
    //                                 tx.executeSql(
    //                                     'SELECT id FROM cal WHERE workorderid='+Id,
    //                                     [],
    //                                     (tx, result) => {
    //                                         console.log("call:" + JSON.stringify(result));
    //                                         if(result.rows.length > 0){
    //                                             var query = "UPDATE cal SET addhocPrice=" + hocPrice + " WHERE workorderid=" + Id
    //                                             var value = [];
    //                                         }else{
    //                                             var query = 'INSERT INTO cal (workorderid, addhocPrice, taskPrice) VALUES (?, ?, ?)'
    //                                             var value = [Id, hocPrice, 0];
    //                                         }
    //                                         db.transaction(function (tx) {
    //                                             tx.executeSql(
    //                                                 query,value
    //                                                 ,
    //                                                 (tx, results) => {
    //                                                     db.transaction((tx) => {
    //                                                         tx.executeSql(
    //                                                             'SELECT * FROM cal',
    //                                                             [],
    //                                                             (tx, result) => {
    //                                                                 console.warn("cal", result);
    //                                                             }
    //                                                         );
    //                                                     });
    //                                                 }
    //                                             );
    //                                         });
    //                                     }
    //                                 );
    //                             });

    //                         } else {
    //                             db.transaction((tx) => {
    //                                 tx.executeSql(
    //                                     'SELECT id FROM cal WHERE workorderid='+Id,
    //                                     [],
    //                                     (tx, result) => {
    //                                         console.log("call:" + JSON.stringify(result));
    //                                         if(result.rows.length > 0){
    //                                             var query = "UPDATE cal SET taskPrice=" + hocPrice + " WHERE workorderid=" + Id
    //                                             var value = [];
    //                                         }else{
    //                                             var query = 'INSERT INTO cal (workorderid, addhocPrice, taskPrice) VALUES (?, ?, ?)'
    //                                             var value = [Id, 0 ,hocPrice];
    //                                         }
    //                                         db.transaction(function (tx) {
    //                                             tx.executeSql(
    //                                                 query,value
    //                                                 ,
    //                                                 (tx, results) => {
    //                                                     db.transaction((tx) => {
    //                                                         tx.executeSql(
    //                                                             'SELECT * FROM cal',
    //                                                             [],
    //                                                             (tx, result) => {
    //                                                                 console.warn("cal1", result);
    //                                                             }
    //                                                         );
    //                                                     });
    //                                                 }
    //                                             );
    //                                         });
    //                                     }
    //                                 );
    //                             });
    //                         }
    //                     }
    //                 }
    //             }
    //         );
    //     });
    // }


    function SelectTab(item, index) {
        // this function is used for bottom tab navigation in dashboard,connection,notification and profle screen
        setactiveIndex(index);
        // console.log(Profiledata.userdetail.id)
        if (index === 0) {
            setloading(true);
            navigation.navigate('Dashboard');
            setloading(false);
        }
        // if (index === 1) {
        //     navigation.navigate('HistroyPage')
        // }
        // if (index === 1) {
        //     navigation.navigate('Notification')
        // }
        if (index === 1) {
            navigation.navigate('Profile');
        }
    }

    const EditProfile = () => {
        navigation.navigate('EditProfile')
    }

    const img = async () => {
        const result = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            }
        );
        console.log(result);
        setProfileImage(result.uri)

        if (result) {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                    [],
                    (tx, results) => {
                        let token = results.rows._array[0].token;

                        let body = new FormData()
                        body.append('profile_image', { uri: result.uri, name: 'profile_pic.png', filename: 'imageName.png', type: 'image/png' });
                        body.append('Content-Type', 'image/png');

                        console.log(body);

                        fetch('https://swif.cloud/api/UserProfile', {
                            method: 'POST', headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'multipart/form-data',
                                'Authorization': token,
                            }, body: body
                        }).then((response) => (response.json()))
                            .then((res) => {
                                console.log(res);
                                if (res.Message) {
                                    db.transaction(function (tx) {
                                        tx.executeSql(
                                            "UPDATE user SET profile_image='" + res.result.profile_image + "'",
                                            [],
                                            (tx, results) => {
                                                if (results.rowsAffected > 0) {
                                                    console.log('====================================');
                                                    console.log(res.result.profile_image);
                                                    console.log('====================================');
                                                    refresh();
                                                    alert('Profile Updated Sucessfully')
                                                }
                                            }
                                        );
                                    });
                                } else {
                                    alert('Something Went Wrong')
                                }
                            }).catch(error => {
                                console.log("boooooooooooooooo", error);
                            })
                    }
                )
            })
        }
    }

    return (
        <SafeAreaView style={{ backgroundColor: '#F0F0F0', flex: 1 }}>
            {!IntStatus &&
                <View style={{ backgroundColor: 'red', zIndex: 22, paddingBottom: 5 }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13 }}>No Internet connection</Text>
                </View>}
            {/* {IntStatus && 
        <View style={{paddingTop: 30,backgroundColor:'green',zIndex:22,paddingBottom:5}}>
        <Text style={{textAlign:'center',color:'#fff',fontSize:13}}>Internet connection Found</Text>
        </View>} */}
            <View style={{ height: '95%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 30,marginBottom:30 }}>
                    <View>
                        <Image
                            source={ProfileImage !== "" ? { uri: ProfileImage } : { uri: logindata.profile_image }}
                            style={{ height: 130, width: 130, borderRadius: 130 / 2, resizeMode: 'cover', }}
                        />
                        <TouchableOpacity onPress={() => img()}
                            style={{ marginLeft: '48%', marginTop: -45 }}>
                            <Feather name="edit" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ alignSelf: 'center', color: '#000', fontSize: 18, fontWeight: 'bold' }}>{logindata.email}</Text>
                </View>
                <ScrollView>

                <View style={{ paddingTop: 40 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 20, paddingBottom: 10 }}>PERSONAL</Text>
                    <View style={{
                        flexDirection: 'column', backgroundColor: '#fff', shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5
                    }}>
                        <Text style={{ fontSize: 20, fontWeight: '500', paddingLeft: 20, paddingBottom: 10, paddingTop: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>{logindata.name}</Text>
                        <Text style={{ fontSize: 20, fontWeight: '500', paddingLeft: 20, paddingBottom: 10, paddingTop: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>{logindata.gender}</Text>
                        <Text style={{ fontSize: 20, fontWeight: '500', paddingLeft: 20, paddingBottom: 10, paddingTop: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>{logindata.address}</Text>
                        <Text style={{ fontSize: 20, fontWeight: '500', paddingLeft: 20, paddingBottom: 10, paddingTop: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>{logindata.contact}</Text>
                    </View>
                </View>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', paddingTop: 30, paddingLeft: 20, paddingBottom: 10 }}>SETTINGS</Text>
                    <View style={{
                        flexDirection: 'column', backgroundColor: '#fff', padding: 10, shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5
                    }}>
                        <TouchableOpacity onPress={() => { }}
                            style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <View style={{
                                    backgroundColor: '#fff', borderWidth: .5, borderColor: '#EFEFEF', borderRadius: 10, padding: 5, shadowOffset: .5, shadowColor: '#EFEFEF', shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                }}>
                                    <MaterialIcons name="edit" size={35} color="black" />
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: '500', alignSelf: 'center', paddingLeft: 10 }}>Edit Login Details</Text>
                            </View>
                            <AntDesign name="right" size={24} color="#757575" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => log()} style={{ flexDirection: 'row', padding: 10 }}>
                            <View style={{
                                backgroundColor: '#fff', borderWidth: .5, borderColor: '#EFEFEF', borderRadius: 10, padding: 5, shadowOffset: .5, shadowColor: '#EFEFEF', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}>
                                <MaterialIcons name="logout" size={35} color="black" />
                            </View>
                            <Text style={{ fontSize: 20, fontWeight: '500', paddingLeft: 10, alignSelf: 'center' }}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ textAlign: 'center', marginTop: '20%' }}>Version: 0.1.1</Text>
                </ScrollView>
            </View>

            <View style={{ backgroundColor: '#fff', alignSelf: 'auto', }}>
                <FlatList
                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}
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
        </SafeAreaView>
    )
}

export default Profile