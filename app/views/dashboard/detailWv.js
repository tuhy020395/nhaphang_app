import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, Text, SafeAreaView, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Layout, Button, Avatar } from '@ui-kitten/components';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';

import {AuthContext} from '~/context/AuthController';
import { NavContext } from '~/context/NavController';
import RefreshWebView from '~/components/refreshWv';
import HeaderApp, {DrawerToggleBtn} from '~/components/HeaderNav';
import {webViewRoot, webViewURLs, color, settings} from '~/config';

const Dashboard_detail = props =>{
    const {signOut, state: authState } = React.useContext(AuthContext);
    const {state: menuState, setState: setMenuState} = React.useContext(NavContext);
    const navigation = useNavigation();
    const route = useRoute();
    const [wvUrl, setWvUrl] = useState(route.params.targetUrl)
   
    let webview = useRef(null);
    const [listData, setListData] = useState("");
    const [wvProcess, setwvProcess] = useState(0);
    const [isRefresh, setRefresh] = useState(false);
    
    React.useEffect(() => {
        // menu effect
        // console.log(menuState, authState);
        // const {userID, userToken} = authState;
        // const {echoURL: url } = menuState;
        // if(url){
        //     let newURL = `${url}0&Key=`;
        //     if(userToken){
        //          newURL = `${url.split('?')[0]}?UID=${ userID }&Key=${ userToken }`
        //     }
        //     const redirectTo = 'window.location = "' + newURL + '"';
        //     console.log("useEffect", redirectTo);
        //     webview.current.injectJavaScript(redirectTo);
        //     navigation.closeDrawer();   
        // }
        
    }, [menuState]);
    // navigation.setOptions({
    //     headerLeft: () => <DrawerToggleBtn />
    // })
    const _onRef = () => {
        setRefresh(true);
        webview.current.reload();
        setRefresh(false);
    }

    redirectToURL = url =>{
        const redirectTo = 'window.location = "' + url + '"';
        console.log('redirectTo', redirectTo);
        webview.current.injectJavaScript(redirectTo);
    }
    _onRefresh = async () =>{
        const storageStringData= await AsyncStorage.getItem('userData');
        console.log(JSON.parse(storageStringData));
    }
    _onNavigationStateChange = newNavState => {
        
        console.log("webview newNavState", newNavState);
        // newNavState looks something like this:
        // {
        //   url?: string;
        //   title?: string;
        //   loading?: boolean;
        //   canGoBack?: boolean;
        //   canGoForward?: boolean;
        // }
        const { url, canGoBack, navigationType, loading } = newNavState;
        const { userToken, userID } = authState;
        if (!url) return;
       
       
       

        if(!!navigationType && navigationType === "click"){
            
            //click link on webview
            
            if(userToken){
                // webview.current.stopLoading();
                // // redirect
                // console.log(authState);
                // const newURL = `${url.split('?')[0]}?UID=${userID}&Key=${userToken}`
                // redirectToURL(newURL)
               
            } else {
               
                
                
            }
        } 
        if(!loading){
            //in newpage and request done
            // if(url.includes('home-app')){
            //     setHome(true)
            // } else {
            //     setHome(false)
            // }
            
            if(!url.includes('home-app')){
                const jsCode = `
                    if(document.getElementsByClassName("logout").length > 0){
                        window.ReactNativeWebView.postMessage('isLogout')
                    }
                `;
                webview.current.injectJavaScript(jsCode);
            }
            


            if(!!userToken){
                // redirect
            } else {
                // not login inapp yet

            }
            
        } else {
            // request
            
            
        }
        
    }
    _onMessage = e => {
   
        console.log("_onMessage event:", e.nativeEvent);
        if(e.nativeEvent.data === "isLogout"){
            if(authState.userToken){
                // current inapp login
                Alert.alert('Thông Báo', 'Phiên làm việc của bạn đã hết hạng, hoặc bạn đã đăng nhập ở nơi khác');
                signOut();
                redirectToURL(`${ settings.webViewHomeURL }?UID=0&Key=`)
            } else {
                // islogout
                navigation.goBack();
                navigation.navigate('AuthScreen', {});
                
                
                
            }
            
        }
    }
    _onLoadProgress = ({ nativeEvent }) => {
        setwvProcess(nativeEvent.progress * 100);
    }
    
    
    return <Layout style={styles.container}>
        <View style={{height: 3, width: '100%',}} >
            <View style={{ backgroundColor: color.primary, height: '100%', width: `${wvProcess}%`}} />
        </View>
        <View style={styles.pageContent}>
            
            <RefreshWebView
                isRefresh={isRefresh} 
                onRefresh={_onRef}
                ref={webview}
                style={{ marginTop: 0 }}
                source={{ uri: wvUrl }}
                onNavigationStateChange={_onNavigationStateChange}
                onLoadProgress={_onLoadProgress}
                onMessage={_onMessage}
                
            />
            {/* <ScrollView
                refreshControl={ 
                        <RefreshControl refreshing={refreshing} onRefresh={_onRefresh}/> 
                } 
            >

            </ScrollView> */}
        </View>
        
    </Layout>
}
export default Dashboard_detail;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f1f1f1"
    },
    orderPageList: {
        flexDirection: "row",
        width: '100%',
        backgroundColor: "#fff",
        paddingHorizontal: 5
    },
    btnPageorder: {
        padding: 5,
        width: '33%',
    },
    imgBtnOrder: {
        height: 50,
        width: "100%"
    },
    pageContent: {
        flex: 1,
    },
    listWrap: {
        padding: 0,
        paddingVertical: 7.5,
    },
    listItem: {
        paddingHorizontal: 15,
        paddingVertical: 7.5,
    }
});