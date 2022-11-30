import React,{useState,useEffect} from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity,SafeAreaView } from 'react-native';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {usernames, Data} from '../src/ReduxFloder/action'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const FirstPage = ({navigation}) => {
    const dispatch = useDispatch();
    const [username, setusername] = useState("");
    const [loading, setloading] = useState(false)
    const [IntStatus, setintStatus] = useState(false);

    useEffect(() => {

        NetInfo.addEventListener(networkState => {
            // console.log("Connection type - ", networkState.type);
            // console.log("Is connected? - ", networkState.isConnected);
            setintStatus(networkState.isConnected);
          });


        AsyncStorage.getItem('USER',(err,result)=>{
            if(err){
                // console.log(err);
                navigation.navigate('FirstPage')
            }
            if(result){
                // console.log("pop",result);
                if(result.loginERR){
                    navigation.navigate('FirstPage')
                }else{
                    navigation.navigate('Dashboard')
                }
            }
        })
    }, []);

    const Next = () => {
        // if(username===""){
        //     Toast.show('Please enter username', Toast.LONG);   // CHECK FOR EMAIL FILED MUST BE REQUIRED
        //     return false
        // }
        setloading(true)
        let bodyFormData={'username': username}    // PARAMETER FOR PASSWORD
        axios({
            method: 'post',
            url: `https://swif.cloud/api/wxverifyusername`, // Login Api
            data:bodyFormData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
            })
        .then(({data, status}) =>{
            console.log(data)
            dispatch(Data(data.details))
            navigation.navigate('LoginScreen')
            }
            
            
            //setAllCountry(data.success)
        )
        .catch(error => {
            console.log("boooooooooooooooo", error.response.data);
            alert("Invalid Username")
        })
        // navigation.navigate('FirstPage')
    }

    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:'#fff' }}>
        {!IntStatus && 
        <View style={{paddingTop: 30,backgroundColor:'red',zIndex:22,paddingBottom:5}}>
        <Text style={{textAlign:'center',color:'#fff',fontSize:13}}>No Internet connection</Text>
        </View>}
        {/* {IntStatus && 
        <View style={{paddingTop: 30,backgroundColor:'green',zIndex:22,paddingBottom:5}}>
        <Text style={{textAlign:'center',color:'#fff',fontSize:13}}>Internet connection Found</Text>
        </View>} */}
        
                <View style={{paddingTop:35,  justifyContent: 'center',alignItems:'center',marginTop:'15%' }}>
                    <Image
                        style={{ height: '30%', width: '100%', resizeMode: 'contain' }}
                        source={require('../src/assets/swifapp-logo.png')}
                    />
                    <View style={{ paddingTop: 40 }}>
                        <Text style={{ alignSelf: 'center', maxWidth: 200, color: '#737373',textAlign:'center' }}>Enter Your Login Details to Access Your Account </Text>
                    </View>

                    <View style={{ paddingBottom: 20, paddingTop: 15 }}>
                        <TextInput
                            style={{ width: windowWidth / 1.2, backgroundColor: '#F0F0F0', borderRadius: 30, height: 60, alignSelf: 'center', paddingLeft: 25,}}
                            onChangeText={username => setusername(username)}
                            placeholder='Enter UserID'
                            value={username}
                            autoCapitalize='none'
                        />
                    </View>
                    <TouchableOpacity onPress={()=>Next()}
                        style={{ height: 60, backgroundColor: '#8D28DC', width: windowWidth / 1.2, borderRadius: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        
                        elevation: 5,  }}>
                        <Text style={{ color: '#fff', fontSize: 20,fontWeight:'bold' }}>Next</Text>
                    </TouchableOpacity>
                    {/* <View style={{ paddingTop: 25 }}>
                        <Text style={{ justifyContent: 'center', alignSelf: 'center', color: '#737373',fontSize:20 }}>Forgot UserID?</Text>
                    </View> */}
                </View>
        </SafeAreaView>
    )
}

export default FirstPage