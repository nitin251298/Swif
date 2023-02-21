import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite'
import { Db } from '../src/ReduxFloder/action'
import NetInfo from "@react-native-community/netinfo";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const db = SQLite.openDatabase('Swif');

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [Password, setPassword] = useState("")
    const [loading, setloading] = useState(false)
    const Data = useSelector(state => state.Data)
    const [IntStatus, setintStatus] = useState(false);

    useEffect(() => {
        NetInfo.addEventListener(networkState => {
            setintStatus(networkState.isConnected);
        });
    })

    const login = () => {
        if (Password === "") {
            Toast.show('Please enter Password', Toast.LONG);
            return false
        }
        setloading(true)
        let bodyFormData = { 'username': Data.username, 'password': Password,'company_id':Data.company_id }
        axios({
            method: 'post',
            url: `https://swif.cloud/api/onBoardingLogin`,
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then(({ data, status }) => {
                dispatch(Db(data))
                if (data.worker.token) {
                    var token = JSON.stringify(data.worker);
                } else {
                    var token = '{"loginERR":"404"}';
                }
                AsyncStorage.setItem('USER', token);
                navigation.navigate('CreateTable')
            })
            .catch(error => {
                console.log(error);
                if (error.response.data.message == "User banned by Admin") {
                    alert("User banned by Admin")
                } else {
                    alert("Invalid Password")
                }
            })
    }

    const sp = () => {
        navigation.navigate('Splash')
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {!IntStatus &&
                <View style={{ paddingTop: 30, backgroundColor: 'red', zIndex: 22, paddingBottom: 5 }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13 }}>No Internet connection</Text>
                </View>}
            <View style={{ paddingTop: 35, flex: .90, alignContent: 'center' }}>
                <View style={{ flex: .90, justifyContent: 'center' }}>
                    <Image
                        style={{ height: '23%', width: '95%', resizeMode: 'contain', marginBottom: '5%' }}
                        source={{ uri: Data.company_logo }}
                    />
                    <View style={{ paddingTop: 40 }}>
                        <Text style={{ alignSelf: 'center', maxWidth: 200, color: '#737373', textAlign: 'center' }}>Enter Your Login Details to Access Your Account </Text>
                    </View>
                    <View style={{ paddingBottom: 20, paddingTop: 15 }}>
                        <TextInput
                            style={{ width: windowWidth / 1.2, backgroundColor: '#F0F0F0', borderRadius: 30, height: 60, alignSelf: 'center', paddingLeft: 25 }}
                            onChangeText={Password => setPassword(Password)}
                            placeholder='Password'
                            secureTextEntry={true}
                            value={Password}
                            autoCapitalize='none'
                        />
                    </View>
                    <TouchableOpacity onPress={() => login()}
                        style={{ height: 60, backgroundColor: '#8D28DC', width: windowWidth / 1.2, borderRadius: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default LoginScreen