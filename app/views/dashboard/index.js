import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, Text, 
    SafeAreaView, Platform, ActivityIndicator,
    Image, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Layout, Button, Avatar } from '@ui-kitten/components';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute , useIsFocused, useFocusEffect } from '@react-navigation/native';
import RefreshWebView from '~/components/refreshWv';
import {AuthContext} from '~/context/AuthController';
import { NavContext } from '~/context/NavController';
import {getAppConfigs} from '~/api/AccountHandler';
import HeaderApp, { DrawerToggleBtn } from '~/components/HeaderNav';
import {webViewRoot, webViewURLs, color ,settings} from '~/config';

const Dashboard = props =>{
    const {signOut, state: authState } = React.useContext(AuthContext);
    const {state: menuState, setState: setMenuState} = React.useContext(NavContext);
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    let webview = useRef(null);

    const [isHome, setHome] = useState(true);
    const [wvProcess, setwvProcess] = useState(0);
    const [isRefresh, setRefresh] = useState(false);
    const [isOrderActive, setOrderActive] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if(navigation.canGoBack()) {
                    navigation.goBack();
                    return true;
                } else {
                    
                }
                
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    React.useEffect(() => {
        // menu effect
        console.log(menuState, authState);
        const {userID, userToken} = authState;
        const {echoURL: url } = menuState;
        if(url){
            let newURL = `${url}0&Key=`;
            if(userToken){
                 newURL = `${url.split('?')[0]}?UID=${ userID }&Key=${ userToken }`
            }
            console.log("menuState update to:", newURL);
            if(url.includes('home-app')){
                const redirectTo = 'window.location = "' + newURL + '"';
                console.log("useEffect", redirectTo);
                webview.current.injectJavaScript(redirectTo);
                navigation.closeDrawer();
            } else {
                navigation.closeDrawer();
                navigation.navigate('DashboardDetail', {targetUrl: newURL})
            }
        }
        
    }, [menuState]);
    React.useEffect(() => {
        
        if(isFocused){
            console.log( 'dashboard route:', route);
            console.log( 'dashboard navigation:', navigation);
            const {userID, userToken} = authState;
            if(route.name === "Dashboard"){
                setHome(true)
                // webview.current.reload()
                let searchURL = '?UID=0&Key=';
                if(userToken){
                    searchURL = `?UID=${ userID }&Key=${ userToken }`
                }
                redirectToURL(`${ settings.webViewHomeURL }${searchURL}`)
                
            } else {
                setHome(false)
            }
        }
    }, [isFocused]);
    React.useEffect(() => {
        if(Platform.OS === "android"){
            setOrderActive(true);
        } else { 
            checkMenurender();
        }
        
    }, []);
    React.useEffect(() => {
        console.log('settings.webViewHomeURL', settings.webViewHomeURL);
        redirectToURL(`${settings.webViewHomeURL}?UID=0&Key=`)
    }, [settings.webViewHomeURL]);
    
    const checkMenurender = async () =>{
        try {
            const rs = await getAppConfigs();
            if(!!rs.data){
                setOrderActive(rs.data.IsOrderActive);
            }
            

        } catch (error) {
            
        }
    }
    const renderSearchURL = () => {
        const {userID, userToken} = authState;
        let searchURL = '?UID=0&Key=';
        if(userToken){
            searchURL = `?UID=${ userID }&Key=${ userToken }`
        }
        return searchURL;
    }
    navigation.setOptions({
        headerLeft: () => <DrawerToggleBtn />
    })
    const _onRef = () => {
        setRefresh(true);
        webview.current.reload();
        setRefresh(false);
    }
    
    const redirectToURL = url =>{
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
        const { url, canGoBack, navigationType } = newNavState;
        const { userToken, userID } = authState;
        if (!url) return;
        if(canGoBack){
            //in newpage and request done
            setHome(url.includes('home-app'));
          
            

            const jsCode = `
                if(document.getElementsByClassName("logout").length > 0){
                    window.ReactNativeWebView.postMessage('isLogout');
                }
            `;
            webview.current.injectJavaScript(jsCode);


            if(!!userToken){
                // redirect
            } else {
                // not login inapp yet

            }
            
        } else {
            // request
            
            
        }
       
       

        if(!!navigationType && navigationType === "click"){
            
            //click link on webview
            
            // if(userToken){
                webview.current.stopLoading();
                // redirect
                console.log('navigationType : click',authState);
                const newURL = `${url.split('?')[0]}?UID=${userID || 0}&Key=${userToken || ''}`
                console.log('newURL:', newURL)
                // redirectToURL(newURL)
                setTimeout(() => {
                    navigation.navigate('DashboardDetail', {targetUrl: newURL})
                }, 200);
               
            // } else {

            // }
            
        } else {
            if(Platform.OS === "android" && !url.includes('home-app')){
                webview.current.stopLoading();
                // redirect
                console.log('navigationType : click',authState);
                const newURL = `${url.split('?')[0]}?UID=${userID || 0}&Key=${userToken || ''}`
                console.log('newURL:', newURL)
                // redirectToURL(newURL)
                setTimeout(() => {
                    navigation.navigate('DashboardDetail', {targetUrl: newURL})
                }, 0);
            }
        }
        return true;
        
    }
    _onMessage = e => {
        console.log("_onMessage event:", e.nativeEvent);
        if(e.nativeEvent.data === "isLogout"){
            if(authState.userToken){
                // current inapp login
                Alert.alert('Thông Báo','Phiên làm việc của bạn đã hết hạng, hoặc bạn đã đăng nhập ở nơi khác');
                signOut();
                redirectToURL(`${ settings.webViewHomeURL }?UID=0&Key=`)
            } else {
                // islogout
                navigation.navigate('AuthScreen', {});
                webview.current.goBack();
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
           { isOrderActive && isHome && <View style={styles.orderPageList}>
                <View style={styles.btnPageorder}>
                    <TouchableOpacity onPress={()=> navigation.navigate('WebviewDetail',
                            {
                                ...webViewURLs['taobao'],
                                title: "TAOBAO",
                            }
                        )} 
                    >
                        <Image source={require('~/assets/ic-btn-taobao.png')} style={styles.imgBtnOrder} resizeMode="contain"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.btnPageorder}>
                    <TouchableOpacity onPress={()=> navigation.navigate('WebviewDetail',
                            {
                                ...webViewURLs['tmall'],
                                title: "TMALL",
                            }
                        )} 
                    >
                        <Image source={require('~/assets/ic-btn-tmall.png')} style={styles.imgBtnOrder} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <View style={styles.btnPageorder}>
                    <TouchableOpacity onPress={()=> navigation.navigate('WebviewDetail',
                            {
                                ...webViewURLs['1688'],
                                title: "1688",
                            }
                        )} 
                    >
                        <Image source={require('~/assets/ic-btn-1688.png')} style={styles.imgBtnOrder} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
            </View> }
            
            <View style={styles.pageContent}>
                <RefreshWebView
                    isRefresh={isRefresh} 
                    onRefresh={_onRef}
                    ref={webview}
                    style={{ marginTop: 0 }}
                    source={{ uri: `${ settings.webViewHomeURL }${ renderSearchURL() }` }}
                    onNavigationStateChange={_onNavigationStateChange}
                    // onShouldStartLoadWithRequest={_onNavigationStateChange}
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
export default Dashboard;


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