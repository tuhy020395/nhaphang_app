/**
 *
 * @format
 * 
 */
import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, Image, 
    SafeAreaView, ImageBackground, Dimensions, ActivityIndicator, StatusBar, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Communications from 'react-native-communications';
import { DrawerItemList, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Menu, Button, Avatar } from '@ui-kitten/components';
import MenuView from '~/components/Sidemenu';
import UserMenuView from '~/components/UserInfoSidemenu';
import { color, settings} from '~/config';
import {AuthContext} from '~/context/AuthController';
import {getMenu} from '~/api/AccountHandler';
import { NavContext } from '~/context/NavController'

const wW = Dimensions.get('window').width;
const wH = Dimensions.get('window').height;

const CustomDrawerContentComponent = props => {
    const {signOut, state: authState } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const [menu, setMenu] = React.useState("");
    const [accountData, setAccountData] = React.useState("");


    React.useEffect(() => {
        getInitData();
    }, []);
    React.useEffect(() => {
        !!authState.userToken && getUserData();
        
    }, [authState]);
    getInitData = async () => {
        
        await getUserData();
        await getlistLink();
    }
    getUserData = async () => {
        let dataItem = '';
        try {
            dataItem =  await AsyncStorage.getItem("userData");
            dataItem = JSON.parse(dataItem);    
        } catch (error) {
            console.log('getUserData fail', error)
        }
        setAccountData(dataItem);
    }
    getlistLink = async () => {
        let userInfoItem = accountData;
        try {
         
            !!userInfoItem ?  userInfoItem = userInfoItem : userInfoItem = {ID: 0}; 

            const res = await getMenu({UID: userInfoItem.ID});
            if(res.Code == "102"){
                setMenu(res?.ListMenu);
                // settings.webViewHomeURL = String(res?.ListMenu[0].Link).split('?')[0]
            } else {
                Alert.alert('Thông báo',JSON.stringify(res));
           
            }
        } catch (error) {
            console.log('getlistLink', error)
            Alert.alert('Thông báo',JSON.stringify(error));
        }
        
        
        // setlistData(data);
    } 
    _signOutAsync = () => {
        signOut();

    };
    _signInAsync = () => {
        navigation.navigate('AuthScreen', {isRoot: true});
    }
    _signUpAsync = () => {
        navigation.navigate('RegisterQuick', {isRoot: true});
    }
    
    return (<SafeAreaView style={[styles.container, {}]}>
        <View style={styles.fixedTopContent}> 
                {!authState.userToken ? <>
                    <TouchableOpacity 
                            style={[styles.drawerBtn, {backgroundColor: color.primary}]} 
                            onPress={_signInAsync}
                        >
                            <Text style={[styles.btnLabel]}>Đăng nhập</Text>
                    </TouchableOpacity>
                    
                    <Text style={[styles.text,{textAlign: "center", paddingVertical: 15}]}>Hoặc</Text>
                
                    <TouchableOpacity 
                            style={[styles.drawerBtn, {backgroundColor: "transparent"}]} 
                            onPress={_signUpAsync}
                        >
                            <Text style={[styles.btnLabel, {color: color.primary}]}>Đăng Ký tài khoản</Text>
                    </TouchableOpacity>
                </> : (!!accountData && <UserMenuView data={accountData} />)}
            </View>
            <View style={[{ flexGrow: 1, position: "relative"}]}>
                <ScrollView style={[StyleSheet.absoluteFill, {backgroundColor: "#333",}]}>
                    { menu.length > 0 ?  <MenuView data={menu}/> : <ActivityIndicator size="small" color={color.primary} />}
                </ScrollView>
            </View>
            {authState.userToken && <View style={styles.fixedBottomContent}>
                <TouchableOpacity 
                        style={[styles.drawerBtn, {backgroundColor: "#d72126", borderRadius: 8}]} 
                        onPress={_signOutAsync}
                    >
                        <Text style={[styles.btnLabel]}>Thoát</Text>
                </TouchableOpacity>
            </View> } 
        
        {/* <View style={{height: 1, backgroundColor: "#e1e1e1", flexGrow: 1}}></View> */}
    </SafeAreaView>)
};
export default CustomDrawerContentComponent;




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.dark
    },
    fixedTopContent: {

    },
    fixedBottomContent: {
        padding: 5
    },
    text: {
        color: '#fff'
    },
    menu:{
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#333"
    },
    isActive: {
        backgroundColor: color.primary,
    },
    menuText: {
        color: "#fff",
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 20,
        padding: 15,
        paddingLeft: 5,
        flexGrow: 1
    },
    menuIcon:{
        height: 25,
        width: 40,
        
    },
    Submenu: {
        backgroundColor: "#232122"
    },
    submenuItem: {
        paddingLeft: 40
    },
    submenuText: {
        textTransform: "none",
        color: "#b7b7b7",
        

    },
    drawerBtn: {
        // borderRadius: 50,
        height: 50,
        lineHeight: 20,
        paddingHorizontal: 15,
        paddingVertical: 5, 
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e1e1e1",
    },
    btnLabel: {
        color: "#fff",
        fontWeight: "bold",
        textTransform: "uppercase"
    }
});