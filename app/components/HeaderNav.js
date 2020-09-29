import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View, RefreshControl, Text, 
    SafeAreaView, Image, ActivityIndicator, Alert, Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Layout, Button, Avatar, TopNavigation } from '@ui-kitten/components';
import { getAppMeta } from '~/api/AccountHandler';
import {AuthContext} from '~/context/AuthController';
import { NavContext } from '~/context/NavController';
import Icon from 'react-native-vector-icons/FontAwesome';
import Utils from '~/utils';
import {getAppConfigs} from '~/api/AccountHandler';

import {settings, webViewRoot} from '~/config';

const HeaderApp = props =>  {
    const {signOut, state: authState} = React.useContext(AuthContext);
    
    const navigation = useNavigation();
    const route = useRoute();
    const {scene, previous} = props;
    
    const [metaData, setMetadData] = useState('');
    const [isOrderActive, setOrderActive] = useState(false);
    React.useEffect(() => {
        getData()
        checkMenurender();
    }, [authState]);

    React.useEffect(() => {
        console.log('previous', previous);
    }, [route]);
    
    const checkMenurender = async () => {
        try {
            const rs = await getAppConfigs();
            if(!!rs.data){
                setOrderActive(rs.data.IsOrderActive);
            }
            

        } catch (error) {
            
        }
    }
    getData = async () =>{
        try {
            const res = await getAppMeta();
          
            if(res.Logout){
                signOut();
                throw 'logout'
            }
            if(res === '') {
                
            }
            if(res.Code == '102'){
                //res.Info đã login
                //chưa login thì ko có key info
                setMetadData(res.Info || res)
                settings.globalPrice = metaData.Currency;
            } else {
                console.log(res);
                Alert.alert('Thông báo',res)
            }

        } catch (error) {
         
            if(!error === "logout") Alert.alert('Thông báo', error);
            ;
        }
    }


    return <View style={styles.wrap}>
        <SafeAreaView  />
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                {previous ?  <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
                    <Text style={[styles.text, {fontSize: 18}]}><Icon name="chevron-left" /></Text>
                </TouchableOpacity> : <TouchableOpacity style={styles.btn} onPress={() => navigation.toggleDrawer()}>
                    <Image style={{width: 25, height: 20}} source={require('~/assets/ic-menu.png')} />
                </TouchableOpacity>} 
            </View>
            {/* <View style={styles.centerContainer}>
                <Text></Text>
            </View> */}
            <View style={[styles.rightContainer]}>
                <View style={[ styles.navItem ,{flexDirection: "row", alignItems: "center"}]}>
                    {metaData.Currency ? <>
                        <Image source={require('~/assets/ic-yen.png')} style={{width: 18, height: 18}} />
                        <Text style={[styles.text, {marginLeft: 3}]}>{Utils.addCommas(metaData.Currency)}</Text>
                    </> : <ActivityIndicator />}
                </View>
                <View style={[styles.navItem]}>
                    <TouchableOpacity style={styles.btn} onPress={() => {}}>
                        <Image source={require('~/assets/ic-taobao-circle.png')} style={{width: 18, height: 18}} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.navItem]}>
                    <TouchableOpacity style={styles.btn} onPress={() => {}}>
                        <Image source={require('~/assets/ic-cart.png')} style={{width: 18, height: 18}} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.navItem]}>
                    <TouchableOpacity style={styles.btn} onPress={() => {}}>
                        <Image source={require('~/assets/ic-bell.png')} style={{width: 18, height: 18}} />
                    </TouchableOpacity> 
                    
                </View>
            </View>
        </View>
        
    </View>
}
export default HeaderApp;

export const DrawerToggleBtn = props => {
    const navigation = useNavigation();
    return <TouchableOpacity style={[styles.btn, {paddingLeft: 10}]} onPress={() => navigation.toggleDrawer()}>
        <Image style={{width: 25, height: 20}} source={require('~/assets/ic-menu.png')} />
    </TouchableOpacity>
}
export const HeaderBackImage = props => {
    const navigation = useNavigation();
    return <TouchableOpacity style={[styles.btn]} onPress={() => navigation.goBack()}>
        <Text style={[styles.text, {fontSize: 32}]}><Icon name="angle-left" size={32} /></Text>
    </TouchableOpacity>
}
export const HeaderRight = props => {
    const {signOut, state: authState} = React.useContext(AuthContext);
    const {setState: setMenuState} = React.useContext(NavContext);
    const navigation = useNavigation();
    const route = useRoute();
    const {scene, previous} = props;
    
    const [metaData, setMetadData] = useState('');
    const [isOrderActive, setOrderActive] = useState(false);
    React.useEffect(() => {
        headerContex.getData()
        headerContex.checkMenurender();
    }, [/*authState*/]);

    // React.useEffect(() => {
    //     console.log('previous', previous);
        
    // }, [route]);
   
    const headerContex = React.useMemo(() => ({
        getData: async () =>{
            try {
                const res = await getAppMeta();
               
                if(res.Logout){
                    signOut();
                    throw 'logout'
                }
                if(res === '') {
                    
                }
                if(res.Code == '102'){
                    //res.Info đã login
                    //chưa login thì ko có key info
                    setMetadData(res.Info || res)
                } else {
                    console.log(res);
                    Alert.alert('Thông báo',res)
                }
    
            } catch (error) {
                if(!error === "logout") Alert.alert('Thông báo',error);
            }
        },
        checkMenurender: async () =>{
            if(Platform.OS === "android"){
                setOrderActive(true);
            } else {
                try {
                    const rs = await getAppConfigs();
                    if(!!rs.data){
                        setOrderActive(rs.data.IsOrderActive);
                    }
                    
        
                } catch (error) {
                    
                }
            }
            
        }
    }), [route] );
    
    return <View style={[styles.rightContainer]}>
        <View style={[ styles.navItem ,{flexDirection: "row", alignItems: "center"}]}>
            {metaData.Currency ? <>
                <Image source={require('~/assets/ic-yen.png')} style={{width: 18, height: 18}} />
                <Text style={[styles.text, {marginLeft: 3}]}>{Utils.addCommas(metaData.Currency)}</Text>
            </> : <ActivityIndicator />}
        </View>
        <View style={[styles.navItem]}>
            <TouchableOpacity style={styles.btn} onPress={() => {
                
                if(route && route.name !== 'Dashboard'){
                    navigation.navigate('Dashboard',{from: 'header'})
                } else {
                    const {userID, userToken} = authState;
                    let searchURL = '?UID=0&Key=';
                    if(userToken){
                        searchURL = `?UID=${ userID }&Key=${ userToken }`
                    }
                    
                    setMenuState({echoURL: `${ settings.webViewHomeURL }${searchURL}`, action: 'webview'})
                }
            }}>
                <Image source={require('~/assets/icon-home.png')} style={{width: 18, height: 18}} />
            </TouchableOpacity>
        </View>
        {isOrderActive && <View style={[styles.navItem]}>
            <TouchableOpacity style={styles.btn} onPress={() => {

                // navigation.navigate('CartScreen',{from: 'header'})
                navigation.navigate('CartScreen',{
                    screen: 'CartList',
                    params: { from: 'header' }
                })
            }}>
                <Image source={require('~/assets/ic-cart.png')} style={{width: 18, height: 18}} />
            </TouchableOpacity>
        </View>}
        <View style={[styles.navItem]}>
            <TouchableOpacity style={styles.btn} onPress={() => {
                if(authState.userToken){
                    navigation.navigate('NotiScreen',{from: 'header'})
                } else {
                    navigation.navigate('AuthScreen', {});
                }
                
            }}>
                <Image source={require('~/assets/ic-bell.png')} style={{width: 18, height: 18}} />
            </TouchableOpacity> 
            
        </View>
    </View>
}



const styles = StyleSheet.create({
    text:{
        color: '#fff'
    },
    navItem: {
        marginHorizontal: 5
    },
    wrap: {
        backgroundColor: "#333"
    },
    container: {
        minHeight: 40,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    rightContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 10,
    },
    btn: {
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        borderRadius: 5,
    },
})