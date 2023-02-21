import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, SafeAreaView, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { usernames, Data } from '../src/ReduxFloder/action'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import Icons from 'react-native-vector-icons/AntDesign';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const OnboardingStep1 = ({ navigation }) => {

    const dispatch = useDispatch();
    const [username, setusername] = useState("");
    const [loading, setloading] = useState(false)
    const [IntStatus, setintStatus] = useState(false);
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [fulldata, setfulldata] = useState([])

    useEffect(() => {

        NetInfo.addEventListener(networkState => {
            // console.log("Connection type - ", networkState.type);
            // console.log("Is connected? - ", networkState.isConnected);
            setintStatus(networkState.isConnected);
        });

        let bodyFormData = {}    // PARAMETER FOR PASSWORD
        axios({
            method: 'post',
            url: `https://swif.cloud/api/companies`, // Login Api
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        })
            .then(({ data, status }) => {
                console.log(data)
                setMasterDataSource(data.details)
            }
            )
            .catch(error => {
                console.log("boooooooooooooooo", error.response.data);
            })
    }, []);

    const ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View
                style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: '#C8C8C8',
                }}
            />
        );
    };

    const SearchFilterFunction = (text) => {
        if (text) {
            const newData = masterDataSource.filter(
                function (item) {
                    const itemData = item.name
                        ? item.name.toUpperCase()
                        : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };

    const getItem = (item) => {
        console.log("getItem", item);
        setSearch(item.name)
        setfulldata(item)
    }
    const Submit = () => {
        if(fulldata){
            if(fulldata?.name){
                navigation.navigate('OnboardingStep2',{item:fulldata})
            }else{
                alert("Please Select Company First")
            }
        }else{
            alert("Please Select Company First")

        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {!IntStatus &&
                <View style={{ paddingTop: 30, backgroundColor: 'red', zIndex: 22, paddingBottom: 5 }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13 }}>No Internet connection</Text>
                </View>}
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '15%', }}>

                <Image
                    style={{ height: '25%', width: '50%', resizeMode: 'contain' }}
                    source={require('../src/assets/swifapp-logo.png')}
                />
                <View style={{ paddingTop: 30 }}>
                    <Text style={{ alignSelf: 'center', color: '#737373', textAlign: 'center' }}>Search Company Name </Text>
                </View>

                <View style={{ paddingBottom: 20, paddingTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '10%' }}>
                    <TextInput
                        style={{ width: windowWidth / 1.2, backgroundColor: '#F0F0F0', borderRadius: 30, height: 60, alignSelf: 'center', paddingLeft: 25, marginLeft: '-5%' }}
                        onChangeText={(text) => SearchFilterFunction(text)}
                        value={search}
                        underlineColorAndroid="transparent"
                        placeholder="Company Name"
                    />
                    <View style={{ marginLeft: '-10%' }}>
                        <Icons name='search1' size={20} color={'#656565'} />
                    </View>
                </View>
                <FlatList
                    data={filteredDataSource}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ marginTop: -20, backgroundColor: '#F0F0F0', borderRadius: 30, }}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={({ item, index }) =>
                        <View>
                            <TouchableOpacity onPress={() => { getItem(item) }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: windowWidth / 1.2, height: windowHeight / 10, paddingLeft: 10, paddingRight: 10 }}>
                                    <View style={{ width: '33%', }}>
                                        <Image source={{ uri: item.company_logo }} style={{ height: '40%', width: '50%' }} />
                                    </View>
                                    <View style={{ width: '66%', }}>
                                        <Text style={{ fontSize: 16, paddingLeft: 20, textAlign: 'right', }}>
                                            {item.name}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>}
                />
                <TouchableOpacity onPress={() => { Submit() }}
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
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Submit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default OnboardingStep1