import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View,
    RefreshControl, Text, SafeAreaView, Image,
    ActivityIndicator, Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Layout, Button, Avatar } from '@ui-kitten/components';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';

import {AuthContext} from '~/context/AuthController';
import { NavContext } from '~/context/NavController';

import HeaderApp, {DrawerToggleBtn} from '~/components/HeaderNav';
import {webViewRoot, webViewURLs, color} from '~/config';
import { getNoti, UpdateNoti } from '~/api/AccountHandler';
import Spinner from 'react-native-loading-spinner-overlay';

const Noti = props => {
    const {signOut, state: authState } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    const {from} = route.params;
    const [refreshing, setrefreshing] = React.useState(false);
    const [isLoading, setLoading] = useState(false);
    const [ListData, setListData] = useState('');
    navigation.setOptions({
        headerRight: () => null,
        headerTitle : () => <Text style={{color: '#fff', fontSize: 16, fontWeight: "bold"}}>Thông báo</Text>,
        headerTitleAlign: "center"
    })
    useEffect(() => {
        onRefresh()
    }, []);
    useEffect(() => {
        if(isFocused){
            onRefresh()
        }
    }, [isFocused]);
    const onRefresh = async () =>{
        setrefreshing(true);
        await renderScreenData();
        setrefreshing(false);
    }
    renderScreenData = async () => {
        setLoading(true);
        try {
            const res = await getNoti({UID: authState.userID});
            console.log('res.ListNoti', res);
            if(res.Code === "102"){
                
                setListData(res.ListNoti)
            } else if(res.Code === "101"){
                if(res.Logout){
                    Alert.alert('Thông Báo', 'Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                    signOut();
                } else {
                    Alert.alert('Thông Báo', res);
                }
                
            }
        } catch (error) {
            
        }

        setLoading(false);
    }   
    const _onPress = async data => {
        navigation.navigate('DashboardDetail', {targetUrl: data.Link})
    }
    const _onGoback = () => {
    }
    return <View style={styles.container}>
        {isLoading && <ActivityIndicator size="large" style={{marginTop: 10}} />}
        {!isLoading && <ScrollView
            refreshControl={ 
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> 
            }
        >
            {
                Array.isArray(ListData) && ListData.length > 0 ? ListData.map((item,index) => {
                   return <NotiItem key={item.NotificationID} data={item} />
                }) :<Text style={{ padding: 10, fontSize: 24, textAlign: "center", color: "gray"}}>Không có thông báo nào</Text>
            }
        </ScrollView>}
        
    </View>
}
export default Noti;

const NotiItem = props =>{
    const navigation = useNavigation();
    const {signOut, state: authState } = React.useContext(AuthContext);
    const { data } = props;
    const [spinner, setspinner] = useState(false)
    const [isDim, setIsDim] = useState(data.Status === 2);
    const _onPress = async () => {
        setspinner(true);
        try {
            const res = await UpdateNoti({NotificationID: data.NotificationID, UID: authState.userID});
            console.log("UpdateNoti res:", res);
        } catch (error) {
            console.log(error);
        }
        setspinner(false);
        if(data.Link.length > 0){
            navigation.navigate('DashboardDetail', {targetUrl: data.Link})
        }  
         
    }
    return <TouchableOpacity
        style={styles.Noti_wrap}
        onPress={_onPress}
    >
        <View style={styles.Noti_inner}>
            <View style={styles.Noti_leftMedia}>
                <View style={[styles.Noti_indicator, isDim && {opacity: 0}]} ></View>
            </View>
            <View style={styles.Noti_rightContent}>
                <Text style={[styles.Noti_txt, isDim && {color: "#898989"}]}>{data.Message}</Text>
            </View>
        </View>
        <Spinner
          visible={spinner}
          textContent={''}
          textStyle={styles.spinnerTextStyle}
        />
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingVertical: 10,
        backgroundColor: "#fff"
    },
    text: {

    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    Noti_wrap:{
        
        paddingHorizontal: 15,
        paddingVertical: 15,
        paddingLeft: 0,
        borderStyle: "solid",
        borderBottomColor: "#e1e1e1",
        borderWidth: 0,
        borderBottomWidth: 1
    },
    Noti_txt: {
        fontSize: 16,
        lineHeight: 25,
    },
    Noti_inner:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    Noti_leftMedia:{
        width: 70,
        flexBasis: '15%',
        textAlign: "center",
        alignItems: "center"
    },
    Noti_rightContent:{
        flexGrow: 1,
        flexBasis: '85%'
    },
    Noti_indicator: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: color.primary,
        margin: 'auto',
    }
});


