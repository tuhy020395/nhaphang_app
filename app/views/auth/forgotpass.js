import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image,
    ImageBackground,
    RefreshControl,ActivityIndicator,Alert,
    SafeAreaView, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';

import * as accountUtils from '~/api/AccountHandler.js';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Header from './AuthHeader';
import {color} from '~/config';
const ForgotPass = props =>{
    const navigation = useNavigation();
    const [email, setEmail] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);
    const [refreshing, setrefreshing] = React.useState(false);

    onRefresh = async () =>{
   
    }
 
    _doFogotPass = async () => {
        
        setLoading(true)
        try {
            const res = await accountUtils.ForgotPassword({
                Email: email
            });
            console.log('forgot pass response:', res);
            if(res.Code === "102"){
                Alert.alert(
                    'Thành công',
                    'Hệ thống đã gửi 1 email mới cho bạn, vui lòng kiểm tra email và thiết lập lại mật khẩu.',
                    [
                        {
                            text: 'Trở về',
                            onPress: () => {
                                navigation.goBack()
                            },
                            style: 'cancel',
                        },
                   
                    ],
                    { cancelable: false },
                );
                setEmail('');
                
            } else if(res.Code === "101"){
                if(!!res.Logout){
                    Alert.alert('Thông Báo', 'Phiên làm việc của bạn đã hết hạng, hoặc tài khoản đã bị dăng nhập ở nơi khác');
                    signOut();
                } else {
                    Alert.alert('Thông Báo', res.Message)
                }
            } else {
                Alert.alert('Thông Báo', res)
            }
        } catch (error) {
            
        }
        setLoading(false)
    }

    return <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{flexGrow: 1}} keyboardVerticalOffset={100}
    >  
    <ImageBackground
        imageStyle={{ resizeMode: 'cover' }}
        source={require('~/assets/ic_login_bg.png')}
        style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}
    />
    <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.container}>
            <ScrollView
                refreshControl={ 
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> 
                } 
            >
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <Image
                        resizeMode="contain"
                        source={require('~/assets/ic_logo.png')}
                        style={{ width: 150, height: 100 }}
                    />
                </View>
                <View style={ styles.formWrap } >
                    <View style={ styles.frow }>
                        <Text style={[{fontSize: 16, textAlign: "center"}]}>Vui lòng nhập chính xác thông tin bạn đã đăng ký trước đây. Chúng tôi sẽ gửi một email tới địa chỉ email bạn đã đăng ký để lấy lại mật khẩu.</Text>
                    </View>
                    <View style={ styles.frow }>
                        <View style={styles.hasLbInline}>
                            <Text style={[{fontSize: 16}]}>EMAIL:</Text>
                            <TextInput 
                                style={[styles.input, {flexGrow: 1}]}
                                placeholderTextColor="#888" 
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                editable={!isLoading}
                                autoCapitalize="none"
                            />
                        </View>
                            
                    </View>
                    <View style={ styles.frow }>
                        <TouchableOpacity
                            style={{ width: '100%'}}
                            onPress={_doFogotPass}
                        >
                            {isLoading ? <View style={[styles.btn, styles.btnPrimary]} >
                                        <ActivityIndicator color="#fff" />
                                    </View> : <Text style={[styles.btn, styles.btnPrimary]}>Xác nhận</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
                
            </ScrollView>
        </View>
        
    </SafeAreaView>
    </KeyboardAvoidingView>
}
export default ForgotPass;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
    },
    formWrap: {
        alignItems: "stretch",
        padding: 15,
        backgroundColor: "transparent",
        marginTop: 30,
        marginTop: 10,
        borderRadius: 30,

    },
    frow: {
        marginBottom: 10,
        // backgroundColor: 'blue'
    },
    input: {
        backgroundColor: '#f6f6f6',
        color: '#000',
        fontSize: 16,
        paddingVertical: 15,
        paddingHorizontal: 15,
        lineHeight: 20
    },
    btn:{
        textAlign: "center",
        color: color.second,
        fontSize: 16,
        lineHeight: 20,
        padding: 15,
        fontWeight: "normal"
    },
    btnPrimary: {
        backgroundColor: color.primary,
        color: '#fff',
    },
    hasLbInline: {
        backgroundColor: '#f6f6f6',
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 15,
    }
});