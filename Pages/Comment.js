import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Image, SafeAreaView, ScrollView, RefreshControl, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as SQLite from 'expo-sqlite'
import InternetConnectionAlert from "react-native-internet-connection-alert";
import Moment from 'moment';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from "@react-native-community/netinfo";
import axios from 'axios';
import Loading from './Loading';

const db = SQLite.openDatabase('SwifDb');


const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};


const Comment = ({ navigation }) => {

    const dispatch = useDispatch();
    const [msg, setmsg] = useState('')
    const [loading, setloading] = useState(false)
    const [local, setlocal] = useState([])
    const [workid, setworkid] = useState([])
    const [na, setname] = useState([])
    const [nam, setnam] = useState([])
    const [add, setadd] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);
    const Id = useSelector(state => state.Id)

    const [state, setState] = useState(false);
    useEffect(() => {
        // NetInfo.addEventListener(networkState => {
        //     if (networkState.isConnected == true) {
        // setState(networkState.isConnected)
        // }
        // })

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM details WHERE id=' + Id,
                [],
                (tx, result) => {
                    if (result.rows._array.length) {
                    } else {
                        navigation.navigate('Dashbaord')
                    }
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';",
                [],
                (tx, results) => {
                    console.log({ results });
                    // return
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM comment WHERE workorder_id=' + Id,
                [],
                (tx, result) => {
                    console.log("comment", JSON.stringify(result));
                    comm(result.rows._array)
                    console.error("comment", JSON.stringify(result));
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                [],
                (tx, results) => {
                    console.log("USER:", JSON.stringify(results));
                    setting1(results.rows._array)
                }
            );
        });

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM hell WHERE hellid=' + Id,
                [],
                (tx, result) => {
                    console.warn("hell:" + JSON.stringify(result));
                    setting(result.rows._array)
                }
            );
        });

        // db.transaction((tx) => {
        //     tx.executeSql(
        //         'SELECT * FROM details WHERE id=' + Id,
        //         [],
        //         (tx, result) => {
        //             console.error("details", result);
        //             setting(result.rows._array)
        //         }
        //     );
        // });

        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh();
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';",
                    [],
                    (tx, results) => {
                        console.log({ results });
                        // return
                    }
                );
            });

            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM comment WHERE workorder_id=' + Id,
                    [],
                    (tx, result) => {
                        console.log("comment", JSON.stringify(result));
                        comm(result.rows._array)
                        console.error("comment", JSON.stringify(result));
                    }
                );
            });

            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                    [],
                    (tx, results) => {
                        console.log("USER:", JSON.stringify(results));
                        setting1(results.rows._array)
                    }
                );
            });

            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM hell WHERE hellid=' + Id,
                    [],
                    (tx, result) => {
                        console.warn("hell:" + JSON.stringify(result));
                        setting(result.rows._array)
                    }
                );
            });
        });
        return unsubscribe;



    }, [])

    const comm = (val) => {
        setlocal(val)
        console.log('booooo', val);

    }
    const setting1 = (value) => {
        setworkid(value)
        console.log(value);
    }
    const setting = (val) => {
        setname(val)
        setnam(val[0].hellid)
        setadd(val[0].customer_address)
        console.log("udgef", val[0].hellid);
    }

    const Messagelist = () => {
        var time = new Date()
        var workorderid = nam
        var workerid = workid[0].userid
        var name = workid[0].username
        console.log('booooo', workorderid, time, workerid, msg, name);

        db.transaction(function (tx) {
            tx.executeSql(
                "INSERT INTO comment (comment_id, commenter_type, commenter, commenter_id, description, workorder_id, created, Modification) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [0, 'Worker', name, workerid, msg, Id, "" + time + "", 1],
                (tx, results) => {
                    setmsg('')
                    // Request()
                    onRefresh();
                }
            )
        })
    }

    const onRefresh = React.useCallback(() => {
        setloading(true)
        Request();
        setTimeout(() => {
            setloading(false)
        }, 3000);
        setRefreshing(true);
        wait(3000).then(() => {
            setRefreshing(false)
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM comment WHERE workorder_id=' + Id,
                    [],
                    (tx, result) => {
                        console.log("comment", JSON.stringify(result));
                        comm(result.rows._array)
                        console.error("comment", JSON.stringify(result));
                    }
                );
            });
        });
    })

    const [temp, settemp] = useState('');
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
                                console.warn("HELL", JSON.stringify(result.rows._array));
                                db.transaction((txp) => {
                                    txp.executeSql(
                                        "SELECT commenter_id AS worker_id, workorder_id AS workorderId, description FROM comment WHERE Modification=1",
                                        [],
                                        (tx, result1) => {
                                            // console.warn("Comment: ", result1.rows._array);

                                            db.transaction((txi) => {
                                                txi.executeSql(
                                                    "SELECT id, workorderid AS workorderId, quantity, amount, checked FROM task WHERE Modification='1'",
                                                    [],
                                                    (tx, result2) => {
                                                        console.warn("task: ", result2.rows._array);
                                                        db.transaction((txl) => {
                                                            txl.executeSql(
                                                                "SELECT id AS item_id, category_id, workorderid AS workorderId, quantity, amount AS price FROM adhocitems WHERE Modification='1'",
                                                                [],
                                                                (tx, result3) => {
                                                                    // alert("yo")
                                                                    // alert("uoooo")

                                                                    db.transaction((txz) => {
                                                                        txz.executeSql(
                                                                            'SELECT hellid AS ID, workstatus AS status, reasonid AS reason, date FROM hell WHERE Modification=1 AND reasonid !=0 AND status IN (4,5)',
                                                                            [],
                                                                            (tx, result6) => {
                                                                                console.error(result6);

                                                                                let bodyFormData = { 'workorder': JSON.stringify(result.rows._array), 'task': JSON.stringify(result2.rows._array), 'addhoc': JSON.stringify(result3.rows._array), 'comment': JSON.stringify(result1.rows._array), 'WorkorderImage': "[]", 'lastUpdatationDate': null, 'requests': JSON.stringify(result6.rows._array) }
                                                                                console.log({ bodyFormData });

                                                                                axios({
                                                                                    method: 'POST',
                                                                                    url: 'https://swif.cloud/api/swif-sink',
                                                                                    data: bodyFormData,
                                                                                    headers: { 'Content-Type': 'multipart/form-data', 'Authorization': token }
                                                                                }).then(({ data, status }) => {
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
                                                                                        alert(JSON.stringify(error.response.data))
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
        // console.log({"insert":allData.list});
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
            if (item.ad_hoc_items.length) {
                item.ad_hoc_items.forEach(ele => {
                    db.transaction((ct31) => {
                        ct31.executeSql(
                            'INSERT INTO adhocitems (id, amount, checked, item, name, quantity, remarks, workorderid, Modification, category_id) VALUES (?, ?, ?, ?, ?, ? ,?, ?, ?, ?)',
                            [ele.id, ele.amount / ele.quantity, ele.checked, ele.item, ele.name, ele.quantity, ele.remarks, item.id, 0, ele.category_id],
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
                            [item.id, item.amount, item.amount / item.quantity, item.checked, item.item, item.name, item.quantity, item.remarks, detail.id, 0, item.custom],
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', }}>
            {loading ? <Loading showloading={loading} /> : null}
            <View style={{ flex: 1, paddingTop: 50 }}>
                <View style={{ flexDirection: 'row', paddingTop: 15, paddingBottom: 10, alignItems: 'center', backgroundColor: '#fff' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignSelf: 'center' }}>
                        <Icon name="arrow-back" size={30} color="#6F00C5" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, color: '#6F00C5', paddingLeft: 15, fontFamily: 'Roboto' }}>Remarks for Works Order at</Text>
                </View>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingBottom: 10 }}>
                    <Image
                        style={{ width: 35, height: 35 }}
                        source={require('../src/assets/House.png')}
                    />
                    <Text style={{ textAlign: 'left', paddingLeft: 2, fontSize: 14, fontFamily: 'Roboto', maxWidth: '90%', lineHeight: 20, alignSelf: 'center', fontWeight: 'bold' }}>{nam}: </Text>
                    <Text style={{ textAlign: 'left', paddingLeft: 2, fontSize: 14, fontFamily: 'Roboto', maxWidth: '90%', lineHeight: 20, alignSelf: 'center', }}>{add}</Text>
                </View>
                <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    <View style={{ margin: 5, backgroundColor: '#F0F0F0', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: '145%' }}>
                        <FlatList
                            data={local}
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
                        <TouchableOpacity
                            onPress={() => Messagelist()}
                            style={{ alignSelf: 'center', alignItems: 'center', }}>
                            <Image
                                style={{ width: 67, height: 67, resizeMode: 'cover' }}
                                source={require('../src/assets/send_icon.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}


export default Comment