import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, ScrollView, Dimensions } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import Signature from "react-native-signature-canvas";
import * as FileSystem from "expo-file-system";
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Fontisto } from '@expo/vector-icons';
import Moment from 'moment';
import CalendarPicker from 'react-native-calendar-picker';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite'
import NetInfo from "@react-native-community/netinfo";
import Loading from './Loading';
import * as MediaLibrary from 'expo-media-library'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const db = SQLite.openDatabase('SwifDb');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};



const FinalSing = ({ navigation, route }) => {

    console.error(route.params);

    const dispatch = useDispatch();
    const [list, setlist] = useState([])
    const [logindata, setLoginData] = useState([]);
    const Id = useSelector(state => state.Id)
    const [checkboxState, setCheckboxState] = React.useState(false);
    const [value, setValue] = useState(null);
    const [shouldShow, setShouldShow] = useState(false);
    const [activeIndex, setactiveIndex] = useState(0)
    const [loading, setloading] = useState(false)
    const [ad, setad] = useState([])
    const [isVisible, visible] = useState(false)
    const [boo, setboo] = useState(false)
    const [can, setcan] = useState(false)
    const [modal, setmodal] = useState(false)
    const [adcom, setadcom] = useState(false)
    const [adtask, setadtask] = useState(false)
    const [searchQuery, setSearchQuery] = React.useState('')
    const [getid, setid] = useState([])
    const [catid, setcatid] = useState([])
    const [Comment, setcomment] = useState([])
    const [selectedValue, setSelectedValue] = useState("");
    const [pickedImagePath, setPickedImagePath] = useState("");
    const [expectedTime, setexpectedTime] = useState('');
    const [msg, setmsg] = useState('')
    const details = useSelector(state => state.details)
    const [days, setday] = useState("")
    const [gallery, setgallary] = useState([])

    const [re, setre] = useState("")

    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const Re = useSelector(state => state.Re)
    // console.error(Re);

    const [isStopwatchStart, setIsStopwatchStart] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);
    const [tim, settim] = useState('')
    const [fin, setfin] = useState('')
    const [reid, setreid] = useState('')
    const [selectSport, setselectSport] = useState("1")
    const [total, setTotal] = useState(0);

    const [date] = useState(new Date().getTime())
    const hours = new Date().getHours(); //To get the Current Hours
    const min = new Date().getMinutes(); //To get the Current Minutes
    const sec = new Date().getSeconds()
    const hour = new Date().getHours()
    const mint = new Date().getMinutes()
    const secs = new Date().getSeconds()
    const [image, setimage] = useState([]);
    const [filePath, setFilePath] = useState([]);
    const [subData, setSubData] = useState([]);
    const [resion, setresion] = useState("")
    const [cnlresion, setcnlresion] = useState("")
    const [actualtime, setactualtime] = useState('')
    const [startTime, setStartTime] = useState('');
    const [starttime, setstartTime] = useState('');
    const [task, settask] = useState([])
    const [aditem, setitem] = useState([])
    const [play, setplay] = useState(false)
    const [cmtmsg, setcmtcmg] = useState('')
    const [imagecount, setimagecount] = useState(0)
    const [totaltask, setTotalTask] = useState(1)
    const [fixtime, setfixtime] = useState('')
    const [ground, setground] = useState('')
    const [it, setitems] = useState([])
    const [cl, setcancel] = useState([])
    const [local, setlocal] = useState([])
    const [adhocs, setadhocs] = useState([])
    const [tasklist, settasklist] = useState([])
    const [adhoc, setadhoc] = useState([])
    const [adHocT, sethocT] = useState(0)
    const [taskT, settaskT] = useState(0)
    const [today] = useState(Moment().format('YYYY-MM-DD'));
    const [IntStatus, setintStatus] = useState(false);
    const [request1, setrequest1] = useState([]);
    const [hasCameraPermission, setHasCameraPermission] = useState('')
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState('')
    const [imagefile, setImageFiles] = useState([])
    const [option, setoption] = useState('')
    const [hoc, sethoc] = useState('')
    const [name, setname] = useState('')
    const [remark, setreamrk] = useState('')

    useEffect(() => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM details WHERE id=' + Id,
                [],
                (tx, result) => {
                    console.error("details", result);
                    setting2(result.rows._array[0])
                    var extime = Moment(result.rows._array[0].expected_end_time, 'hh').format('hh')
                    var extimes = Moment(result.rows._array[0].expected_end_time, 'hh mm').format('mm')
                    var ground = Moment(result.rows._array[0].actual_end_time, 'hh mm a').format('hh:mm a')
                    var fixtime = Moment(result.rows._array[0].expected_start_time, 'hh mm a').add(extime, 'hours').add(extimes, 'minutes').format('hh:mm a')
                    setfixtime(fixtime)
                    setground(ground)
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';",
                [],
                (tx, results) => {
                    console.log(results);
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT option_name,option_price FROM hell WHERE hellid=' + Id,
                [],
                (tx, result) => {
                    console.warn("hell:" + JSON.stringify(result.rows._array[0]));
                    setoption(result.rows._array[0])
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM adhocitems WHERE checked='1' AND workorderid=" + Id,
                [],
                (tx, result) => {
                    console.warn("hell:" + JSON.stringify(result.rows._array));
                    sethoc(result.rows._array)
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM task WHERE checked='1' AND workorderid=" + Id,
                [],
                (tx, result) => {
                    console.warn("task", JSON.stringify(result.rows._array[0]));
                    settask(result.rows._array)
                }
            );
        });

        const unsubscribe = navigation.addListener('focus', () => {
            // onRefresh();
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM details WHERE id=' + Id,
                    [],
                    (tx, result) => {
                        console.error("details", result);
                        setting2(result.rows._array[0])
                        var extime = Moment(result.rows._array[0].expected_end_time, 'hh').format('hh')
                        var extimes = Moment(result.rows._array[0].expected_end_time, 'hh mm').format('mm')
                        var ground = Moment(result.rows._array[0].actual_end_time, 'hh mm a').format('hh:mm a')
                        var fixtime = Moment(result.rows._array[0].expected_start_time, 'hh mm a').add(extime, 'hours').add(extimes, 'minutes').format('hh:mm a')
                        setfixtime(fixtime)
                        setground(ground)
                    }
                );
            });

            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';",
                    [],
                    (tx, results) => {
                        console.log(results);
                    }
                );
            });

            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT option_name,option_price FROM hell WHERE hellid=' + Id,
                    [],
                    (tx, result) => {
                        console.warn("hell:" + JSON.stringify(result.rows._array[0]));
                        setoption(result.rows._array[0])
                    }
                );
            });

            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM adhocitems WHERE checked='1' AND workorderid=" + Id,
                    [],
                    (tx, result) => {
                        console.warn("hell:" + JSON.stringify(result.rows._array));
                        sethoc(result.rows._array)
                    }
                );
            });

            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM task WHERE checked='1' AND workorderid=" + Id,
                    [],
                    (tx, result) => {
                        console.warn("task", JSON.stringify(result.rows._array[0]));
                        settask(result.rows._array)
                    }
                );
            });

        });
        return unsubscribe;

    }, [])

    const setting2 = (value) => {
        console.log(value);
        setlocal(value)
        console.log("kasdjgfuerhfgoih", local);
    }

    const back = () => {
        navigation.navigate('SignList')
    }

    const Finish = () => {
        var end_time = hour + ':' + mint + ':' + secs


        if (!end_time) {
            alert('Try Again Please')
        }
        var data = [local.id, end_time]
        var query1 = "UPDATE hell SET actual_end_time='" + end_time + "', workstatus=" + 3 + ", workstatusname='Completed', Modification=1 WHERE hellid=" + local.id;
        var query2 = "UPDATE details SET actual_end_time='" + end_time + "', status=" + 3 + ", workstatusname='Completed', Modification=1 WHERE id=" + local.id;
        // console.log("end", query1, query2);
        db.transaction((tx) => {
            tx.executeSql(
                query1,
                [],
                (tx, result) => {
                    db.transaction((tx) => {
                        tx.executeSql(
                            query2,
                            [],
                            (tx, result) => {
                            }
                        );
                    });
                    // Request();
                }
            );
        });
        console.log("end");

    }

    const handleClear = () => {
        console.log('Empty');
    };

    const handleConfirm = () => {
        console.log("end");
    };

    const handleData = (data) => {
        console.log(data);
    };

    const handleEmpty = () => {
        console.log("Empty");
    };
    const handleEnd = () => {
        console.log('End');
    };

    const [sign, setSign] = useState('');

    const handleOK = (signature) => {

        if (name == "") {
            alert('Please enter customer name')
        }
        if (remark == "") {
            alert('please enter remarks')
        }
        Finish()

        const path = FileSystem.cacheDirectory + "sign.png";
        FileSystem.writeAsStringAsync(
            path,
            signature.replace("data:image/png;base64,", ""),
            { encoding: FileSystem.EncodingType.Base64 }
        )
            .then(() => FileSystem.getInfoAsync(path))
        setSign(path);

        NetInfo.addEventListener(networkState => {
            if (networkState.isConnected) {
                db.transaction((tx) => {
                    tx.executeSql(
                        'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                        [],
                        (tx, results) => {
                            let token = results.rows._array[0].token;

                            let body = new FormData();
                            body.append('workorder_id', local.id)
                            body.append('file', { uri: path, name: 'file.png', filename: 'imageName.png', type: 'image/png' });
                            body.append('collectiveAmount', route.params.amount)
                            body.append('signOffPerson', name)
                            body.append('signOffRemark', remark)
                            body.append('Content-Type', 'image/png');
                            console.log(body);
                            fetch('https://swif.cloud/api/wxuploadSignature', {
                                method: 'POST', headers: {
                                    "Content-Type": "multipart/form-data",
                                    'Authorization': token,
                                }, body: body
                            }).then((response) => {
                                (response.json())
                                console.log(response);
                                navigation.navigate('Dashboard')
                            })
                                .catch((error) => {
                                    console.log(error)
                                })
                        }
                    );
                });
            }
        })

    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ marginTop: 30, margin: 10, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => back()} style={{}}>
                        <Icon name="arrow-back" size={30} color="#6F00C5" />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ paddingLeft: 10, fontSize: 16, color: '#6F00C5' }}>Thank you </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#6F00C5' }}>{local.customer_name}. </Text>
                        <Text style={{ fontSize: 16, color: '#6F00C5' }}>Kindly sign off below  </Text>
                    </View>
                </View>

                <View style={{ margin: 5, marginTop: 10, backgroundColor: '#fff', }}>
                    <View>
                        <View style={{ width: windowWidth / 1.1,  borderRadius: 30, alignSelf: 'center', paddingLeft: 25, marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5 }}>
                            <Text style={{ paddingTop: 10, fontSize: 16, fontWeight: 'bold', color:'#6F00C5' }}>Sign off by</Text>
                        </View>
                        <TextInput
                            style={{ width: windowWidth / 1.1, backgroundColor: '#F0F0F0', borderRadius: 30, height: 40, alignSelf: 'center', paddingLeft: 25 }}
                            onChangeText={name => setname(name)}
                            placeholder='Enter Your Name'
                            placeholderTextColor={'#000'}
                            value={name}
                            autoCapitalize='none'
                        />
                    </View>
                    <View style={{}}>
                        <View style={{ width: windowWidth / 1.1, borderRadius: 30, alignSelf: 'center', paddingLeft: 25, marginLeft: 10, marginRight: 10, marginBottom: 5, marginTop: 5 }}>
                            <Text style={{ paddingTop: 10, fontSize: 16, fontWeight: 'bold', color:'#6F00C5' }}>Add Remarks</Text>
                        </View>
                        <TextInput
                            style={{ width: windowWidth / 1.1, backgroundColor: '#F0F0F0', borderRadius: 30, height: 40, alignSelf: 'center', paddingLeft: 25 }}
                            onChangeText={remark => setreamrk(remark)}
                            placeholder='Enter Your Remarks/Comment'
                            placeholderTextColor={'#000'}
                            value={remark}
                            autoCapitalize='none'
                        />
                    </View>

                </View>
                <View style={{ height: '100%', marginBottom: '110%', display: 'flex', }}>
                    <View style={{ width: windowWidth / 1.1, borderRadius: 30, alignSelf: 'center', paddingLeft: 25, marginLeft: 10, marginRight: 10, marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 25 }}>
                        <Text style={{ paddingTop: 10, fontSize: 16, fontWeight: 'bold', color:'#6F00C5' }}>Signature</Text>

                    </View>
                    <Signature
                        style={{ height: 'auto', width: windowWidth / 1.15, alignSelf: 'center', }}
                        onEnd={handleEnd}
                        onOK={handleOK}
                        onEmpty={handleEmpty}
                        onClear={handleClear}
                        onGetData={handleData}
                        autoClear={true}
                        imageType="image/png"
                    />
                </View>
                {/* <TouchableOpacity onPress={() => {handleOK()}}
                style={{ width: windowWidth / 1.1, backgroundColor: '#7700D4', borderRadius: 30, height: 40, alignSelf: 'center', paddingLeft: 25, margin: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Submit</Text>
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    )
}

export default FinalSing