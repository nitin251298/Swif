import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Modal, TextInput, RefreshControl, SafeAreaView, Platform, PermissionsAndroid, Dimensions, Alert } from 'react-native';
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

let bottomtab = [
    {
        key: 1,
        name: "Home",
        iconName: 'home-outline'
    },
    {
        key: 2,
        iconName: 'ios-refresh-outline'
    },
    // {
    //     key: 3,
    //     name: "Notifcations",
    //     iconName: 'notifications-outline'
    // },
    {
        key: 4,
        name: "Profile",
        iconName: 'person-outline'
    }
]

const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};


const Orderlist = ({ navigation }) => {
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
    const [selectedValue, setSelectedValue] = useState("");
    const [days, setday] = useState("")
    const [gallery, setgallary] = useState([])
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const Re = useSelector(state => state.Re)
    // console.error(Re);

    const [isStopwatchStart, setIsStopwatchStart] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);
    const [reid, setreid] = useState('')
    const [total, setTotal] = useState(0);
    const hour = new Date().getHours()
    const mint = new Date().getMinutes()
    const secs = new Date().getSeconds()
    const [resion, setresion] = useState("")
    const [cnlresion, setcnlresion] = useState("")
    const [task, settask] = useState([])
    const [imagecount, setimagecount] = useState(0)
    const [totaltask, setTotalTask] = useState(1)
    const [fixtime, setfixtime] = useState('')
    const [ground, setground] = useState('')
    const [local, setlocal] = useState([])
    const [adhocs, setadhocs] = useState([])
    const [tasklist, settasklist] = useState([])
    const [adhoc, setadhoc] = useState([])
    const [today] = useState(Moment().format('YYYY-MM-DD'));
    const [IntStatus, setintStatus] = useState(false);
    const [request1, setrequest1] = useState([]);
    const [hasCameraPermission, setHasCameraPermission] = useState('')
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState('')
    const [imagefile, setImageFiles] = useState([])
    const [option, setoption] = useState('')
    const [hoc, sethoc] = useState('')

    useEffect(() => {


        (async () => {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasCameraPermission(cameraPermission.status === 'granted')
            setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted')
        })();

        (async () => {

            let albumName = "SWIFAPPX"

            let getPhotos = await MediaLibrary.getAlbumAsync(albumName)


            let media = await MediaLibrary.getAssetsAsync({
                first: 20,
                album: getPhotos,
                sortBy: ['creationTime'],
                mediaType: ['photo', 'video']
            });
            console.log(media);

            setImageFiles(media.assets)
        })();




        NetInfo.addEventListener(networkState => {
            // console.log("Connection type - ", networkState.type);
            // console.log("Is connected? - ", networkState.isConnected);
            setintStatus(networkState.isConnected);
        });

        cal()
        console.log(Id);
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM details WHERE id=' + Id,
                [],
                (tx, result) => {
                    if (result.rows._array.length) {

                        console.error("details", result);
                        // console.error(result.rows._array[0]);
                        setting2(result.rows._array[0])
                        console.error(JSON.parse(result.rows._array[0].gallery));
                        setrequest1(JSON.parse(result.rows._array[0].gallery))
                        setgallary(JSON.parse(result.rows._array[0].gallery))
                        var extime = Moment(result.rows._array[0].expected_end_time, 'hh').format('hh')
                        var extimes = Moment(result.rows._array[0].expected_end_time, 'hh mm').format('mm')
                        var ground = Moment(result.rows._array[0].actual_end_time, 'hh mm a').format('hh:mm a')
                        var fixtime = Moment(result.rows._array[0].expected_start_time, 'hh mm a').add(extime, 'hours').add(extimes, 'minutes').format('hh:mm a')
                        setfixtime(fixtime)
                        setground(ground)
                        setimagecount(JSON.parse(result.rows._array[0].gallery).length)
                    } else {
                        navigation.navigate('Dashbaord')
                    }
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM item',
                [],
                (tx, result) => {
                    console.log("adhoc", JSON.stringify(result));
                    setting3(result.rows._array)
                }
            );
        });


        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM adhocitems WHERE checked='1' AND workorderid=" + Id,
                [],
                (tx, result) => {
                    // alert("adhocitems", JSON.stringify(result));
                    setting5(result.rows._array)
                    // cal();
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM comment WHERE workorder_id=' + Id + ' ORDER BY id DESC LIMIT 1',
                [],
                (tx, result) => {
                    if (result.rows.length > 0) {
                        setstatusCom(true);
                    } else {
                        setstatusCom(false);
                    }
                    // console.log("comment", JSON.stringify(result));
                    comm(result.rows._array)
                    // setmsg('')
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM gallery WHERE workorderid=" + Id,
                [],
                (tx, result) => {
                    console.error("gallery", JSON.stringify(result));
                    gal(result.rows._array)
                    var imgs = result.rows._array.length
                    setimagecount(imgs)

                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM reschedule',
                [],
                (tx, results) => {
                    console.log("res:" + JSON.stringify(results));
                    RES(results.rows._array)
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
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM cancel',
                [],
                (tx, results) => {
                    console.log("canel" + JSON.stringify(results));
                    CANCEL(results.rows._array)
                }
            );
        });




        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM cancel',
                    [],
                    (tx, results) => {
                        console.log("canel" + JSON.stringify(results));
                        CANCEL(results.rows._array)
                    }
                );
            });

            db.transaction((tx) => {
                // tx.executeSql('DROP TABLE IF EXISTS task', [])
                tx.executeSql(
                    'SELECT * FROM task WHERE workorderid=' + Id,
                    [],
                    (tx, result) => {
                        // alert(JSON.stringify(result))
                        console.error("task", JSON.stringify(result));
                        setting4(result.rows._array)
                        // cal()
                    }
                );
            });
        });
        return unsubscribe;

    }, []);
    const [gall, setgall] = useState([])
    const gal = (val) => {
        setgall(val)
    }


    const Request = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                [],
                (tx, results) => {
                    let token = results.rows._array[0].token;
                    db.transaction((tx) => {
                        tx.executeSql(
                            'SELECT hellid AS ID, workstatus AS status, expected_start_date AS start_date, actual_start_time AS start_time, actual_end_time AS end_time, signature AS Sign FROM hell WHERE Modification=1',
                            [],
                            (tx, result) => {
                                console.log('enter in sink functiom');
                                console.warn("HELL", JSON.stringify(result.rows._array));
                                db.transaction((txp) => {
                                    txp.executeSql(
                                        "SELECT commenter_id AS worker_id, workorder_id AS workorderId, description FROM comment WHERE Modification=1",
                                        [],
                                        (tx, result1) => {
                                            db.transaction((txp) => {
                                                txp.executeSql(
                                                    "SELECT id, workorderid AS workorderId, quantity, amount, checked, custom FROM task WHERE Modification='1'",
                                                    [],
                                                    (tx, result2) => {
                                                        console.warn("task: ", result2.rows._array);
                                                        db.transaction((txp) => {
                                                            txp.executeSql(
                                                                "SELECT id AS item_id, category_id, workorderid AS workorderId, quantity, amount AS price FROM adhocitems WHERE Modification='1'",
                                                                [],
                                                                (tx, result3) => {
                                                                    console.warn(JSON.stringify(result3));
                                                                    db.transaction((txp) => {
                                                                        txp.executeSql(
                                                                            "SELECT workorderid AS workorderId, file AS image FROM gallery WHERE Modification='1'",
                                                                            [],
                                                                            (tx, result4) => {
                                                                                console.error("gallery:-", JSON.stringify(result4));
                                                                                result4.rows._array.forEach(element => {
                                                                                    // console.log({"element":element});

                                                                                });

                                                                                db.transaction((txz) => {
                                                                                    txz.executeSql(
                                                                                        'SELECT hellid AS ID, workstatus AS status, reasonid AS reason, date FROM hell WHERE Modification=1 AND reasonid !=0 AND status IN (4,5)',
                                                                                        [],
                                                                                        (tx, result6) => {
                                                                                            console.error(result6);

                                                                                            let bodyFormData = { 'workorder': JSON.stringify(result.rows._array), 'task': JSON.stringify(result2.rows._array), 'addhoc': JSON.stringify(result3.rows._array), 'comment': JSON.stringify(result1.rows._array), 'WorkorderImage': JSON.stringify(result4.rows._array), 'lastUpdatationDate': null, 'requests': JSON.stringify(result6.rows._array) }
                                                                                            console.warn({ bodyFormData });
                                                                                            // return;
                                                                                            axios({
                                                                                                method: 'POST',
                                                                                                url: 'https://swif.cloud/api/swif-sink',
                                                                                                data: bodyFormData,
                                                                                                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': token }
                                                                                            }).then(({ data, status }) => {
                                                                                                console.error("orderlist dataq check", data);

                                                                                                if (data.completeStatus == 200) {
                                                                                                    let triggerHell = hellIndex('d', data);
                                                                                                }
                                                                                            }).catch(error => {
                                                                                                console.log("boooooooooooooooo", error.response.data);
                                                                                                if (error.response.data.status == 502) {
                                                                                                    Alert.alert(
                                                                                                        "Alert",
                                                                                                        "Your're not Authenticated User Please sign in First",
                                                                                                        [
                                                                                                            { text: "OK", onPress: () => logout() }
                                                                                                        ]
                                                                                                    );

                                                                                                } else {
                                                                                                    // alert(JSON.stringify(error.response.data))
                                                                                                    console.log(JSON.stringify(error.response.data));
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    );
                                                                                });
                                                                            }
                                                                        );
                                                                    });
                                                                }
                                                            );
                                                        });
                                                    }
                                                );
                                            });
                                        }
                                    );
                                });
                            }
                        );
                    });
                }
            );
        });
        // }
        // })
    }

    const hellIndex = (index, baseData) => {
        const queryD = "DELETE FROM hell;";
        const queryI = "SELECT * FROM hell;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            hellIndex('d', baseData);
                        } else {
                            if (baseData) {
                                hellInserted(baseData);
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        hellIndex('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }

    const hellInserted = async (allData) => {
        console.warn({"insert":allData});
        allData.list.forEach((hell, i) => {
            if (hell.contractNumber) {
                db.transaction((ct1) => {
                    ct1.executeSql(
                        'INSERT INTO hell (hellid, customer_contact_number, block, contractNumber, country, customer_address, customer_name, option_name, option_price, service_name, street, unit, workstatus, workstatusname, zip, zone, type, reasonid, date, Modification,expected_start_date,expected_start_time,expected_end_time,actual_start_date,actual_start_time,actual_end_time,signature, executionPermission) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [hell.id, hell.customer_contact_number, hell.block, hell.contractNumber, hell.country, hell.customer_address, hell.customer_name, hell.option_name, hell.option_price, hell.service_name, hell.street, hell.unit, hell.workstatus, hell.workstatusname, hell.zip, hell.zone, 0, 0, "null", 0, "" + hell.start_date + "", "" + hell.actual_start_time + "", "" + hell.actual_end_time + "", "null", "null", "null", "null", hell.executionPermission],
                        (tx, hellRes1) => {
                            if (hellRes1) {
                                console.log("Contract Number Workorder insered");
                            }
                        }
                    );
                })
            } else {
                db.transaction((ct2) => {
                    ct2.executeSql(
                        'INSERT INTO hell (hellid, customer_contact_number, block, contractNumber, country, customer_address, customer_name, option_name, option_price, service_name, street, unit, workstatus, workstatusname, zip, zone, type, reasonid, date, Modification,expected_start_date,expected_start_time,expected_end_time,actual_start_date,actual_start_time,actual_end_time,signature, executionPermission) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [hell.id, hell.customer_contact_number, hell.block, 'null', hell.country, hell.customer_address, hell.customer_name, hell.option_name, hell.option_price, hell.service_name, hell.street, hell.unit, hell.workstatus, hell.workstatusname, hell.zip, hell.zone, 0, 0, "null", 0, "" + hell.start_date + "", "" + hell.actual_start_time + "", "" + hell.actual_end_time + "", "null", "null", "null", "null", hell.executionPermission],
                        (tx, hellRes2) => {
                            if (hellRes2) {
                                console.log("None Contract Number Workorder insered");
                            }
                        }
                    );
                })
            }
            if (i == allData.list.length - 1) {
                db.transaction((ct3) => {
                    ct3.executeSql('SELECT name FROM sqlite_master;', [], (tx, hellRes3) => {
                        if (hellRes3) {
                            level2('d', allData)
                            console.log({ "HELl List:": hellRes3, "data": JSON.stringify(allData) });
                        }
                    })
                })
            }
        });

    }
    const level2 = (index, baseData) => {
        const queryD = "DELETE FROM details;";
        const queryI = "SELECT * FROM details;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level2('d', baseData);
                        } else {
                            if (baseData) {
                                level2Inserted(baseData);
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        level2('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }

    const level2Inserted = (allData) => {
        allData.details.forEach((detail, i) => {
            db.transaction((ct21) => {
                let addHocPermission = undefined;
                if (detail.addHocPermission) {
                    addHocPermission = true;
                } else {
                    addHocPermission = false;
                }
                if (!addHocPermission) {
                    addHocPermission = false;
                }
                ct21.executeSql(
                    'INSERT INTO details (id, adjustment_type, adjustment_value, block, companytax, contractNumber, customer_contact_number, customer_name, discount_type, discount_value, option_name, option_price, service_id, service_name, status, street, unit, workstatusname, zip, zone, ad_hoc_catid, ad_hoc_items, gallery, task_list, workordercommentlist, type, reasonid, date, expected_start_time, expected_end_time, actual_start_time, actual_end_time,expected_start_date, Modification, executionPermission, priceViewPermission, country, leader, team, addHocPermission) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [detail.id, detail.adjustment_type, detail.adjustment_value, detail.block, detail.companytax, detail.contractNumber, detail.customer_contact_number, detail.customer_name, detail.discount_type, detail.discount_value, detail.option_name, detail.option_price, detail.service_id, detail.service_name, detail.status, detail.street, detail.unit, detail.workstatusname, detail.zip, detail.zone, JSON.stringify(detail.ad_hoc_catid), JSON.stringify(detail.ad_hoc_items), JSON.stringify(detail.gallery), JSON.stringify(detail.task_list), JSON.stringify(detail.workordercommentlist), 0, 0, "null", "" + detail.actual_start_time + "", "" + detail.actual_end_time + "", "" + detail.ground_start_time + "", "" + detail.ground_end_time + "", "" + detail.start_date + "", 0, detail.executionPermission, detail.priceViewPermission, detail.country, detail.teamDetails.leader, detail.teamDetails.team, addHocPermission],
                    (tx, results) => {
                        if (results) {
                            console.log("Detail inserted Successfully");
                        }
                    }
                );
            })
            if (i == allData.details.length - 1) {
                level3('d', allData)
            }
        })
    }
    const level3 = (index, baseData) => {
        const queryD = "DELETE FROM item;";
        const queryI = "SELECT * FROM item;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level3('d', baseData);
                        } else {
                            if (baseData) {
                                level3Inserted(baseData);
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        level3('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }
    const level3Inserted = (allData) => {
        if (allData.item.length) {
            allData.item.forEach((item, x) => {
                db.transaction((ct31) => {
                    ct31.executeSql(
                        'INSERT INTO item (id, category_id, price, name) VALUES (?, ?, ?, ?)',
                        [item.id, item.category_id, item.price, item.name],
                        (tx, results) => {
                            if (results) console.log("item inserted");
                        }
                    );
                })
                if (x == allData.item.length - 1) {
                    level4('d', allData);
                }
            })
        } else {
            level4('d', allData);
        }
    }

    const level4 = (index, baseData) => {
        const queryD = "DELETE FROM adhocitems;";
        const queryI = "SELECT * FROM adhocitems;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level4('d', baseData);
                        } else {
                            if (baseData) {
                                level4Inserted(baseData);
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        level4('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }
    const level4Inserted = (allData) => {
        allData.details.forEach((item, x) => {
            console.log({'lllllllllllllllllllll':item.ad_hoc_items});
            if (item.ad_hoc_items.length) {
                item.ad_hoc_items.forEach(ele => {
                    db.transaction((ct31) => {
                        console.log("bpppppppppppppppppppp",ele.checked);
                        ct31.executeSql(
                            'INSERT INTO adhocitems (id, amount, checked, item, name, quantity, remarks, workorderid, Modification, category_id) VALUES (?, ?, ?, ?, ?, ? ,?, ?, ?, ?)',
                            [ele.id, ele.amount*ele.quantity, ele.checked, ele.item, ele.name, ele.quantity, ele.remarks, item.id, 0, ele.category_id],
                            (tx, results) => {
                                console.log("Adhoc item inseted Successfully");
                            }
                        );
                    });
                })
            }
            if (x == allData.details.length - 1) {
                level5('d', allData)
            }
        })
    }
    const level5 = (index, baseData) => {
        const queryD = "DELETE FROM task;";
        const queryI = "SELECT * FROM task;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level5('d', baseData);
                        } else {
                            if (baseData) {
                                level5Inserted(baseData);
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        level5('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }
    const level5Inserted = (allData) => {
        allData.details.forEach((detail, x) => {
            if (detail.task_list.length) {
                detail.task_list.forEach((item, i) => {
                    db.transaction((ct51) => {
                        ct51.executeSql(
                            'INSERT INTO task (id, amount, price, checked, item, name, quantity, remarks, workorderid, Modification, custom) VALUES (?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?)',
                            [item.id, item.amount, item.amount/item.quantity, item.checked, item.item, item.name, item.quantity, item.remarks, detail.id, 0, item.custom],
                            (tx, results) => {
                                console.log('Task insterd succesfuuly');
                            }
                        );
                    });
                })
            }
            if (x == allData.details.length - 1) {
                level6('d', allData)
            }
        })
    }
    const level6 = (index, baseData) => {
        const queryD = "DELETE FROM comment;";
        const queryI = "SELECT * FROM comment;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level6('d', baseData);
                        } else {
                            if (baseData) {
                                level6Inserted(baseData);
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        level6('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }

    const level6Inserted = (allData) => {
        if (allData.comment.length) {
            allData.comment.forEach((item, i) => {
                if (item.length) {
                    item.forEach((comm) => {
                        db.transaction((ct61) => {
                            ct61.executeSql(
                                "INSERT INTO comment (comment_id, commenter_type, commenter, commenter_id, description, workorder_id, created,Modification) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                                [comm.id, comm.commenter_type, comm.commenter, comm.commenter_id, comm.description, comm.workorder_id, comm.created, 0],
                                (tx, results) => {
                                    console.log("comment inserted successfully");
                                }
                            )
                        })
                    })
                }
                if (i == allData.comment.length - 1) {
                    level7('d', allData)
                }
            })
        }
    }
    const level7 = (index, baseData) => {
        const queryD = "DELETE FROM cancel;";
        const queryI = "SELECT * FROM cancel;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level7('d', baseData);
                        } else {
                            if (baseData) {
                                level7Inserted(baseData);
                            }
                        }
                    } else if (res1 && modeStatus == 103) {
                        level7('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }
    const level7Inserted = (allData) => {
        if (allData.CancelReason.length) {
            allData.CancelReason.forEach((item, i) => {
                db.transaction((ct71) => {
                    ct71.executeSql(
                        'INSERT INTO cancel (cancelid, company_id, description, title) VALUES (?,?,?,?)',
                        [item.id, item.company_id, item.description, item.title],
                        (tx, results) => {
                            console.log('cancel reson instrerd');
                        }
                    );
                })
                if (i == allData.CancelReason.length - 1) {
                    level8('d', allData)
                }
            })
        }
    }
    const level8 = (index, baseData) => {
        const queryD = "DELETE FROM reschedule;";
        const queryI = "SELECT * FROM reschedule;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level8('d', baseData);
                        } else {
                            if (baseData) {
                                level8Inserted(baseData);
                            }
                        }
                    } else if (res1 && modeStatus == 103) {
                        console.log("Cancel table empty");
                        level8('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }
    const level8Inserted = (allData) => {
        if (allData.resheduleReason.length) {
            allData.resheduleReason.forEach((item, i) => {
                db.transaction((ct81) => {
                    ct81.executeSql(
                        'INSERT INTO reschedule (rescheduleid, company_id, description, title) VALUES (?,?,?,?)',
                        [item.id, item.company_id, item.description, item.title],
                        (tx, results) => {
                            console.log('reshudle dsahg');
                        }
                    );
                })
                if (i == allData.resheduleReason.length - 1) {
                    level9('d', allData);
                }
            })
        }
    }
    const level9 = (index, baseData) => {
        const queryD = "DELETE FROM gallery;";
        const queryI = "SELECT * FROM gallery;";
        let modeStatus = 404;
        let query = undefined;

        if (baseData) {
            if (index == 'i') {
                query = queryI;
                modeStatus = 100
            } else if (index == 'd') {
                query = queryD;
                modeStatus = 103
            } else {
                return false;
            }
        } else {
            query = queryI;
            modeStatus = 100;
        }
        if (!query) {
            return false;
        } else {
            db.transaction((ct) => {
                ct.executeSql(query, [], (err1, res1) => {
                    if (res1 && modeStatus == 100) {
                        if (res1.rows._array.length != 0) {
                            level9('d', baseData);
                        } else {
                            if (baseData) {
                                level9Inserted(baseData);
                            }
                            // console.log({ "result": res1.rows._array});
                            // return res1.rows._array;
                        }
                    } else if (res1 && modeStatus == 103) {
                        level9('i', baseData)
                        modeStatus = 100;
                    }
                })
            })
        }
    }
    const level9Inserted = (allData) => {
        allData.details.forEach((item, i) => {
            if (item.gallery.length) {
                item.gallery.forEach((img, x) => {
                    db.transaction((ct91) => {
                        ct91.executeSql(
                            'INSERT INTO gallery (file, workorderid, Modification) VALUES (?, ?, ?)',
                            [img.name, item.id, 1],
                            (tx, results) => {
                                console.log("img inserted successfully");
                            }
                        );
                    })
                });
                if (i == allData.item.length - 1) {
                    levelExit();
                }
            } else {
                levelExit();
            }
        })
    }
    const levelExit = () => {
        console.log("exit");
    }

    const logout = () => {
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
            tx.executeSql('DROP TABLE IF EXISTS gallery', [])
            tx.executeSql('DROP TABLE IF EXISTS cal', [])
            tx.executeSql('DROP TABLE IF EXISTS user',
                [], (tx, result) => {
                    AsyncStorage.clear();
                    navigation.navigate('FirstPage')
                });
        })
    }

    const [res, setres] = useState([])
    const [cana, setcana] = useState([])
    const RES = (value) => {
        setres(value)
        // console.log('Reschedule', res);
    }

    let tempCancelId = [];
    let tempCancelData = [];
    const CANCEL = (value) => {
        value.forEach(element => {
            if (!tempCancelId.includes(element.cancelid)) {
                tempCancelData.push(element);
                tempCancelId.push(element.cancelid);
            }
        });
        console.log("yufrf", tempCancelData);
        console.error({ value });
        setcana(tempCancelData)
        // console.log("can", cana);
    }

    const [com, setcomm] = useState([])
    const [statuscomment, setstatusCom] = useState(false)
    const comm = (val) => {
        setcomm(val)
        // console.log(com);

    }
    const getPrice = async (table) => {
        var query = "SELECT sum(amount) as total FROM " + table + " WHERE checked='1' AND workorderid=" + Id

        db.transaction((tx) => {
            tx.executeSql(
                query,
                [],
                (tx, result2) => {
                    if (result2.rows.length) {
                        if (result2.rows._array[0].total) {
                            var hocPrice = result2.rows._array[0].total;
                            console.log("pppppppppppp",hocPrice);
                            if (table == 'adhocitems') {
                                db.transaction((tx) => {
                                    tx.executeSql(
                                        'SELECT id FROM cal WHERE workorderid=' + Id,
                                        [],
                                        (tx, result) => {
                                            console.log("call:" + JSON.stringify(result));
                                            if (result.rows.length > 0) {
                                                var query = "UPDATE cal SET addhocPrice=" + hocPrice + " WHERE workorderid=" + Id
                                                var value = [];
                                            } else {
                                                var query = 'INSERT INTO cal (workorderid, addhocPrice, taskPrice) VALUES (?, ?, ?)'
                                                var value = [Id, hocPrice, 0];
                                            }
                                            db.transaction(function (tx) {
                                                tx.executeSql(
                                                    query, value
                                                    ,
                                                    (tx, results) => {
                                                        db.transaction((tx) => {
                                                            tx.executeSql(
                                                                'SELECT * FROM cal',
                                                                [],
                                                                (tx, result) => {
                                                                    console.warn("cal", result);
                                                                }
                                                            );
                                                        });
                                                    }
                                                );
                                            });
                                        }
                                    );
                                });

                            } else {
                                db.transaction((tx) => {
                                    tx.executeSql(
                                        'SELECT id FROM cal WHERE workorderid=' + Id,
                                        [],
                                        (tx, result) => {
                                            console.log("call:" + JSON.stringify(result));
                                            if (result.rows.length > 0) {
                                                var query = "UPDATE cal SET taskPrice=" + hocPrice + " WHERE workorderid=" + Id
                                                var value = [];
                                            } else {
                                                var query = 'INSERT INTO cal (workorderid, addhocPrice, taskPrice) VALUES (?, ?, ?)'
                                                var value = [Id, 0, hocPrice];
                                            }
                                            db.transaction(function (tx) {
                                                tx.executeSql(
                                                    query, value
                                                    ,
                                                    (tx, results) => {
                                                        db.transaction((tx) => {
                                                            tx.executeSql(
                                                                'SELECT * FROM cal',
                                                                [],
                                                                (tx, result) => {
                                                                    console.warn("cal1", result);
                                                                }
                                                            );
                                                        });
                                                    }
                                                );
                                            });
                                        }
                                    );
                                });
                            }
                        } else {
                            var query = "UPDATE cal SET addhocPrice=0,taskPrice=0 WHERE workorderid=" + Id;
                            db.transaction(function (tx) {
                                tx.executeSql(
                                    query, value
                                    ,
                                    (tx, results) => {
                                        db.transaction((tx) => {
                                            tx.executeSql(
                                                'SELECT * FROM cal',
                                                [],
                                                (tx, result) => {
                                                    console.warn("cal", result);
                                                    // alert("boo")
                                                }
                                            );
                                        });
                                    }
                                );
                            });
                        }
                    }

                }
            );
        });
    }

    const cal = () => {
        var temp = [];
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM details WHERE id=' + Id,
                [],
                (tx, result1) => {
                    // console.warn("details:", JSON.stringify(result1));
                    if (result1.rows.length > 0) {
                        var option_price = result1.rows._array[0].option_price;
                        setTotal(option_price)
                        var companytax = result1.rows._array[0].companytax;

                        const task = getPrice('task')
                        var addHocPrice = getPrice('adhocitems')

                        setTimeout(() => {
                            db.transaction((tx) => {
                                tx.executeSql(
                                    'SELECT (taskPrice + addhocPrice) as SubitemPrice FROM cal WHERE workorderid=' + Id,
                                    [],
                                    (tx, result) => {
                                        if (result.rows._array.length) {
                                            if (result.rows._array[0].SubitemPrice) {
                                                db.transaction((tx) => {
                                                    tx.executeSql(
                                                        'SELECT * FROM task WHERE checked="1" AND workorderid=' + Id,
                                                        [],
                                                        (tx, result0) => {
                                                            var SubitemPrice = result.rows._array[0].SubitemPrice;
                                                            var price = option_price + SubitemPrice;
                                                            setTotal(price)
                                                            db.transaction((tx) => {
                                                                tx.executeSql(
                                                                    'SELECT * FROM adhocitems WHERE checked="1" AND workorderid=' + Id,
                                                                    [],
                                                                    (tx, result9) => {
                                                                        123
                                                                        var task = result0.rows.length + result9.rows.length
                                                                        setTotalTask(1 + task);
                                                                        // alert(JSON.stringify(result.rows._array[0].SubitemPrice))
                                                                        var SubitemPrice = result.rows._array[0].SubitemPrice;
                                                                        // console.warn("cal1", result);
                                                                        var price = option_price + SubitemPrice;
                                                                        // alert(price)
                                                                        setTotal(price)
                                                                    }
                                                                );
                                                            });
                                                        }
                                                    );
                                                });
                                            } else {
                                                setTotal(option_price)
                                            }
                                        }
                                    }
                                );
                            });
                        }, 3000)

                        console.log('====================================');
                        console.log(total);
                        console.log('====================================');

                    } else {
                        alert("Something went wrong")
                        navigation.navigate('Dashboard');
                    }
                }
            );
        });


    }

    const setting2 = (value) => {
        console.log(value);
        setlocal(value)
        console.log("kasdjgfuerhfgoih", local);
    }
    const setting3 = (val) => {
        setadhocs(val)
        setMasterDataSource(val)
        setFilteredDataSource(val)
    }
    const setting4 = (val) => {
        settasklist(val)
    }
    const setting5 = (val) => {
        // alert(JSON.stringify(val))
        setadhoc(val)
    }

    const onresion = (resion) => {
        console.log(resion);
        setresion(resion)
    }
    const onCancel = (cnlresion) => {
        console.log(cnlresion);
        setcnlresion(cnlresion)
    }

    const Reschedules = () => {
        if (days === "") {
            alert('Please Select Date')
            return false
        }
        if (resion === "") {
            alert('Please Select Reason')
            return false
        }
        const redate = Moment(days, 'YYYY MM DD').format('YYYY-MM-DD');
        const type = 2 // ! = cancel ; 2 = Reschedule;
        var reasonid = resion;
        const data = [type, reasonid[0]];
        console.log(data);

        var query1 = "UPDATE hell SET type=" + type + ", reasonid=" + reasonid + ", date='" + redate + "', workstatus=" + 4 + ", workstatusname='Rescheduled', Modification=1 WHERE hellid=" + local.id;
        var query2 = "UPDATE details SET workstatusname='Rescheduled', Modification=1 WHERE id=" + local.id;

        console.log(query1, query2);

        console.log("booo", local.id);
        db.transaction((tx) => {
            tx.executeSql(
                query1,
                [],
                (tx, result) => {
                    console.log("updation:" + JSON.stringify(result));

                    db.transaction((tx) => {
                        tx.executeSql(
                            query2,
                            [],
                            (tx, result) => {
                                console.log("updation:" + JSON.stringify(result));
                            }
                        );
                    });
                    db.transaction((tx) => {
                        tx.executeSql(
                            'SELECT * FROM details WHERE id=' + local.id,
                            [],
                            (tx, result) => {
                                console.log("details:" + JSON.stringify(result));
                                setting2(result.rows._array[0])
                                alter("Requested for Reschedule WorkOrder has been Sent Sucessfully To The Admin")
                                // NetInfo.addEventListener(networkState => {
                                //     if (networkState.isConnected == true) {
                                Request();
                                //     }
                                // })
                                visible(false)
                            }
                        );
                    });
                }
            );
        });
        console.log("booo", "end");

    }

    const Cancel = () => {
        if (cnlresion === "") {
            alert('Please Select Reason')
        }
        const type = 1 // ! = cancel ; 2 = Reschedule;
        var reasonid = cnlresion;
        const data = [type, reasonid[0]];
        console.log(data);

        var query1 = "UPDATE hell SET type=" + type + ", reasonid=" + reasonid + ", workstatus=" + 5 + ", workstatusname='Cancelled', Modification=1 WHERE hellid=" + local.id;
        var query2 = "UPDATE details SET workstatusname='Cancelled', Modification=1 WHERE id=" + local.id;

        console.log(query1, query2);


        console.log("booo", local.id);
        db.transaction((tx) => {
            tx.executeSql(
                query1,
                [],
                (tx, result) => {
                    console.log("updation:" + JSON.stringify(result));
                    db.transaction((txn) => {
                        txn.executeSql(
                            query2,
                            [],
                            (tx, result1) => {
                                console.log("updation1:" + JSON.stringify(result1));

                            }
                        );
                    });
                    db.transaction((tx) => {
                        tx.executeSql(
                            'SELECT * FROM details WHERE id=' + local.id,
                            [],
                            (tx, result) => {
                                console.log("details:" + JSON.stringify(result));
                                setting2(result.rows._array[0])
                                alter("Requested for Cancel WorkOrder has been Sent Sucessfully To The Admin")
                                Request();
                                setcan(false)
                            }
                        );
                    })

                }
            );
        });
        console.log("booo", "end");

    }

    const minDate = new Date();

    const Addtask = (item) => {
        var type = undefined;
        if (item.item == 'subItem') {
            type = 1
        }
        if (item.item == 'customItem') {
            type = 2
        }
        console.log(item);

        db.transaction(function (tx) {
            tx.executeSql(
                'UPDATE task SET checked=1, Modification=1 WHERE id=' + item.id,
                [],
                (tx, results) => {

                    alert("Task Added Successfully")
                    cal();
                    Request();
                    visible(false)
                }
            );
        });
    }

    const taskprice = (itemValue, item) => {
        // console.log(itemValue, item);
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT price FROM task WHERE id=' + item.id,
                [],
                (tx, result) => {
                    // console.log("task", JSON.stringify(result));
                    var price = result.rows._array[0].price;
                    var quantity = itemValue;
                    var amount = parseFloat(price) * parseInt(quantity)
                    var query = 'UPDATE task SET amount=' + amount + ', quantity=' + quantity + ', Modification=1, checked=1 WHERE id=' + item.id;
                    // console.log('====================================');
                    console.log(query);
                    // console.log('====================================');
                    db.transaction(function (tx) {
                        tx.executeSql(
                            query,
                            [],
                            (tx, results) => {
                                db.transaction((tx) => {
                                    tx.executeSql(
                                        "SELECT * FROM task WHERE workorderid=" + Id,
                                        [],
                                        (tx, result) => {
                                            console.warn("taskajksdhfhdsklodsvkldsjnfcdso", JSON.stringify(result));
                                            setting4(result.rows._array)
                                            cal();
                                            onRefresh()
                                        }
                                    );
                                });
                            }
                        );
                    });
                }
            );
        });
    }

    const RemoveAdHoc = (item) => {

        db.transaction(function (tx) {
            tx.executeSql(
                'DELETE FROM adhocitems WHERE id=' + item.id,
                [],
                (tx, results) => {

                    db.transaction((tx) => {
                        tx.executeSql(
                            "SELECT * FROM adhocitems WHERE checked='1' AND workorderid=" + Id,
                            [],
                            (tx, result) => {
                                cal();
                                alert("Items Removed Successfully")
                                console.warn("adhocitems", JSON.stringify(result));
                                setting5(result.rows._array)
                                setTotalTask(totaltask - 1);
                            }
                        );
                    });
                    visible(false)
                    setVisibles(false)
                }
            );
        });
        console.log(item);

    }

    const UpdateAdHoc = (itemValue, item) => {
        // console.log(itemValue, item);

        console.log(item);
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT price FROM item WHERE id=' + item.id,
                [],
                (tx, result) => {
                    // alert(JSON.stringify(result))
                    // return;
                    var price = result.rows._array[0].price;
                    var quantity = itemValue;
                    var amount = parseInt(price) * parseInt(quantity)
                    console.log("popopopopopopopopopopo",price,quantity,amount,item.id,result);
                    var query = 'UPDATE adhocitems SET amount=' + amount + ', quantity=' + quantity + ', checked=1, Modification=1 WHERE id=' + item.id;
                    // console.log('====================================');
                    // console.log(query);
                    // console.log('====================================');
                    db.transaction(function (tx) {
                        tx.executeSql(
                            query,
                            [],
                            (tx, results) => {
                                db.transaction((tx) => {
                                    tx.executeSql(
                                        "SELECT * FROM adhocitems WHERE checked='1' AND workorderid=" + Id,
                                        [],
                                        (tx, result) => {
                                            alert("Quantity Updated Successfully")
                                            console.warn("adhocitems", JSON.stringify(result));
                                            setting5(result.rows._array)
                                            Request();
                                            cal();
                                        }
                                    );
                                });
                            }
                        );
                    });
                }
            );
        });

    }

    const [visibles, setVisibles] = useState(false);

    const toggleAlert = (visibles) => {
        setVisibles(visibles)
    }

    const alter = () => setVisibles(false)





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
                    db.transaction((tx) => {
                        tx.executeSql(
                            'SELECT * FROM details WHERE id=' + local.id,
                            [],
                            (tx, result) => {
                                if (result) {
                                    alert("Work order End Successfully")
                                    var extime = Moment(result.rows._array[0].expected_start_time, 'hh').format('hh')
                                    var extimes = Moment(result.rows._array[0].expected_end_time, 'hh mm').format('mm')
                                    var ground = Moment(result.rows._array[0].actual_end_time, 'hh mm a').format('hh:mm a')
                                    var fixtime = Moment(result.rows._array[0].actual_start_time, 'hh mm a').add(extime, 'hours').add(extimes, 'minutes').format('hh:mm a')
                                    setfixtime(fixtime)
                                    setground(ground)
                                }
                            }
                        );
                    });
                    Request();
                }
            );
        });
        console.log("end");

    }

    const timer = () => {
        var start_time = hour + ':' + mint + ':' + secs
        var start_date = Moment().format('YYYY-MM-DD');


        if (!start_time) {
            alert('Try Again Please')
        }
        var data = [local.id, start_date, start_time]
        var query1 = "UPDATE hell SET actual_start_date='" + start_date + "', actual_start_time='" + start_time + "', workstatus=" + 2 + ", workstatusname='In Progress', Modification=1 WHERE hellid=" + local.id;
        var query2 = "UPDATE details SET actual_start_time='" + start_time + "', status=" + 2 + ", workstatusname='In Progress', Modification=1 WHERE id=" + local.id;
        // console.log("Start", query1, query2);
        db.transaction((tx) => {
            tx.executeSql(
                query1,
                [],
                (tx, result) => {
                    console.log("updation:" + JSON.stringify(result));
                    db.transaction((tx) => {
                        tx.executeSql(
                            query2,
                            [],
                            (tx, result) => {
                                console.log("updation1:" + JSON.stringify(result));
                            }
                        );
                    });
                    db.transaction((tx) => {
                        tx.executeSql(
                            'SELECT * FROM details WHERE id=' + local.id,
                            [],
                            (tx, result) => {
                                // console.log("detail:" + JSON.stringify(result));
                                if (result) {
                                    setting2("")
                                    setting2(result.rows._array[0])
                                    alter("Work order Start")
                                }
                                // setcnl(false)
                                setVisibles(false)
                                // NetInfo.addEventListener(networkState => {
                                //     if (networkState.isConnected == true) {
                                // Request();
                                //     }
                                // })
                                111
                                onRefresh();
                            }
                        );
                    });
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

        Finish()

        const path = FileSystem.cacheDirectory + "sign.png";
        FileSystem.writeAsStringAsync(
            path,
            signature.replace("data:image/png;base64,", ""),
            { encoding: FileSystem.EncodingType.Base64 }
        )
            .then(() => FileSystem.getInfoAsync(path))
        // .then(console.log)
        // .catch(console.error);  


        setSign(path);

        // if (!IntStatus) {
        //     alert("You Can't Finish Workorder Without Internet Connection")
        // }

        NetInfo.addEventListener(networkState => {
            // console.log("Connection type - ", networkState.type);
            // console.log("Is connected? - ", networkState.isConnected);
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
                            body.append('Content-Type', 'image/png');
                            console.log(body);
                            fetch('https://swif.cloud/api/wxuploadSignature', {
                                method: 'POST', headers: {
                                    "Content-Type": "multipart/form-data",
                                    'Authorization': token,
                                }, body: body
                            }).then((response) => (response.json())).catch((error) => {
                                console.log(error)
                                // alert('Something went wrong Please try again')
                            }).then((res) => {
                                console.log("response" + JSON.stringify(res));
                                // alert("Signature Uploaded Successful")
                                setting2("")
                                db.transaction((tx) => {
                                    tx.executeSql(
                                        'SELECT * FROM details WHERE id=' + Id,
                                        [],
                                        (tx, result) => {
                                            // console.error("details", result);
                                            console.error(result);
                                            setting2(result.rows._array[0])
                                            console.error(JSON.parse(result.rows._array[0].gallery));
                                            setrequest1(JSON.parse(result.rows._array[0].gallery))
                                            setgallary(JSON.parse(result.rows._array[0].gallery))
                                            var extime = Moment(result.rows._array[0].expected_end_time, 'hh').format('hh')
                                            var extimes = Moment(result.rows._array[0].expected_end_time, 'hh mm').format('mm')
                                            var ground = Moment(result.rows._array[0].actual_end_time, 'hh mm a').format('hh:mm a')
                                            var fixtime = Moment(result.rows._array[0].expected_start_time, 'hh mm a').add(extime, 'hours').add(extimes, 'minutes').format('hh:mm a')
                                            setfixtime(fixtime)
                                            setground(ground)
                                            setimagecount(JSON.parse(result.rows._array[0].gallery).length)
                                        }
                                    );
                                });
                                setmodal(false)
                                // NetInfo.addEventListener(networkState => {
                                //     if (networkState.isConnected == true) {
                                // Request();
                                //     }
                                // })
                            })

                        }
                    );
                });
            }
        })
        setmodal(false)

    };


    const [cam, setcam] = useState([])
    const makeName = (length) => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    const Imageupload = async () => {
        const result1 = await ImagePicker.launchCameraAsync(
            {
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                // base64:true,
                aspect: [4, 3],
                quality: 0.5,
                height: 100,
                width: 100,
            }
        );
        console.error(result1);

        const path = FileSystem.cacheDirectory + "sign.png";
        FileSystem.writeAsStringAsync(
            path,
            result1.uri.replace("data:image/jpg;base64,", ""),
            { encoding: FileSystem.EncodingType.Base64 }
        )
            .then(() => FileSystem.getInfoAsync(path))
            console.log("path",path);


        let imgIdentification = makeName(15)
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO gallery (file, workorderid, Modification) VALUES (?, ?, ?)',
                ["" + result1.uri + "", Id, 1],
                (tx, results) => {
                    // console.warn(["" + result1.uri + "", Id]);
                    // console.log(results);
                    db.transaction((tx) => {
                        tx.executeSql(
                            'SELECT * FROM gallery WHERE workorderid' + Id,
                            [],
                            (tx, result) => {
                                // console.error("gallery", JSON.stringify(result));
                                gal(result.rows._array)

                            }
                        );
                    });
                }
            );
            // console.log('end');
        })
        const asset = await MediaLibrary.createAssetAsync(result1.uri);
        console.log('asset', asset);
        MediaLibrary.createAlbumAsync('SWIFAPPX', asset)
            .then(() => {
                // Alert.alert('Album created!')
                const album = MediaLibrary.getAlbumAsync('SWIFAPPX');
                MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            })
            .catch(error => {
                Alert.alert('An error occurred to create album!')
            });
        onRefreshs()

        NetInfo.addEventListener(networkState => {
            // console.log("Connection type - ", networkState.type);
            // console.log("Is connected? - ", networkState.isConnected);
            if (networkState.isConnected) {

                db.transaction((tx) => {
                    tx.executeSql(
                        'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                        [],
                        (tx, results) => {
                            let token = results.rows._array[0].token;
                            console.log({token});

                            if (result1) {

                                let body = new FormData();
                                body.append('workorder_id', local.id)
                                body.append('file', { uri: result1.uri, name: 'file.jpg', filename: 'imageName.jpg', type: 'image/jpg' });
                                body.append('Content-Type', 'image/jpg');
                                body.append('uniqueid', imgIdentification);

                                console.log(body);

                                fetch('https://swif.cloud/api/wxuploadImage', {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'multipart/form-data',
                                        'Authorization': token,
                                    }, body: body
                                })
                                    .then((response) => (response.json()))
                                    .then((res) => {
                                        console.log(res);
                                        console.error({ "after fetch result": res });
                                        // return 
                                        if (res.error) {
                                            // alert('image not uploaded please try again')
                                            console.log(res.error);
                                        }
                                        if (res.message) {
                                            // alert('Image Uploaded Sccuessfully')
                                            // gal(result.rows._array)
                                            db.transaction((tx) => {
                                                tx.executeSql(
                                                    'SELECT * FROM details WHERE id=' + Id,
                                                    [],
                                                    (tx, result) => {

                                                        setting2(result.rows._array[0])
                                                        setrequest1(JSON.parse(result.rows._array[0].gallery))
                                                        setgallary(JSON.parse(result.rows._array[0].gallery))
                                                        var extime = Moment(result.rows._array[0].expected_end_time, 'hh').format('hh')
                                                        var extimes = Moment(result.rows._array[0].expected_end_time, 'hh mm').format('mm')
                                                        var ground = Moment(result.rows._array[0].actual_end_time, 'hh mm a').format('hh:mm a')
                                                        var fixtime = Moment(result.rows._array[0].expected_start_time, 'hh mm a').add(extime, 'hours').add(extimes, 'minutes').format('hh:mm a')
                                                        setfixtime(fixtime)
                                                        setground(ground)
                                                        setimagecount(JSON.parse(result.rows._array[0].gallery).length)

                                                    }
                                                );
                                            });
                                            // Request();
                                            222

                                            onRefreshs()

                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    })
                            }

                        }

                    );
                });
            }
        })
    }




    const getItem = (item) => {
        // alert("booo")

        var id = item.id;
        var name = item.name;
        var price = item.price;
        var quantity = 1;
        var checked = 1;
        var woID = local.id;
        var items = "Add-hoc";
        var category_id = item.category_id;

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM adhocitems WHERE checked='1' AND workorderid=" + Id + " AND id=" + id,
                [],
                (tx, result) => {
                    if (result.rows.length > 0) {
                        alert("You Try to Selecting selected item please update the quantity if you want more to add")
                    } else {
                        db.transaction(function (tx) {
                            tx.executeSql(
                                "INSERT INTO adhocitems (id, amount, checked, item, name, quantity, remarks, workorderid, Modification, category_id) VALUES (?, ?, ?, ?, ?, ? ,?, ?, ?, ?)",
                                [id, price, checked, items, name, quantity, "null", woID, 1, category_id],
                                (tx, results) => {

                                    db.transaction((tx) => {
                                        tx.executeSql(
                                            "SELECT * FROM adhocitems WHERE checked='1' AND workorderid=" + Id,
                                            [],
                                            (tx, result) => {
                                                alert("Items Added Successfully")
                                                console.warn("adhocitems", JSON.stringify(result));
                                                setting5(result.rows._array)
                                                Request();
                                                cal();
                                            }
                                        );
                                    });
                                    visible(false)
                                    setVisibles(false)
                                }
                            );
                        });
                    }
                }
            );
        });


    };

    const ItemView = ({ item }) => {
        return (
            // Flat List Item
            <View>
                <Text style={{ fontSize: 16, textAlign: 'center', padding: 10 }}
                    onPress={() => { getItem(item) }}>
                    {/* {item.id}
                {'.'} */}
                    {item.name}
                </Text>
            </View>
        );
    };
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

    const Visible = (isVisible) => {
        visible(isVisible)
    }
    const GoBack = () => visible(false);

    const Add = (adtask) => {
        setadtask(adtask)
    }
    const add = () => setadtask(false)

    // const Md1 = (modal) => {
    //     if(local.executionPermission == '1'){
    //         // setmodal(modal)
    //         navigation.navigate('SignList')
    //     }else(
    //          Finish()
    //     )
    // }
    const Md = () => {
        if (local.executionPermission == '1') {
            navigation.navigate('SignList')
        } else {
            Finish();
            onRefresh();
        }
    }
    const back = () => setmodal(false)

    const Reschedule = (boo) => {
        setboo(boo)
    }
    const Reschedule1 = () => setboo(false)

    const cancelled = (can) => {
        setcan(can)
    }
    const cango = () => setcan(false)

    const addcom = (adcom) => {
        setadcom(adcom)
        navigation.navigate('Comment')
    }
    const backadcom = () => setadcom(false)

    const [text, setText] = useState('');
    const anotherFunc = (val) => {
        setText('');
    }

    const press = () => {
        setreid(list.id)
        console.warn(reid);
    }

    const onChangeSearch = e => {
        setSearchQuery(e);
        console.log(e);
    }

    const SelectTab = (item, index) => {
        // this function is used for bottom tab navigation in dashboard,connection,notification and profle screen
        setactiveIndex(index)
        // console.log(Profiledata.userdetail.id)
        if (index === 0) {

            navigation.navigate('Dashboard')

        }
        if (index === 1) {
            onRefresh()
        }
        // if (index === 1) {
        //     navigation.navigate('Notification')
        // }
        if (index === 2) {
            navigation.navigate('Profile')
        }
    }

    const [refreshing, setRefreshing] = React.useState(false);
    const [net, setnet] = useState(false)

    const onRefresh = React.useCallback(() => {
        console.log('enter for snik');
        setloading(true)
        Request();
        setTimeout(() => {
            setloading(false)
        }, 3000);
        console.log('end ');
        setRefreshing(true);
        wait(3000).then(() => {
            setRefreshing(false)
            NetInfo.addEventListener(networkState => {
                // console.log("Connection type - ", networkState.type);
                // console.log("Is connected? - ", networkState.isConnected);
                setnet(networkState.isConnected);
            });

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
                    'SELECT * FROM comment WHERE workorder_id=' + Id + ' ORDER BY id DESC LIMIT 1',
                    [],
                    (tx, result) => {
                        if (result.rows.length > 0) {
                            setstatusCom(true);
                        } else {
                            setstatusCom(false);
                        }
                        // console.log("comment", JSON.stringify(result));
                        comm(result.rows._array)
                        // setmsg('')
                    }
                );
            });

            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM gallery WHERE workorderid=" + Id,
                    [],
                    (tx, result) => {
                        // console.error("gallery", JSON.stringify(result));
                        gal(result.rows._array)
                        var imgs = result.rows._array.length
                        setimagecount(imgs)

                    }
                );
            });
        });
    }, []);

    const onRefreshs = React.useCallback(() => {
        // NetInfo.addEventListener(networkState => {
        //     if (networkState.isConnected == true) {
        // Request();
        //     }
        // })
        setRefreshing(true);
        wait(2000).then((

        ) => setRefreshing(false)
        );

        NetInfo.addEventListener(networkState => {
            // console.log("Connection type - ", networkState.type);
            // console.log("Is connected? - ", networkState.isConnected);
            setnet(networkState.isConnected);
        });

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
                'SELECT * FROM comment WHERE workorder_id=' + Id + ' ORDER BY id DESC LIMIT 1',
                [],
                (tx, result) => {
                    if (result.rows.length > 0) {
                        setstatusCom(true);
                    } else {
                        setstatusCom(false);
                    }
                    console.log("comment", JSON.stringify(result));
                    comm(result.rows._array)
                    // setmsg('')
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM gallery WHERE workorderid=" + Id,
                [],
                (tx, result) => {
                    console.error("gallery", JSON.stringify(result));
                    gal(result.rows._array)
                    var imgs = result.rows._array.length
                    setimagecount(imgs)

                }
            );
        });


    }, []);


    const CommentPage = (id) => {
        console.error(id);
        navigation.navigate('Comment')
    }

    const removeImage = (item) => {

        console.error(item);

        db.transaction(function (tx) {
            tx.executeSql(
                'DELETE FROM gallery WHERE id=' + item,
                [],
                (txi, results) => {

                    db.transaction((txz) => {
                        txz.executeSql(
                            "SELECT * FROM gallery WHERE workorderid=" + Id,
                            [],
                            (txp, result) => {
                                alert("Image Removed Successfully")
                                console.warn("gallery", JSON.stringify(result));
                                onRefreshs()
                            }
                        );
                    });
                }
            );
        }); 
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {loading ? <Loading showloading={loading} /> : null}
            {!IntStatus &&
                <View style={{ paddingTop: 30, backgroundColor: 'red', zIndex: 22, paddingBottom: 5 }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13 }}>No Internet connection</Text>
                </View>}

            <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingTop: 30 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 20, color: '#6F00C5', maxWidth: '60%', fontFamily: 'Roboto' }}>{local.customer_name || "default"}</Text>
                    <View style={{ flexDirection: 'column' }}>
                        {local.workstatusname == "Completed" &&
                            <TouchableOpacity style={{ backgroundColor: '#6F00C5', padding: 5 }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Roboto' }}>{totaltask} Tasks Completed</Text>
                            </TouchableOpacity>}
                        {local.workstatusname == "Pending" &&
                            <TouchableOpacity style={{ backgroundColor: '#6F00C5', padding: 5 }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Roboto' }}>0 Tasks Completed</Text>
                            </TouchableOpacity>}
                        {local.workstatusname == "In Progress" &&
                            <TouchableOpacity style={{ backgroundColor: '#6F00C5', padding: 5 }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Roboto' }}>{totaltask} Tasks Completed</Text>
                            </TouchableOpacity>}
                        {local.workstatusname == "Pending" &&
                            <TouchableOpacity style={{ backgroundColor: '#FFBF00', padding: 5, marginLeft: 20 }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Roboto' }}>0 Pictures Taken</Text>
                            </TouchableOpacity>}
                        {local.workstatusname == "In Progress" &&
                            <TouchableOpacity style={{ backgroundColor: '#FFBF00', padding: 5, marginLeft: 20 }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Roboto' }}>{imagecount} Pictures Taken</Text>
                            </TouchableOpacity>}
                        {local.workstatusname == "Completed" &&
                            <TouchableOpacity style={{ backgroundColor: '#FFBF00', padding: 5, marginLeft: 20 }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Roboto' }}>{imagecount} Pictures Taken</Text>
                            </TouchableOpacity>}
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                    <Image
                        style={{ width: 30, height: 30 }}
                        source={require('../src/assets/talking.png')}
                    />
                    <Text style={{ textAlign: 'center', alignSelf: 'center', fontFamily: 'Roboto', paddingLeft: 5 }}>{local.customer_contact_number}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                    <Image
                        style={{ width: 30, height: 30 }}
                        source={require('../src/assets/House.png')}
                    />
                    <Text style={{ textAlign: 'left', paddingLeft: 5, alignSelf: 'center', maxWidth: '90%', fontFamily: 'Roboto', lineHeight: 20 }}>{local.block} {local.street} {local.unit} {local.country} {local.zip}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', paddingTop: 2 }}>
                    <FontAwesome name='user-o' size={22} color='#222323' style={{ paddingLeft: 5 }} />
                    <View style={{ flexDirection: 'row', }}>
                        {local.leader &&
                            <Text style={{ textAlign: 'left', paddingLeft: 10, fontFamily: 'Roboto', lineHeight: 15, fontSize: 12, fontWeight: 'bold' }}>{local.leader}(TL)</Text>}
                        {local.team == "" &&
                            <Text style={{ textAlign: 'left', fontFamily: 'Roboto', lineHeight: 15, fontSize: 12, }}></Text>}
                        {local.team != "" &&
                            <Text style={{ textAlign: 'left', fontFamily: 'Roboto', lineHeight: 15, fontSize: 12, maxWidth: '85%' }}>,{local.team}</Text>}
                    </View>
                </View>
            </View>

            <ScrollView style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, paddingTop: 5 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={{ backgroundColor: '#F0F0F0', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 10, flex: 1 }}>
                    <View style={{ flexDirection: 'row', paddingLeft: 10, padding: 5, borderBottomWidth: 1, borderBottomColor: '#CECECE' }}>
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={require('../src/assets/read-with-hand.png')}
                        />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 10, alignSelf: 'center', textAlign: 'left', fontFamily: 'Roboto', maxWidth: '90%' }}>{local.service_name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: '#CECECE' }}>
                        <View style={{ flexDirection: 'row', display: 'flex', padding: 5 }}>
                            <Image
                                style={{ width: 30, height: 30 }}
                                source={require('../src/assets/c-A.png')}
                            />
                            <Text style={{ color: '#4B4B4B', fontSize: 14, paddingLeft: 5, alignSelf: 'center', fontFamily: 'Roboto', maxWidth: '78%' }}>{local.option_name}</Text>
                        </View>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'center', paddingRight: 10 }}>
                            <Text style={{ color: '#4B4B4B', fontSize: 16, fontFamily: 'Roboto' }}>${parseFloat(local.option_price).toFixed(2)}</Text>
                        </View>

                    </View>
                    {local.adjustment_type &&
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: '#CECECE' }}>
                            <View style={{ flexDirection: 'row', display: 'flex', padding: 5 }}>
                                <Image
                                    style={{ width: 40, height: 40 }}
                                    source={require('../src/assets/c-A.png')}
                                />
                                <Text style={{ color: '#4B4B4B', fontSize: 16, paddingLeft: 5, alignSelf: 'center', fontFamily: 'Roboto' }}>Adjustment</Text>
                            </View>
                            <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'center', flexDirection: 'row' }}>
                                {local.adjustment_type == "addition" &&
                                    <Text style={{ color: '#4B4B4B', fontSize: 20 }}>+</Text>
                                }
                                {local.adjustment_type == "substraction" &&
                                    <Text style={{ color: '#4B4B4B', fontSize: 20 }}>-</Text>
                                }
                                <Text style={{ color: '#4B4B4B', padding: 3, fontSize: 14, alignSelf: 'center', paddingRight: 10, fontFamily: 'Roboto' }}>{parseFloat(local.adjustment_value).toFixed(2)}</Text>
                            </View>
                        </View>}

                    <View>
                        {local.executionPermission == '1' &&
                            <FlatList
                                data={tasklist}

                                keyExtractor={(item) => item.key}
                                // ListEmptyComponent={EmptyListMessage}
                                ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={({ item, index }) =>
                                    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 3, justifyContent: 'space-between' }}>
                                        {item.checked == "1" &&
                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}>
                                                    <AntDesign name="checksquareo" size={24} color="#000" />
                                                    {item.name.length > 20 &&
                                                        <TouchableOpacity onPress={() => {
                                                            Add(!adtask)
                                                            // console.error(item.name.length)
                                                        }}>
                                                            <Text style={{ textAlign: 'left', paddingLeft: 5, fontFamily: 'Roboto' }}>{item.name.substring(0, 22)}...</Text>
                                                            <Modal
                                                                animationType={"slide"}
                                                                transparent={false}
                                                                // onPress={press(local.id)}
                                                                visible={adtask}
                                                                onRequestClose={() => add()}>
                                                                <SafeAreaView>
                                                                    <Text style={{ fontSize: 20, color: '#6F00C5', fontFamily: 'Roboto', padding: 15 }}>Item Name Detail</Text>
                                                                    <ScrollView style={{ marginBottom: 50 }}>
                                                                        <Text style={{ textAlign: 'left', margin: 20 }}>{item.name}</Text>
                                                                    </ScrollView>
                                                                </SafeAreaView>
                                                            </Modal>
                                                        </TouchableOpacity>}
                                                    {item.name.length < 20 &&
                                                        <View>
                                                            <Text style={{ textAlign: 'left', paddingLeft: 5, fontFamily: 'Roboto' }}>{item.name}</Text>
                                                        </View>}
                                                </View>

                                                <View style={{ alignItems: 'center', alignSelf: 'center', width: '14%' }}>
                                                    <Text style={{ alignSelf: 'center', textAlign: 'center', fontFamily: 'Roboto' }}>{item.quantity}</Text>
                                                </View>
                                                <View style={{ width: '18%' }}>
                                                    <Text style={{ alignSelf: 'center', color: '#4B4B4B', textAlign: 'center', fontFamily: 'Roboto' }}>${parseFloat(item.amount)}</Text>
                                                </View>
                                            </View>}
                                        {item.checked == "0" &&
                                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}>
                                                {local.workstatusname == "In Progress" &&
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}>
                                                        <BouncyCheckbox
                                                            size={18}
                                                            fillColor="#303030"
                                                            unfillColor="#FFFFFF"
                                                            iconStyle={{ borderColor: "#4B4B4B", borderRadius: 1 }}
                                                            textStyle={{ fontSize: 14, fontFamily: 'Roboto', maxWidth: 90 }}
                                                            onPress={() => Addtask(item)}
                                                            text={item.name}
                                                        />
                                                    </View>}
                                                {local.workstatusname == "Pending" &&
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}>
                                                        {local.workstatusname == 'In Progress' && <Text>-  </Text>}
                                                        <Text>{item.name}</Text>
                                                    </View>
                                                }

                                            </View>}
                                        {(item.checked == "0" && local.workstatusname == "In Progress") &&
                                            <View style={{ alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }}>
                                                <Text>{item.quantity}</Text>
                                                {
                                                    <Picker
                                                        selectedValue={selectedValue}
                                                        style={{ height: 30, width: 50, paddingLeft: 10 }}
                                                        onValueChange={(itemValue, itemIndex) => taskprice(itemValue, item)}
                                                    >
                                                        <Picker.Item label="" value="" />
                                                        <Picker.Item label="1" value="1" />
                                                        <Picker.Item label="2" value="2" />
                                                        <Picker.Item label="3" value="3" />
                                                        <Picker.Item label="4" value="4" />
                                                        <Picker.Item label="5" value="5" />
                                                        <Picker.Item label="6" value="6" />
                                                        <Picker.Item label="7" value="7" />
                                                        <Picker.Item label="8" value="8" />
                                                        <Picker.Item label="9" value="9" />
                                                        <Picker.Item label="10" value="10" />
                                                    </Picker>}
                                                {/* <Text style={{ fontFamily: 'Roboto', textAlign: 'center' }}>{selectSport}</Text>
                                        <SectionedMultiSelect                        // THIS PACKAGE FOR SELECT MULTIPLE quntity
                                            items={data}
                                            displayKey='label'
                                            IconRenderer={Icons}
                                            uniqueKey="id"
                                            single={true}
                                            // subKey="children"
                                            selectText='1'
                                            // searchPlaceholderText='Select quntity'

                                            selectedItems={selectSport}
                                            onSelectedItemsChange={onSelectedSports}
                                            styles={{ selectToggle: { fontSize: 16, padding: 10 }, chipsWrapper: { padding: 10, backgroundColor: '#fff' } }}
                                        /> */}
                                            </View>}
                                            {local.workstatusname != "In Progress" &&
                                                <Text>{item.quantity}</Text>
                                            }
                                        {item.checked == "0" &&
                                            <View style={{ alignSelf: 'center' }}>
                                                <Text style={{ alignSelf: 'center', color: '#4B4B4B', textAlign: 'center', fontFamily: 'Roboto' }}>${item.amount}</Text>
                                            </View>}
                                    </View>
                                }
                            />}
                        {local.executionPermission == '0' &&
                            <FlatList
                                data={tasklist}

                                keyExtractor={(item) => item.key}
                                // ListEmptyComponent={EmptyListMessage}
                                ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={({ item, index }) =>
                                    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 3, justifyContent: 'space-between' }}>
                                        {
                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}>
                                                    {/* <AntDesign name="checksquareo" size={24} color="#000" /> */}
                                                    {item.name.length > 20 &&
                                                        <TouchableOpacity onPress={() => {
                                                            Add(!adtask)
                                                            // console.error(item.name.length)
                                                        }}>
                                                            <Text style={{ textAlign: 'left', paddingLeft: 5, fontFamily: 'Roboto' }}>{item.name.substring(0, 22)}...</Text>
                                                            <Modal
                                                                animationType={"slide"}
                                                                transparent={false}
                                                                // onPress={press(local.id)}
                                                                visible={adtask}
                                                                onRequestClose={() => add()}>
                                                                <SafeAreaView>
                                                                    <Text style={{ fontSize: 20, color: '#6F00C5', fontFamily: 'Roboto', padding: 15 }}>Custom Item Name</Text>
                                                                    <Text style={{ textAlign: 'left', margin: 20 }}>{item.name}</Text>
                                                                </SafeAreaView>
                                                            </Modal>
                                                        </TouchableOpacity>}
                                                    {item.name.length < 20 &&
                                                        <View>
                                                            <Text style={{ textAlign: 'left', paddingLeft: 5, fontFamily: 'Roboto' }}>{item.name}</Text>
                                                        </View>}
                                                </View>

                                                <View style={{ alignItems: 'center', alignSelf: 'center', width: '14%' }}>
                                                    <Text style={{ alignSelf: 'center', textAlign: 'center', fontFamily: 'Roboto' }}>{item.quantity}</Text>
                                                </View>
                                                <View style={{ width: '18%' }}>
                                                    <Text style={{ alignSelf: 'center', color: '#4B4B4B', textAlign: 'center', fontFamily: 'Roboto' }}>${parseFloat(item.amount)}</Text>
                                                </View>
                                            </View>}
                                        {item.checked == "0" &&
                                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}>
                                                {local.workstatusname == "Pending" &&
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}>
                                                        <Text>{item.name}</Text>
                                                    </View>
                                                }

                                            </View>}
                                        {item.checked == "0" &&
                                            <View style={{ alignItems: 'center', alignSelf: 'center', flexDirection: 'row' }}>
                                                <Text>{item.quantity}</Text>
                                            </View>}
                                        {item.checked == "0" &&
                                            <View style={{ alignSelf: 'center' }}>
                                                <Text style={{ alignSelf: 'center', color: '#4B4B4B', textAlign: 'center', fontFamily: 'Roboto' }}>${item.amount}</Text>
                                            </View>}
                                    </View>
                                }
                            />}
                    </View>
                    <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#CECECE', padding: 5 }}>
                        <View style={{ padding: 5, flexDirection: 'row' }}>
                            <Image
                                style={{ width: 30, height: 30 }}
                                source={require('../src/assets/Items.png')}
                            />
                            <Text style={{ fontSize: 15, fontWeight: 'bold', paddingLeft: 15, alignSelf: 'center', fontFamily: 'Roboto' }}>Ad-Hoc Service Items as Requested</Text>
                        </View>
                    </View>
                    <View style={{}}>

                        {local.executionPermission == '1' &&
                            <FlatList
                                data={adhoc}
                                keyExtractor={(item) => item.key}
                                // ListEmptyComponent={EmptyListMessage}
                                ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={({ item, index }) =>
                                    <View style={{ flexDirection: 'row', padding: 10, borderBottomColor: '#CECECE', borderBottomWidth: 0.5 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}>
                                            {/* <AntDesign name="checksquareo" size={24} color="#000" /> */}
                                            <TouchableOpacity onPress={() => { toggleAlert(!visibles) }}>
                                                <Image
                                                    style={{ width: 30, height: 30 }}
                                                    source={require('../src/assets/C-B.png')}
                                                />
                                                <FancyAlert
                                                    visible={visibles}
                                                    icon={<View style={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: 50,
                                                        width: '100%',
                                                        backgroundColor: '#fff'
                                                    }}>
                                                        <Image
                                                            source={{ uri: logindata.company_logo }}
                                                            style={{ height: 60, width: 60, resizeMode: 'cover', borderRadius: 50 }}
                                                        />
                                                    </View>}
                                                    style={{ backgroundColor: 'white' }}
                                                ><View>
                                                        <Text style={{ fontSize: 16, fontWeight: '400' }}>Are you sure, You want to remove theTask for the AdHoc Item</Text>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 40, paddingBottom: 20, alignContent: 'center', alignItems: 'center' }}>
                                                            <TouchableOpacity onPress={() => { RemoveAdHoc(item) }}
                                                                style={{ backgroundColor: '#DEDEDE', paddingBottom: 10, paddingTop: 10, paddingLeft: 30, paddingRight: 30, borderRadius: 15 }}>
                                                                <Text style={{ fontSize: 16, fontWeight: '400' }}>Yes</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => alter()}
                                                                style={{ backgroundColor: '#DEDEDE', paddingBottom: 10, paddingTop: 10, paddingLeft: 20, paddingRight: 20, borderRadius: 15 }}>
                                                                <Text style={{ fontSize: 16, fontWeight: '400' }}>Cancel</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </FancyAlert>
                                            </TouchableOpacity>
                                            <Text style={{ textAlign: 'left', paddingLeft: 5, maxWidth: "85%", fontFamily: 'Roboto', color: '#4B4B4B' }}>{item.name}</Text>
                                        </View>

                                        <View style={{ alignItems: 'center', alignSelf: 'center', flexDirection: 'row', display: 'flex', height: 16 }}>
                                            <Text style={{ color: '#4B4B4B' }}>{item.quantity}</Text>
                                            <Picker
                                                style={{ width: 50, paddingLeft: 10, alignSelf: 'center' }}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    UpdateAdHoc(itemValue, item)
                                                }}
                                            >
                                                <Picker.Item label="" />
                                                <Picker.Item label="1" value="1" />
                                                <Picker.Item label="2" value="2" />
                                                <Picker.Item label="3" value="3" />
                                                <Picker.Item label="4" value="4" />
                                                <Picker.Item label="5" value="5" />
                                                <Picker.Item label="6" value="6" />
                                                <Picker.Item label="7" value="7" />
                                                <Picker.Item label="8" value="8" />
                                                <Picker.Item label="9" value="9" />
                                                <Picker.Item label="10" value="10" />
                                            </Picker>
                                        </View>
                                        <View style={{ alignSelf: "center" }}>
                                            <Text style={{ alignSelf: 'center', color: '#4B4B4B', textAlign: 'center', fontFamily: 'Roboto' }}>${parseFloat(item.amount)}</Text>
                                        </View>
                                    </View>}
                            />}
                        {local.executionPermission == '0' &&
                            <FlatList
                                data={adhoc}
                                keyExtractor={(item) => item.key}
                                // ListEmptyComponent={EmptyListMessage}
                                ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={({ item, index }) =>
                                    <View style={{ flexDirection: 'row', padding: 10, borderBottomColor: '#CECECE', borderBottomWidth: 0.5, justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}>
                                            {/* <AntDesign name="checksquareo" size={24} color="#000" /> */}
                                            <Text style={{ textAlign: 'left', paddingLeft: 5, maxWidth: "85%", fontFamily: 'Roboto', color: '#4B4B4B' }}>{item.name}</Text>
                                        </View>

                                        <View style={{ alignItems: 'center', alignSelf: 'center', flexDirection: 'row', display: 'flex', height: 16 }}>
                                            <Text style={{ color: '#4B4B4B' }}>{item.quantity}</Text>
                                        </View>
                                        <View style={{}}>
                                            <Text style={{ color: '#4B4B4B', textAlign: 'right', fontFamily: 'Roboto', }}>${item.amount}</Text>
                                        </View>
                                    </View>}
                            />}
                    </View>
                    {local.addHocPermission == '1' &&
                        <View>
                            {local.executionPermission == '1' &&
                                <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#CECECE' }}>
                                    {local.workstatusname == "In Progress" &&
                                        <TouchableOpacity onPress={() => Visible(!isVisible)}>
                                            <View style={{ flexDirection: 'row', padding: 10 }}>
                                                <Image
                                                    style={{ width: 30, height: 30 }}
                                                    source={require('../src/assets/Plus.png')}
                                                />
                                                <Text style={{ color: '#6F00C5', fontSize: 16, paddingLeft: 5, alignSelf: 'center', fontStyle: 'italic', fontFamily: 'Roboto' }}>Add an Ad-Hoc Items for Above Service</Text>
                                            </View>
                                            <Modal
                                                animationType={"slide"}
                                                transparent={false}
                                                // onPress={repress(item.id)}
                                                visible={isVisible}
                                                onRequestClose={() => GoBack()}>
                                                <SafeAreaView style={{ backgroundColor: '#fff' }}>
                                                    <TouchableOpacity onPress={() => GoBack()} style={{}}>
                                                        <Icon name="arrow-back" size={30} color="#6F00C5" />
                                                    </TouchableOpacity>
                                                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#CECECE', paddingTop: 20, paddingBottom: 10 }}>
                                                        <Text style={{ textAlign: 'center', color: '#8F3CD0', fontFamily: 'Roboto', fontSize: 16 }}>Add Ad-Hoc Items to work order</Text>
                                                    </View>
                                                    <View style={{ alignItems: 'center', paddingTop: 20, paddingLeft: 10, paddingRight: 10 }}>
                                                        <TextInput
                                                            style={{ backgroundColor: '#fff', borderRadius: 30, paddingLeft: 100, paddingRight: 100, paddingBottom: 10, paddingTop: 10, borderColor: '#8F3CD0', borderWidth: 2, fontSize: 16 }}
                                                            onChangeText={(text) => SearchFilterFunction(text)}
                                                            value={search}
                                                            underlineColorAndroid="transparent"
                                                            placeholder="Search Items..."
                                                        />
                                                        <FlatList
                                                            data={filteredDataSource}
                                                            keyExtractor={(item, index) => index.toString()}
                                                            ItemSeparatorComponent={ItemSeparatorView}
                                                            renderItem={ItemView}
                                                        />
                                                    </View>
                                                </SafeAreaView>
                                            </Modal>
                                        </TouchableOpacity>}
                                </View>}
                        </View>}
                    <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#CECECE', }}>
                        <View style={{ flexDirection: 'row', borderBottomColor: '#CECECE', padding: 10 }}>
                            <Image
                                style={{ width: 35, height: 35 }}
                                source={require('../src/assets/Pictures.png')}
                            />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 15, alignSelf: 'center', color: '#000', fontFamily: 'Roboto' }}>Pictures for the Work Order</Text>
                        </View>
                        <View>
                            {local.gallery &&
                                <FlatList
                                    // data={JSON.parse(local.gallery)}
                                    data={gall}
                                    keyExtractor={(item) => item.key}
                                    horizontal={true}
                                    // ItemSeparatorComponent={ItemSeparatorView}
                                    renderItem={({ item, index }) =>
                                        <View style={{ padding: 10 }}>
                                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                                <Image
                                                    source={{ uri: item.file }}
                                                    style={{ width: 220, height: 220 }}
                                                />
                                                <TouchableOpacity onPress={() => removeImage(item.id)} style={{ alignSelf: 'flex-end', marginLeft: -60, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ color: '#fff', alignSelf: 'center' }}>
                                                            {/* {Moment(item.timestamp).format('hh:mma')} on {Moment(item.timestamp).format('D MMM YYYY')} */}
                                                        </Text>
                                                    </View>
                                                    {local.executionPermission == '1' &&
                                                        <View>

                                                            <Image
                                                                style={{ width: 40, height: 40, }}
                                                                source={require('../src/assets/close-png.png')}
                                                            />
                                                        </View>}
                                                </TouchableOpacity>
                                            </View>

                                        </View>}
                                />}
                        </View>
                    </View>

                    {local.executionPermission == '1' &&
                        <View>
                            {local.workstatusname == "In Progress" &&
                                <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#CECECE', padding: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Imageupload()}>
                                            <Image
                                                style={{ width: 30, height: 30 }}
                                                source={require('../src/assets/Plus.png')}
                                            />
                                            <Text style={{ fontSize: 16, paddingLeft: 15, alignSelf: 'center', color: '#6F00C5', fontStyle: 'italic', fontFamily: 'Roboto' }}>Add pictures for the Work Order</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>}
                        </View>}

                    <View style={{ borderTopWidth: 1, borderTopColor: '#CECECE', padding: 10 }}>
                        <TouchableOpacity style={{ padding: 15, backgroundColor: '#fff', borderRadius: 30 }}
                            onPress={() => {
                                addcom(!adcom)
                                CommentPage(Id)
                            }}>
                            {!statuscomment &&
                                <Text style={{ fontWeight: 'bold', paddingLeft: 5, fontFamily: 'Roboto' }}>Add Comment</Text>}
                            {statuscomment &&
                                <FlatList
                                    data={com}

                                    keyExtractor={(item) => item.key}
                                    // ListEmptyComponent={EmptyListMessage}
                                    renderItem={({ item, index }) =>
                                        <View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: '#6F00C5', fontWeight: 'bold', fontFamily: 'Roboto' }}>{item.commenter}:  </Text>
                                                <Text style={{ fontWeight: 'bold', fontFamily: 'Roboto' }}>{Moment(item.created).format('D MMM YYYY')}</Text>
                                            </View>
                                            <Text>{item.description}</Text>
                                        </View>}
                                />}
                            {/* <Modal
                                animationType={"slide"}
                                transparent={false}
                                // onPress={()=>press()}
                                visible={adcom}
                                onRequestClose={() => backadcom()}
                            >
                                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', marginBottom: -20 }}>
                                    <View style={{ flexDirection: 'row', paddingTop: 15, paddingBottom: 10, alignItems: 'center', backgroundColor: '#fff' }}>
                                        <TouchableOpacity onPress={() => backadcom()} style={{ alignSelf: 'center' }}>
                                            <Icon name="arrow-back" size={30} color="#6F00C5" />
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: 18, color: '#6F00C5', paddingLeft: 15, fontFamily: 'Roboto' }}>Remarks for Works Order at</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingBottom: 10 }}>
                                        <Image
                                            style={{ width: 35, height: 35 }}
                                            source={require('../assets/House.png')}
                                        />
                                        <Text style={{ textAlign: 'left', paddingLeft: 2, fontSize: 14, fontFamily: 'Roboto', maxWidth: '90%', lineHeight: 20, alignSelf: 'center', fontWeight: 'bold' }}>{local.customer_name}: </Text>
                                        <Text style={{ textAlign: 'left', paddingLeft: 2, fontSize: 14, fontFamily: 'Roboto', maxWidth: '90%', lineHeight: 20, alignSelf: 'center', }}>{local.unit} {local.street} {local.block} {local.zone} {local.zip}</Text>
                                    </View>
                                    <ScrollView
                                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                                        <View style={{ margin: 5, backgroundColor: '#F0F0F0', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: '145%' }}>
                                            <FlatList
                                                data={Comment.Commentlist}
                                                keyExtractor={(item) => item.key}
                                                // ItemSeparatorComponent={SeparatorView}
                                                renderItem={({ item }) =>
                                                    <View>
                                                        {item.commenter_type == "Worker" &&
                                                            <View style={{ padding: 10, backgroundColor: '#DEDFFE', borderRadius: 10, marginTop: 20, marginLeft: 15, marginRight: 15 }}>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Text style={{ color: '#6F00C5', fontWeight: 'bold', fontFamily: 'Roboto' }}>{item.commenter}:  </Text>
                                                                    <Text style={{ fontWeight: 'bold', fontFamily: 'Roboto' }}>{Moment(item.created).format('D MMM YYYY')} at {Moment(item.created).format('hh:mm a')}</Text>
                                                                </View>
                                                                <Text>{item.description}</Text>
                                                            </View>}
                                                        {item.commenter_type == "Admin" &&
                                                            <View style={{ padding: 10, backgroundColor: '#D9D9D9', borderRadius: 10, marginTop: 20, marginLeft: 15, marginRight: 15 }}>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Text style={{ color: '#6F00C5', fontWeight: 'bold', fontFamily: 'Roboto' }}>{item.commenter}:  </Text>
                                                                    <Text style={{ fontWeight: 'bold', fontFamily: 'Roboto' }}>{Moment(item.created).format('D MMM YYYY')} at {Moment(item.created).format('hh:mm a')}</Text>
                                                                </View>
                                                                <Text>{item.description}</Text>
                                                            </View>}
                                                    </View>}
                                            />
                                        </View>
                                    </ScrollView>

                                    <View style={{ backgroundColor: '#F0F0F0', marginLeft: 5, marginRight: 5 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>
                                            <View style={{ borderWidth: 1, borderColor: '#D2D2D2', width: '72%', height: "80%", alignSelf: 'center', }}>
                                                <TextInput
                                                    style={{ padding: 15, backgroundColor: '#fff' }}
                                                    onChangeText={msg => setmsg(msg)}
                                                    multiline={true}
                                                    numberOfLines={4}
                                                    textAlignVertical="top"
                                                    maxLength={350}
                                                    clearButtonMode="always"
                                                    value={msg}
                                                />
                                            </View>
                                            <TouchableOpacity onPress={() => Messagelist()} style={{ alignSelf: 'center', alignItems: 'center', }}>
                                                <Image
                                                    style={{ width: 67, height: 67, resizeMode: 'cover' }}
                                                    source={require('../assets/send_icon.png')}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </SafeAreaView>
                            </Modal> */}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <View style={{ marginLeft: 15, marginRight: 15, backgroundColor: '#fff', }}>
                {shouldShow == false &&
                    <TouchableOpacity
                        onPress={() => setShouldShow(!shouldShow)}
                        style={{ alignSelf: 'center', justifyContent: 'center' }}
                    ><Fontisto name="angle-up" size={28} color="black" /></TouchableOpacity>}
                {shouldShow == true &&
                    <TouchableOpacity
                        onPress={() => setShouldShow(!shouldShow)}
                        style={{ alignSelf: 'center', justifyContent: 'center' }}
                    ><Fontisto name="angle-down" size={28} color="black" /></TouchableOpacity>}
                {shouldShow ? (
                    <View style={{
                        backgroundColor: '#fff', justifyContent: 'space-between', borderTopRightRadius: 30, borderTopLeftRadius: 30, shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 5,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#CECECE', padding: 10 }}>
                            <Image
                                source={require('../src/assets/money-in-hand.png')}
                                style={{ width: 80, height: 80 }}
                            />
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 2 }}>
                                    <Text style={{ color: '#4B4B4B' }}>Sub-Total: </Text>
                                    {local.adjustment_type == null &&
                                        <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${parseFloat(total) + parseFloat(local.adjustment_value || 0)}</Text>}

                                    {local.adjustment_type == "" &&
                                        <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${parseFloat(total) + parseFloat(local.adjustment_value || 0)}</Text>}

                                    {local.adjustment_type == "addition" &&
                                        <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${parseFloat(total) + parseFloat(local.adjustment_value || 0)}</Text>}

                                    {local.adjustment_type == "substraction" &&
                                        <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${parseFloat(total) - parseFloat(local.adjustment_value || 0)}</Text>}
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 2 }}>
                                    <Text style={{ color: '#4B4B4B' }}>TAX@ {local.companytax}%: </Text>
                                    {local.adjustment_type == null &&
                                        <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)).toFixed(1) * parseFloat(local.companytax)) / 100).toFixed(2))}</Text>}

                                    {local.adjustment_type == "" &&
                                        <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)).toFixed(1) * parseFloat(local.companytax)) / 100).toFixed(2))}</Text>}

                                    {local.adjustment_type == "addition" &&
                                        <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)).toFixed(1) * parseFloat(local.companytax)) / 100).toFixed(2))}</Text>}

                                    {local.adjustment_type == "substraction" &&
                                        <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) - parseFloat(local.adjustment_value || 0) - (((parseFloat(total) - parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)).toFixed(1) * parseFloat(local.companytax)) / 100).toFixed(2))}</Text>}
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 2 }}>
                                    <Text style={{ color: '#4B4B4B' }}>Discount: </Text>
                                    {local.adjustment_type == null &&
                                        <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100).toFixed(2))}</Text>}

                                    {local.adjustment_type == "" &&
                                        <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100).toFixed(2))}</Text>}

                                    {local.adjustment_type == "addition" &&
                                        <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100).toFixed(2))}</Text>}

                                    {local.adjustment_type == "substraction" &&
                                        <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${((((parseFloat(total) - parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100).toFixed(2))}</Text>}
                                </View>
                                {local.priceViewPermission == '1' &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 2 }}>
                                        <Text style={{ color: '#4B4B4B' }}>Amount to Collect: </Text>
                                        {local.adjustment_type == null &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${(((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) + (((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) * parseFloat(local.companytax)) / 100)).toFixed(2))}</Text>}

                                        {local.adjustment_type == "" &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${(((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) + (((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) * parseFloat(local.companytax)) / 100)).toFixed(2))}</Text>}

                                        {local.adjustment_type == "addition" &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${(((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) + (((parseFloat(total) + parseFloat(local.adjustment_value || 0) - (((parseFloat(total) + parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) * parseFloat(local.companytax)) / 100)).toFixed(2))}</Text>}

                                        {local.adjustment_type == "substraction" &&
                                            <Text style={{ fontWeight: '700', color: '#4B4B4B' }}>SGD ${(((parseFloat(total) - parseFloat(local.adjustment_value || 0) - (((parseFloat(total) - parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) + (((parseFloat(total) - parseFloat(local.adjustment_value || 0) - (((parseFloat(local.option_price) - parseFloat(local.adjustment_value || 0)) * parseFloat(local.discount_value || 0)) / 100)) * parseFloat(local.companytax)) / 100)).toFixed(2))}</Text>}
                                    </View>}
                            </View>
                        </View>
                        <View>
                            {local.workstatusname == "In Progress" &&
                                <View style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'column' }}>
                                            <View style={{ flexDirection: 'row', padding: 5 }}>
                                                <Text style={{ color: '#2F2F2F', fontFamily: 'Roboto' }}>Date : </Text>
                                                <Text style={{ color: '#2F2F2F', fontFamily: 'Roboto', fontWeight: 'bold' }}>{local.expected_start_date}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', padding: 5 }}>
                                                <Text style={{ color: '#2F2F2F', fontFamily: 'Roboto' }}>Expected Start: </Text>
                                                <Text style={{ fontWeight: 'bold', color: '#2F2F2F', fontFamily: 'Roboto' }}>{Moment(local.expected_start_time, 'hh:mm a').format('hh:mm a')}</Text>
                                            </View>
                                            {local.actual_start_time >= local.expected_start_time &&
                                                <View style={{ flexDirection: 'row', padding: 5 }}>
                                                    <Text style={{ color: '#FF0000', fontFamily: 'Roboto' }}>Actual Start: </Text>
                                                    <Text style={{ color: '#FF0000', fontWeight: 'bold', fontFamily: 'Roboto' }}>{Moment(local.actual_start_time, 'hh:mm a').format('hh:mm a')}</Text>
                                                </View>}
                                            {local.actual_start_time <= local.expected_start_time &&
                                                <View style={{ flexDirection: 'row', padding: 5 }}>
                                                    <Text style={{ color: '#000', fontFamily: 'Roboto' }}>Actual Start: </Text>
                                                    <Text style={{ color: '#000', fontWeight: 'bold', fontFamily: 'Roboto' }}>{Moment(local.actual_start_time, 'hh:mm a').format('hh:mm a')}</Text>
                                                </View>}
                                        </View>
                                        <View style={{ justifyContent: 'center' }}>
                                            <TouchableOpacity style={{ backgroundColor: '#7700D4', flexDirection: 'row', paddingBottom: 5, paddingTop: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10 }} onPress={() => {
                                                // setIsStopwatchStart(!isStopwatchStart);
                                                setResetStopwatch(false);
                                                Md()
                                            }}>
                                                <Image
                                                    style={{ width: 40, height: 40 }}
                                                    source={require('../src/assets/cancel-c.png')}
                                                />
                                                <Text style={{ alignSelf: 'center', paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, color: '#fff', fontWeight: 'bold', fontSize: 20 }}>Stop</Text>

                                                <Modal
                                                    animationType={"slide"}
                                                    transparent={false}
                                                    // onPress={press(local.id)}
                                                    visible={modal}
                                                    onRequestClose={() => back()}>
                                                    <SafeAreaView style={{ flex: 1 }}>
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
                                                        <View style={{ margin: 10, flex: 0.5 }}>
                                                            <ScrollView>
                                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <Text>{option.option_name} (x1 <Text style={{ fontSize: 10 }}>Main Package</Text>)</Text>
                                                                    <Text style={{ fontWeight: 'bold' }}>{parseFloat(option.option_price).toFixed(2)}</Text>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <FlatList
                                                                        data={hoc}
                                                                        keyExtractor={(item) => item.key}
                                                                        renderItem={({ item }) =>
                                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                                <Text>{item.name} (x{item.quantity})</Text>
                                                                                <Text style={{ fontWeight: 'bold' }}>{parseFloat(item.amount).toFixed(2)}</Text>
                                                                            </View>} />
                                                                </View>
                                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <FlatList
                                                                        data={task}
                                                                        keyExtractor={(item) => item.key}
                                                                        renderItem={({ item }) =>
                                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                                <Text>{item.name} (x{item.quantity})</Text>
                                                                                <Text style={{ fontWeight: 'bold' }}>{parseFloat(item.amount).toFixed(2)}</Text>
                                                                            </View>} />
                                                                </View>
                                                            </ScrollView>
                                                        </View>


                                                        <Signature
                                                            style={{ height: 'auto', width: 'auto' }}
                                                            onEnd={handleEnd}
                                                            onOK={handleOK}
                                                            onEmpty={handleEmpty}
                                                            onClear={handleClear}
                                                            onGetData={handleData}
                                                            autoClear={true}
                                                            imageType="image/png"
                                                        />
                                                    </SafeAreaView>
                                                </Modal>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {local.executionPermission == '1' &&
                                        <View style={{ paddingTop: 15, justifyContent: 'center' }}>
                                            <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#FFBF00', padding: 15, borderRadius: 10, justifyContent: 'space-between' }} onPress={() => Imageupload()}>
                                                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', alignSelf: 'center', fontFamily: 'Roboto' }}>Take Pictures for Work Order</Text>
                                                <Image
                                                    style={{ width: 40, height: 40 }}
                                                    source={require('../src/assets/camera.png')}
                                                />
                                            </TouchableOpacity>
                                        </View>}
                                </View>}

                            {local.workstatusname == "Pending" &&
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: .5, borderBottomColor: '#CECECE' }}>
                                        <View style={{ flexDirection: 'column', padding: 5 }}>
                                            <Text style={{ color: '#7700d4', fontFamily: 'Roboto', fontWeight: 'bold' }}>Date & Time</Text>
                                            <Text style={{ color: '#2F2F2F', fontFamily: 'Roboto' }}>{local.expected_start_date}/{Moment(local.expected_start_time, 'hh:mm a').format('hh:mm a')}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'column', padding: 5 }}>
                                            <Text style={{ color: '#7700d4', fontFamily: 'Roboto', fontWeight: 'bold' }}>Contract Number</Text>
                                            {!local.contractNumber == "" &&
                                                <Text style={{ color: '#2F2F2F', fontFamily: 'Roboto' }}>{local.contractNumber}</Text>}
                                            {local.contractNumber == null &&
                                                <Text style={{ color: '#2F2F2F', fontFamily: 'Roboto', textAlign: 'center' }}>-------</Text>}
                                        </View>
                                    </View>
                                    {local.expected_start_date == today &&
                                        <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
                                            <TouchableOpacity onPress={() => {
                                                toggleAlert(!visibles)
                                                setIsStopwatchStart(!isStopwatchStart)
                                            }} style={{ backgroundColor: '#7700d4', borderRadius: 5, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                                                <Image
                                                    source={require('../src/assets/timeplay.png')}
                                                    style={{ width: 33, height: 35, alignSelf: 'center' }}
                                                />
                                                <Text style={{ alignSelf: 'center', paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, color: '#fff', fontWeight: 'bold', fontSize: 20 }}>Start</Text>
                                                <FancyAlert
                                                    visible={visibles}
                                                    icon={<View style={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: 50,
                                                        width: '100%',
                                                        backgroundColor: '#fff'
                                                    }}>
                                                        <Image
                                                            source={{ uri: logindata.company_logo }}
                                                            style={{ height: 60, width: 60, resizeMode: 'cover', borderRadius: 50 }}
                                                        />
                                                    </View>}
                                                    style={{ backgroundColor: 'white' }}
                                                ><View>
                                                        <Text style={{ fontSize: 16, fontWeight: '400' }}>Do You Want To Start Work Order</Text>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 40, paddingBottom: 20, alignContent: 'center', alignItems: 'center' }}>
                                                            <TouchableOpacity onPress={() => { timer() }}
                                                                style={{ backgroundColor: '#DEDEDE', paddingBottom: 10, paddingTop: 10, paddingLeft: 30, paddingRight: 30, borderRadius: 15 }}>
                                                                <Text style={{ fontSize: 16, fontWeight: '400' }}>Yes</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => alter()}
                                                                style={{ backgroundColor: '#DEDEDE', paddingBottom: 10, paddingTop: 10, paddingLeft: 20, paddingRight: 20, borderRadius: 15 }}>
                                                                <Text style={{ fontSize: 16, fontWeight: '400' }}>Cancel</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </FancyAlert>
                                            </TouchableOpacity>
                                            {local.executionPermission == '1' &&
                                                <TouchableOpacity onPress={() => Reschedule(!boo)}
                                                    style={{ backgroundColor: '#ffbf00', borderRadius: 5, paddingLeft: 20, paddingRight: 20, paddingTop: 5 }}>
                                                    <Image
                                                        source={require('../src/assets/time-right.png')}
                                                        style={{ width: 30, height: 35 }}
                                                    />
                                                    <Modal
                                                        animationType={"slide"}
                                                        transparent={false}
                                                        visible={boo}
                                                        onRequestClose={() => Reschedule1()}
                                                    >
                                                        <SafeAreaView style={{ flex: 1, paddingTop: 25 }}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <TouchableOpacity onPress={() => Reschedule1()} style={{ alignSelf: 'center' }}>
                                                                    <Icon name="arrow-back" size={30} color="#6F00C5" />
                                                                </TouchableOpacity>
                                                                <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10, maxWidth: '90%' }}>Reschedule for {local.customer_name}</Text>

                                                            </View>
                                                            <CalendarPicker
                                                                onDateChange={days => {
                                                                    setday(days)
                                                                    console.log('===', days)
                                                                }}
                                                                minDate={minDate}
                                                            />
                                                            <View style={{ padding: 20 }}>
                                                                <View style={{ backgroundColor: '#D3D3D3', borderRadius: 30, height: 50, paddingLeft: 15 }}>
                                                                    <SectionedMultiSelect                        // THIS PACKAGE FOR SELECT MULTIPLE MEMBERSHIP
                                                                        items={res}
                                                                        displayKey="description"
                                                                        IconRenderer={Icons}
                                                                        uniqueKey="rescheduleid"
                                                                        single={true}
                                                                        selectText="Reshedule Reason"
                                                                        searchPlaceholderText='Select Reasons'
                                                                        selectedItems={resion}
                                                                        onSelectedItemsChange={onresion}
                                                                        styles={{ selectToggle: { fontSize: 16, padding: 10 }, chipsWrapper: { padding: 10 } }}
                                                                    />
                                                                </View>
                                                            </View>
                                                            <View
                                                                style={{ justifyContent: 'center', padding: 10 }}>
                                                                <TouchableOpacity onPress={() => Reschedules()}
                                                                    style={{ borderWidth: .5, borderColor: '#343a40', margin: 5, backgroundColor: '#7700D4', borderRadius: 50, height: 50, marginTop: '30%' }}>
                                                                    <Text style={{ color: '#fff', fontSize: 16, padding: 10, textAlign: 'center', fontWeight: 'bold' }}>Reschedule</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => Reschedule1()}
                                                                    style={{ margin: 5, }}>
                                                                    <Text style={{ color: '#000', fontSize: 16, padding: 10, textAlign: 'center' }}>Back</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </SafeAreaView>
                                                    </Modal>
                                                </TouchableOpacity>}

                                            {local.executionPermission == '1' &&
                                                <TouchableOpacity onPress={() => cancelled(!can)}
                                                    style={{ backgroundColor: '#ffbf00', borderRadius: 5, paddingLeft: 20, paddingRight: 20, paddingTop: 5 }}>
                                                    <Image
                                                        source={require('../src/assets/time-cncl.png')}
                                                        style={{ width: 33, height: 36 }}
                                                    />
                                                    <Modal
                                                        animationType={"slide"}
                                                        transparent={false}
                                                        visible={can}
                                                        onRequestClose={() => cango()}
                                                    >
                                                        <SafeAreaView style={{ flex: 1, padding: 15 }}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <TouchableOpacity onPress={() => cango()} style={{ alignSelf: 'center' }}>
                                                                    <Icon name="arrow-back" size={30} color="#6F00C5" />
                                                                </TouchableOpacity>
                                                                <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10, maxWidth: '90%' }}>Cancellations for {local.customer_name}</Text>

                                                            </View>
                                                            <View style={{ paddingBottom: 10, paddingTop: 20 }}>
                                                                <View style={{ backgroundColor: '#D3D3D3', borderRadius: 30, height: 50, paddingLeft: 15 }}>
                                                                    <SectionedMultiSelect                        // THIS PACKAGE FOR SELECT MULTIPLE MEMBERSHIP
                                                                        items={cana}
                                                                        displayKey="description"
                                                                        IconRenderer={Icons}
                                                                        uniqueKey="cancelid"
                                                                        single={true}
                                                                        selectText="Cancel Reason"
                                                                        searchPlaceholderText='Select Reasons'

                                                                        selectedItems={cnlresion}
                                                                        onSelectedItemsChange={onCancel}
                                                                        styles={{ selectToggle: { fontSize: 16, padding: 10 }, chipsWrapper: { padding: 10 } }}
                                                                    />
                                                                </View>
                                                            </View>
                                                            <View style={{ justifyContent: 'center', padding: 10, height: windowHeight / 0.8 }}>
                                                                <TouchableOpacity onPress={() => Cancel()}
                                                                    style={{ borderWidth: .5, borderColor: '#343a40', margin: 5, backgroundColor: '#7700D4', borderRadius: 50, height: 50 }}>
                                                                    <Text style={{ color: '#fff', fontSize: 16, padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Submit</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => cango()}
                                                                    style={{ margin: 5, }}>
                                                                    <Text style={{ color: '#000', fontSize: 16, padding: 10, textAlign: 'center' }}>Back</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </SafeAreaView>
                                                    </Modal>
                                                </TouchableOpacity>}
                                        </View>}
                                </View>
                            }

                            {local.workstatusname == "Completed" &&
                                <View style={{ paddingTop: 15 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flexDirection: 'column' }}>
                                            <View style={{ flexDirection: 'row', padding: 5 }}>
                                                <Text style={{ color: '#2F2F2F', fontFamily: 'Roboto', fontSize: 13, textAlign: 'left' }}>Expected Start: </Text>
                                                <Text style={{ fontWeight: 'bold', color: '#2F2F2F', fontFamily: 'Roboto', fontSize: 13, textAlign: 'left' }}>{Moment(local.expected_start_time, 'hh:mm a').format('hh:mm a')}</Text>
                                            </View>
                                            {local.actual_end_time >= local.expected_start_time &&
                                                <View style={{ flexDirection: 'row', padding: 5 }}>
                                                    <Text style={{ color: '#FF0000', fontFamily: 'Roboto', fontSize: 13, textAlign: 'left' }}>Actual Start: </Text>
                                                    <Text style={{ color: '#FF0000', fontWeight: 'bold', fontFamily: 'Roboto', fontSize: 13, textAlign: 'left' }}>{Moment(local.actual_start_time, 'hh:mm a').format('hh:mm a')}</Text>
                                                </View>}
                                            {local.actual_start_time <= local.expected_start_time &&
                                                <View style={{ flexDirection: 'row', padding: 5 }}>
                                                    <Text style={{ color: '#000', fontFamily: 'Roboto', fontSize: 13, textAlign: 'left' }}>Actual Start: </Text>
                                                    <Text style={{ color: '#000', fontWeight: 'bold', fontFamily: 'Roboto', fontSize: 13, textAlign: 'left' }}>{Moment(local.actual_start_time, 'hh:mm a').format('hh:mm a')}</Text>
                                                </View>}
                                        </View>
                                        <View>
                                            <Text style={{ color: '#CECECE', textAlign: 'center' }}>|</Text>
                                            <Text style={{ color: '#CECECE', textAlign: 'center' }}>|</Text>
                                            <Text style={{ color: '#CECECE', textAlign: 'center' }}>|</Text>
                                        </View>
                                        <View style={{ flexDirection: 'column' }}>
                                            <View style={{ flexDirection: 'row', padding: 5 }}>
                                                <Text style={{ color: '#2F2F2F', fontFamily: 'Roboto', fontSize: 13, textAlign: 'right' }}>Expected Finish: </Text>
                                                <Text style={{ fontWeight: 'bold', color: '#2F2F2F', fontFamily: 'Roboto', fontSize: 13, textAlign: 'right' }}>{fixtime}</Text>
                                            </View>
                                            {ground <= fixtime &&
                                                <View style={{ flexDirection: 'row', padding: 5 }}>
                                                    <Text style={{ color: '#000', fontFamily: 'Roboto', fontSize: 13, textAlign: 'right' }}>Actual Finish: </Text>
                                                    <Text style={{ color: '#000', fontWeight: 'bold', fontFamily: 'Roboto', fontSize: 13, textAlign: 'right' }}>{ground}</Text>
                                                </View>}
                                            {ground >= fixtime &&
                                                <View style={{ flexDirection: 'row', padding: 5 }}>
                                                    <Text style={{ color: '#FF0000', fontFamily: 'Roboto', fontSize: 13, textAlign: 'right' }}>Actual Finish: </Text>
                                                    <Text style={{ color: '#FF0000', fontWeight: 'bold', fontFamily: 'Roboto', fontSize: 13, textAlign: 'right' }}>{ground}</Text>
                                                </View>}
                                        </View>
                                    </View>
                                    {/* <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: '#FFBF00', padding: 15, borderRadius: 10, justifyContent: 'space-between' }} onPress={() => Cam()}>
                                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', alignSelf: 'center' }}>Take Pictures for Work Order</Text>
                                    <Image
                                        style={{ width: 40, height: 40 }}
                                        source={require('../assets/camera.png')}
                                    />
                                </TouchableOpacity> */}
                                </View>
                            }
                        </View>

                    </View>
                ) : null}

            </View>

            <View style={{ justifyContent: 'space-between', backgroundColor: '#fff' }}>
                <FlatList
                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'space-between' }}
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

export default Orderlist