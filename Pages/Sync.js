import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from 'expo-sqlite';
import axios from 'axios';

const db = SQLite.openDatabase('SwifDb');


const Sync = () => {

    module.exports = function () {
        alert("sync working");
        NetInfo.addEventListener(networkState => {
            if (networkState.isConnected) {
                db.transaction((tx) => {
                    tx.executeSql(
                        'SELECT * FROM user ORDER BY id DESC LIMIT 1',
                        [],
                        (tx, results) => {
                            let token = results.rows._array[0].token;
                            // alert("token get it" + token)
                            // console.log("USER:", JSON.stringify(results))
                            let bodyFormData = { 'workorder': "[]", 'task': "[]", 'addhoc': "[]", 'comment': "[]", 'WorkorderImage': "[]", 'lastUpdatationDate': null }
                            axios({
                                method: 'POST',
                                url: 'https://swif.cloud/api/swif-sink',
                                data: bodyFormData,
                                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': token }
                            }).then(({ data, status }) => {
                                DETAIL(data.details);
                                HELL(data.list);
                                USER(data.worker);
                                CNL(data.CancelReason);
                                RES(data.resheduleReason);
                                ADHOC(data.item);
                                TASK(data.details);
                                ADHOCITEM(data.details);
                                COMMENT(data.comment);
                            }).catch(error => {
                                console.log("boooooooooooooooo", error.response.data);
                            })
                        }
                    );
                });
            }
        })
        setTimeout(() => {
            alert("sync Ends");
        }, 2500);
    }
    const USER = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='user'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS user', []);
                        txn.executeSql(
                            "CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT,userid INT(9) NOT NULL, name VARCHAR(30) NOT NULL, contact INT(15) NOT NULL,username VARCHAR(25) NOT NULL, address VARCHAR(85) NOT NULL, company_logo VARCHAR(55) NOT NULL, email VARCHAR(25) NOT NULL, gender VARCHAR(25) NOT NULL, profile_image VARCHAR(55) NOT NULL, token VARCHAR(200) NOT NULL, Modification INT(5) NOT NULL)",
                            [],
                        );
                    }
                    setupdate("User Table created")
                    insertData(data)
                }
            );
        })
    }

    const HELL = (data) => {
        db.transaction(function (txn) {
            txn.executeSql('DROP TABLE IF EXISTS hell', []);
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='hell'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql(
                            "CREATE TABLE hell (hellid INT(9) NOT NULL, customer_contact_number VARCHAR(255) NOT NULL, block VARCHAR(85), contractNumber VARCHAR(255),country VARCHAR(25), customer_address TEXT, customer_name VARCHAR(255), option_name TEXT, option_price INT(12), service_name TEXT, street VARCHAR(50), unit VARCHAR(20), workstatus INT(5), workstatusname VARCHAR(20), zip INT(9), zone VARCHAR(50), type INT(9), reasonid INT(9), date VARCHAR(50), Modification INT(5),expected_start_date VARCHAR(50), expected_start_time VARCHAR(50), expected_end_time VARCHAR(50), actual_start_date VARCHAR(50), actual_start_time VARCHAR(50),actual_end_time VARCHAR(50), signature VARCHAR(255))",
                            [],
                        );
                    }
                    // alert("CREATE TABLE workorder (id INTEGER PRIMARY KEY AUTOINCREMENT,workorderid INT(9) NOT NULL, actual_end_time VARCHAR(50) NOT NULL, customer_contact_number VARCHAR(255) NOT NULL,actual_start_time VARCHAR(50) NOT NULL, block VARCHAR(85) NOT NULL, contractNumber VARCHAR(255) IS NULL, country VARCHAR(25) NOT NULL, customer_address VARCHAR(255) NOT NULL, customer_name VARCHAR(255) NOT NULL, expected_start_time VARCHAR(50) NOT NULL, option_name VARCHAR(255) NOT NULL, option_price INT(12) NOT NULL, service_name VARCHAR(255) NOT NULL, start_date VARCHAR(50) NOT NULL, street VARCHAR(50) NOT NULL, unit VARCHAR(20) NOT NULL, workstatus INT(5) NOT NULL, workstatusname VARCHAR(20) NOT NULL, zip INT(9) NOT NULL, zone VARCHAR(50) NOT NULL, Modification INT(5) NOT NULL)")

                    data.forEach(element => {

                        console.log('====================================');
                        console.log(element);
                        console.log('====================================');
                        if (element.contractNumber) {
                            console.log(element.contractNumber);
                            db.transaction(function (tx) {
                                tx.executeSql(
                                    'INSERT INTO hell (hellid, customer_contact_number, block, contractNumber, country, customer_address, customer_name, option_name, option_price, service_name, street, unit, workstatus, workstatusname, zip, zone, type, reasonid, date, Modification,expected_start_date,expected_start_time,expected_end_time,actual_start_date,actual_start_time,actual_end_time,signature) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                    [element.id, element.customer_contact_number, element.block, element.contractNumber, element.country, element.customer_address, element.customer_name, element.option_name, element.option_price, element.service_name, element.street, element.unit, element.workstatus, element.workstatusname, element.zip, element.zone, 0, 0, "null", 0, "" + element.start_date + "", "" + element.actual_start_time + "", "" + element.actual_end_time + "", "null", "null", "null", "null"],
                                    (tx, results) => {
                                        console.log(results);
                                        // alert("boo")
                                        db.transaction((tx) => {
                                            tx.executeSql(
                                                'SELECT * FROM hell',
                                                [],
                                                (tx, result) => {
                                                    console.log("hell:" + JSON.stringify(result));
                                                }
                                            );
                                        });
                                    }
                                );
                            });
                        } else {
                            console.log("booo");
                            db.transaction(function (tx) {
                                tx.executeSql(
                                    'INSERT INTO hell (hellid, customer_contact_number, block, contractNumber, country, customer_address, customer_name, option_name, option_price, service_name, street, unit, workstatus, workstatusname, zip, zone, type, reasonid, date, Modification,expected_start_date,expected_start_time,expected_end_time,actual_start_date,actual_start_time,actual_end_time,signature) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                    [element.id, element.customer_contact_number, element.block, 'null', element.country, element.customer_address, element.customer_name, element.option_name, element.option_price, element.service_name, element.street, element.unit, element.workstatus, element.workstatusname, element.zip, element.zone, 0, 0, "null", 0, "" + element.start_date + "", "" + element.actual_start_time + "", "" + element.actual_end_time + "", "null", "null", "null", "null"],
                                    (tx, results) => {
                                        console.log(results);
                                        // alert("boo")
                                        db.transaction((tx) => {
                                            tx.executeSql(
                                                'SELECT * FROM hell',
                                                [],
                                                (tx, result) => {
                                                    console.log("hell:" + JSON.stringify(result));
                                                }
                                            );
                                        });
                                    }
                                );
                            });
                        }
                        return;
                        console.log(element.actual_end_time);

                    });
                    // setupdate("hell Table created")
                    // insertData(Db.worker)
                }
            );
        })
    }

    const CNL = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='cancel'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS cancel', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS cancel (id INTEGER PRIMARY KEY AUTOINCREMENT, cancelid INT(9) NOT NULL, company_id INT(9) NOT NULL,description VARCHAR(250) NOT NULL, title VARCHAR(250) NOT NULL, Modification INTEGER DEFAULT 0 NOT NULL)',
                            []
                        );
                    }
                    setTimeout(() => {
                        setupdate("Cancel Table created")
                    }, 4000)
                    cancelData(data)
                }
            );
        })
    }

    const RES = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='reschedule'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS reschedule', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS reschedule (id INTEGER PRIMARY KEY AUTOINCREMENT, rescheduleid INT(9) NOT NULL, company_id INT(9) NOT NULL,description VARCHAR(250) NOT NULL, title VARCHAR(250) NOT NULL, Modification INTEGER DEFAULT 0 NOT NULL)',
                            []
                        );
                    }
                    setTimeout(() => {
                        setupdate("Reschedule Table created")
                    }, 6000)
                    reschedulData(data)
                }
            );
        })
    }

    const ADHOC = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='item'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS item', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS item (id INT(9), category_id INT(12), price INT(15), name VARCHAR(255))',
                            []
                        );
                    }
                    data.forEach(element => {

                        db.transaction(function (tx) {
                            tx.executeSql(
                                'INSERT INTO item (id, category_id, price, name) VALUES (?, ?, ?, ?)',
                                [element.id, element.category_id, element.price, element.name],
                                (tx, results) => {
                                    db.transaction((tx) => {
                                        tx.executeSql(
                                            'SELECT * FROM item',
                                            [],
                                            (tx, result) => {
                                                console.log("adhoc", JSON.stringify(result));
                                            }
                                        );
                                    });
                                }
                            );
                        });
                    });
                    // adhocData()
                    // adhocData(Db.item)
                }
            );
        })
    }

    const TASK = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='task'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS task', []);
                        txn.executeSql(
                            "CREATE TABLE task (id INT(9), amount INT(15),price INT(15), checked VARCHAR(50), item VARCHAR(255), name VARCHAR(255), quantity INT(15), remarks VARCHAR(255), workorderid INT(12))",
                            [],
                        );
                    }
                    data.forEach(element => {
                        if (element.task_list.length > 0) {

                            element.task_list.forEach(ele => {

                                db.transaction(function (tx) {
                                    tx.executeSql(
                                        'INSERT INTO task (id, amount,price, checked, item, name, quantity, remarks, workorderid) VALUES (?, ?, ?, ?, ?, ? ,?, ?, ?)',
                                        [ele.id, ele.amount, ele.amount, ele.checked, ele.item, ele.name, ele.quantity, ele.remarks, element.id],
                                        (tx, results) => {
                                            db.transaction((tx) => {
                                                tx.executeSql(
                                                    'SELECT * FROM task',
                                                    [],
                                                    (tx, result) => {
                                                        console.warn("task", JSON.stringify(result));
                                                    }
                                                );
                                            });
                                        }
                                    );
                                });
                            });
                        }
                    });
                }
            );
        })
    }

    const ADHOCITEM = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='adhocitems'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS adhocitems', []);
                        txn.executeSql(
                            "CREATE TABLE adhocitems (id INT(9), amount INT(15), checked INT(5), item VARCHAR(255), name VARCHAR(255), quantity INT(15), remarks VARCHAR(255), workorderid INT(12))",
                            [],
                        );
                    }
                    data.forEach(element => {
                        if (element.ad_hoc_items.length > 0) {

                            element.ad_hoc_items.forEach(ele => {

                                db.transaction(function (tx) {
                                    tx.executeSql(
                                        'INSERT INTO adhocitems (id, amount, checked, item, name, quantity, remarks, workorderid) VALUES (?, ?, ?, ?, ?, ? ,?, ?)',
                                        [ele.id, ele.amount, ele.checked, ele.item, ele.name, ele.quantity, ele.remarks, element.id],
                                        (tx, results) => {
                                            db.transaction((tx) => {
                                                tx.executeSql(
                                                    'SELECT * FROM adhocitems',
                                                    [],
                                                    (tx, result) => {
                                                        console.warn("adhocitems", JSON.stringify(result));
                                                    }
                                                );
                                            });
                                        }
                                    );
                                });
                            });
                        }
                    });
                }
            );
        })
    }

    const DETAIL = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='details'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS details', []);
                        txn.executeSql(
                            "CREATE TABLE details (id INT(15), adjustment_type VARCHAR(50), adjustment_value VARCHAR(50), block VARCHAR(50), companytax INT(15), contractNumber VARCHAR(50), customer_contact_number INT(15), customer_name VARCHAR(255), discount_type VARCHAR(50), discount_value VARCHAR(50), option_name VARCHAR(50), option_price INT(15), service_id INT(15), service_name VARCHAR(255), status INT(15),  street VARCHAR(50), unit VARCHAR(50), workstatusname VARCHAR(50), zip INT(15), zone VARCHAR(50), ad_hoc_catid VARCHAR(255), ad_hoc_items VARCHAR(255), gallery VARCHAR(255), task_list VARCHAR(255), workordercommentlist VARCHAR(255), type INT(9), reasonid INT(9), date VARCHAR(50),expected_start_time VARCHAR(50), expected_end_time VARCHAR(50), actual_start_time VARCHAR(50),actual_end_time VARCHAR(50), expected_start_date VARCHAR(50))",
                            [],
                        );
                    }
                    data.forEach(element => {
                        db.transaction(function (tx) {
                            tx.executeSql(
                                'INSERT INTO details (id, adjustment_type, adjustment_value, block, companytax, contractNumber, customer_contact_number, customer_name, discount_type, discount_value, option_name, option_price, service_id, service_name, status, street, unit, workstatusname, zip, zone, ad_hoc_catid, gallery, task_list, workordercommentlist, type, reasonid, date, expected_start_time, expected_end_time, actual_start_time, actual_end_time,expected_start_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                [element.id, element.adjustment_type, element.adjustment_value, element.block, element.companytax, element.contractNumber, element.customer_contact_number, element.customer_name, element.discount_type, element.discount_value, element.option_name, element.option_price, element.service_id, element.service_name, element.status, element.street, element.unit, element.workstatusname, element.zip, element.zone, JSON.stringify(element.ad_hoc_items), JSON.stringify(element.gallery), JSON.stringify(element.task_list), JSON.stringify(element.workordercommentlist), 0, 0, "null", "" + element.actual_start_time + "", "" + element.actual_end_time + "", "null", "null", "" + element.start_date + ""],
                                (tx, results) => {
                                    db.transaction((tx) => {
                                        tx.executeSql(
                                            'SELECT * FROM details',
                                            [],
                                            (tx, result) => {
                                                console.error("details", JSON.stringify(result));
                                            }
                                        );
                                    });
                                }
                            );
                        });
                    });
                }
            );
        })
    }

    const COMMENT = (data) => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='comment'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS comment', []);
                        txn.executeSql(
                            "CREATE TABLE comment (id INTEGER PRIMARY KEY AUTOINCREMENT, comment_id INT(11), commenter_type VARCHAR(25), commenter VARCHAR(25), commenter_id INT(11), description TEXT, workorder_id INT(15), created TEXT)",
                            [],
                        );
                    }
                    data.forEach(element => {
                        element.forEach(ele => {
                            db.transaction(function (tx) {
                                tx.executeSql(
                                    "INSERT INTO comment (comment_id, commenter_type, commenter, commenter_id, description, workorder_id, created) VALUES (?, ?, ?, ?, ?, ?, ?)",
                                    [ele.id, ele.commenter_type, ele.commenter, ele.commenter_id, ele.description, ele.workorder_id, ele.created],
                                    (tx, results) => {
                                        db.transaction((tx) => {
                                            tx.executeSql(
                                                'SELECT * FROM comment',
                                                [],
                                                (tx, result) => {
                                                    console.error("comment", JSON.stringify(result));
                                                }
                                            );
                                        });
                                    }
                                )
                            })
                        });

                    });
                }
            );
        })
    }


    const insertData = (response) => {
        // console.log(response);
        if (response) {

            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO user (userid, name, contact, username, address, company_logo, email, gender, profile_image, token,Modification) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                    [response.id, response.name, response.contact, response.username, response.address, response.company_logo, response.email, response.gender, response.profile_image, response.token, 0],
                    (tx, results) => {
                        // console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            setTimeout(() => {
                                setupdate("User Data inserted")
                            }, 10000)
                            // alert('User Data Inserted Successfully....');
                        } else {
                            alert('User Data Failed....');
                            navigation.navigate('FirstPage')
                        }
                    }
                );
            });

            viewUser();
        }

    }



    const statusData = (value) => {
        value.forEach(element => {
            // console.log(element);
            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO status (id, name) VALUES (?,?)',
                    [element.id, element.name],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            setTimeout(() => {
                                setupdate("Status Data inserted")
                            }, 16000)
                            // alert('Work Order Staus Inserted Successfully....');
                        } else {
                            alert('Failed....');
                            navigation.navigate('FirstPage')
                        }
                    }
                );
            });
        });
        statusWO();
    }



    const cancelData = (can) => {
        can.forEach(element => {

            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO cancel (cancelid, company_id, description, title) VALUES (?,?,?,?)',
                    [element.id, element.company_id, element.description, element.title],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            setTimeout(() => {
                                setupdate("Cancel Data inserted")
                            }, 18000)
                            // alert('Cancel Resaon Data Inserted Successfully....');
                        } else {
                            alert('Failed....');
                            navigation.navigate('FirstPage')
                        }
                    }
                );
            });
        });
        cancelView();

    }


    const reschedulData = (reschedul) => {
        reschedul.forEach(element => {
            console.log(element);

            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO reschedule (rescheduleid, company_id, description, title) VALUES (?,?,?,?)',
                    [element.id, element.company_id, element.description, element.title],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            setTimeout(() => {
                                setupdate("Reschedule Data inserted")
                            }, 20000)
                            // alert('Reschedule Data Inserted Successfully....');
                        } else {
                            alert('Failed....');
                            navigation.navigate('FirstPage')
                        }
                    }
                );
            });
        })
        reschedulView();

    }

    const viewUser = () => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM user',
                [],
                (tx, results) => {
                    console.warn("USER:" + JSON.stringify(results));
                }
            );
        });
    }
    const statusWO = () => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM status',
                [],
                (tx, results) => {
                    console.log("Status:" + JSON.stringify(results));
                }
            );
        });
    }

    const cancelView = () => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM cancel',
                [],
                (tx, results) => {
                    console.log("canel" + JSON.stringify(results));
                }
            );
        });

    }

    const reschedulView = () => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM reschedule   ',
                [],
                (tx, results) => {
                    console.log("reschedule" + JSON.stringify(results));
                }
            );
        });

    }



    return (
        <View>

        </View>
    )
}

export default Sync