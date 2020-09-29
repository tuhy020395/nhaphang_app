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
    RefreshControl,
    SafeAreaView, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';

import * as accountUtils from '~/api/AccountHandler.js';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from '~/context/AuthController';
import {color} from '~/config';
const ForgotPass = props =>{
    const {signOut, state: authState } = React.useContext(AuthContext);
    const navigation = useNavigation();
    
    const [passwordOld, setPasswordOld] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);
    const [refreshing, setrefreshing] = React.useState(false);

    onRefresh = async () =>{
   
    }
 
    _doFogotPass = async () => {
        setLoading(true)
        try {
            const res = await accountUtils.ChangePassword({UID: authState.userID, 
                Password: passwordOld, 
                NewPassword: password, 
                ConfirmNewPassword: password2
            });
            console.log('Profile screen data:', res);
            if(res.Code === "102"){
                Alert.alert(
                    'Thành công',
                    'Mật khẩu của bạn đã được cập nhật',
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

        <View style={styles.container}>
            <ScrollView
              
            >
               
                <View style={ styles.formWrap } >
                    <View style={[ styles.frow, { alignItems: 'center', width: '100%' }]}>
                        <Image
                            resizeMode="contain"
                            source={require('~/assets/ic_logo.png')}
                            style={{ width: 150, height: 100 }}
                        />
                    </View>
                    <View style={ styles.frow }>
                        <View style={styles.hasLbInline}>
                            <Text style={[styles.flb,{fontSize: 16}]}>Mật khẩu cũ:</Text>
                            <TextInput 
                                style={[styles.input, {flexGrow: 1}]}
                                placeholderTextColor="#888" 
                                placeholder="Mật khẩu cũ"
                                value={passwordOld}
                                onChangeText={setPasswordOld}
                                editable={!isLoading} 
                                autoCapitalize="none"
                                secureTextEntry
                            />
                        </View>
                            
                    </View>
                    <View style={ styles.frow }>
                        <View style={styles.hasLbInline}>
                            <Text style={[styles.flb,{fontSize: 16}]}>Mật khẩu mới:</Text>
                            <TextInput 
                                style={[styles.input, {flexGrow: 1}]}
                                placeholderTextColor="#888" 
                                placeholder="Mật khẩu mới"
                                value={password}
                                onChangeText={setPassword}
                                editable={!isLoading} 
                                autoCapitalize="none"
                                secureTextEntry
                            />
                        </View>
                            
                    </View>
                    <View style={ styles.frow }>
                        <View style={styles.hasLbInline}>
                            <Text style={[styles.flb,{fontSize: 16}]}>Xác nhận Mk:</Text>
                            <TextInput 
                                style={[styles.input, {flexGrow: 1}]}
                                placeholderTextColor="#888" 
                                placeholder="Xác nhận mật khẩu mới"
                                value={password2}
                                onChangeText={setPassword2}
                                editable={!isLoading}
                                autoCapitalize="none"
                                secureTextEntry
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
        fontWeight: "bold"
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
    },
    flb:{
        flexBasis: 105
    }
});