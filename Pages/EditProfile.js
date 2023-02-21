import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as SQLite from 'expo-sqlite'


const db = SQLite.openDatabase('SwifDb');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const EditProfile = ({ navigation }) => {

    const [imgs, setimgs] = useState([])
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                [],
                (tx, results) => {
                    console.log(results.rows._array[0]);
                    setimgs(results.rows._array[0])

                })
        })

    }, [])


    const [ProfileImage, setProfileImage] = useState('');
    const [name, setname] = useState('')
    const [address, setaddress] = useState('')
    const [num, setnum] = useState('')

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
    }

    const save = () => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                [],
                (tx, results) => {
                    let token = results.rows._array[0].token;

                    let body = new FormData()
                    body.append('name', name)
                    body.append('address', address)
                    body.append('contact', num)
                    body.append('profile_image', { uri: ProfileImage, name: 'profile_pic.png', filename: 'imageName.png', type: 'image/png' });
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
                                alert('Profile Updated Sucessfully')
                                navigation.navigate('Profile')
                            } else {
                                alert('Something Went Wrong')
                                navigation.navigate('Profile')
                            }
                        }).catch(error => {
                            console.log("boooooooooooooooo", error);
                        })
                }
            )
        })
    }


    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 50 }}>
            <View style={{ flex: 1, height: windowHeight / 1.2 }}>
                <View style={{ alignSelf: 'center', display: 'flex', paddingTop: 20 }}>
                    <Image
                        source={ProfileImage !== "" ? { uri: ProfileImage } : { uri: imgs.profile_image }}
                        style={{ width: 150, height: 150, borderRadius: 150 / 2, resizeMode: 'cover' }}
                    />
                    <TouchableOpacity onPress={() => img()}
                        style={{ marginLeft: '30%', marginTop: -45, marginBottom: 50 }}>
                        <Feather name="edit" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: 15, paddingTop: 15 }}>
                    <TextInput
                        style={{ width: windowWidth / 1.2, backgroundColor: '#F0F0F0', borderRadius: 30, height: 60, alignSelf: 'center', paddingLeft: 25 }}
                        placeholder='Name'
                        onChangeText={name => setname(name)}
                        value={name}
                    />
                </View>
                <View style={{ paddingBottom: 15, paddingTop: 15 }}>
                    <TextInput
                        style={{ width: windowWidth / 1.2, backgroundColor: '#F0F0F0', borderRadius: 30, height: 60, alignSelf: 'center', paddingLeft: 25 }}
                        placeholder='Address'
                        onChangeText={address => setaddress(address)}
                        value={address}
                    />
                </View>
                <View style={{ paddingBottom: 15, paddingTop: 15 }}>
                    <TextInput
                        style={{ width: windowWidth / 1.2, backgroundColor: '#F0F0F0', borderRadius: 30, height: 60, alignSelf: 'center', paddingLeft: 25 }}
                        placeholder='Contact Number'
                        onChangeText={num => setnum(num)}
                        value={num}
                        keyboardType='numeric'
                    />
                </View>
                <TouchableOpacity onPress={() => save()}
                    style={{
                        height: 50, backgroundColor: '#8D28DC', width: 120, borderRadius: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 5, marginTop: 10
                    }}>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default EditProfile