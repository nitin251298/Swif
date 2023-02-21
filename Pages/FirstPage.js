import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { usernames, Data } from '../src/ReduxFloder/action'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const FirstPage = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const [username, setusername] = useState("");
    const [loading, setloading] = useState(false)
    const [IntStatus, setintStatus] = useState(false);
    const [id,setid] = useState('')

    useEffect(() => {

        setid(route.params.id)

        NetInfo.addEventListener(networkState => {
            setintStatus(networkState.isConnected);
        });


        AsyncStorage.getItem('USER', (err, result) => {
            if (err) {
                navigation.navigate('FirstPage')
            }
            if (result) {
                if (result.loginERR) {
                    navigation.navigate('FirstPage')
                } else {
                    navigation.navigate('Dashboard')
                }
            }
        })
    }, []);

    const Next = () => {
        setloading(true)
        let bodyFormData = { 'username': username, 'company_id': id }   // PARAMETER FOR PASSWORD
        console.log(bodyFormData);
        axios({
            method: 'post',
            url: `https://swif.cloud/api/onBoardingVerifingUsername`, // Login Api
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then(({ data, status }) => {
                console.log(data)
                dispatch(Data(data.details))
                navigation.navigate('LoginScreen')
            })
            .catch(error => {
                console.log("boooooooooooooooo", error.response.data);
                alert("Invalid Username")
            })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {!IntStatus &&
                <View style={{ paddingTop: 30, backgroundColor: 'red', zIndex: 22, paddingBottom: 5 }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13 }}>No Internet connection</Text>
                </View>}
            <View style={{ paddingTop: 35, justifyContent: 'center', alignItems: 'center', marginTop: '15%' }}>
                <Image
                    style={{ height: '30%', width: '100%', resizeMode: 'contain' }}
                    source={require('../src/assets/swifapp-logo.png')}
                />
                <View style={{ paddingTop: 40 }}>
                    <Text style={{ alignSelf: 'center', maxWidth: 200, color: '#737373', textAlign: 'center' }}>Enter Your Login Details to Access Your Account </Text>
                </View>

                <View style={{ paddingBottom: 20, paddingTop: 15 }}>
                    <TextInput
                        style={{ width: windowWidth / 1.2, backgroundColor: '#F0F0F0', borderRadius: 30, height: 60, alignSelf: 'center', paddingLeft: 25, }}
                        onChangeText={username => setusername(username)}
                        placeholder='Enter UserID'
                        value={username}
                        autoCapitalize='none'
                    />
                </View>
                <TouchableOpacity onPress={() => Next()}
                    style={{
                        height: 60, backgroundColor: '#8D28DC', width: windowWidth / 1.2, borderRadius: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 5,
                    }}>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default FirstPage