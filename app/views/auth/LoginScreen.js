import React, { Component, useContext } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Image, Platform,
    ImageBackground,
    SafeAreaView, TextInput, KeyboardAvoidingView, ActivityIndicator, Alert
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { displayName } from '~/../app.json';
import {AuthContext} from '~/context/AuthController';
import {getLogin} from '~/api/AccountHandler.js';
import { useNavigation } from '@react-navigation/native';
import Header from './AuthHeader';
import {color} from '~/config';


const wW = Dimensions.get('window').width;
const wH = Dimensions.get('window').height;
const LoginScreen  = props => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);
    const { signIn } = React.useContext(AuthContext);
    // dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    const navigation = useNavigation();
    const _signInAsync = async () => {
        if(isLoading) {return }
        if(!!!username || !!!password) return Alert.alert('Thông Báo', "Vui lòng nhập vào tên đăng nhập và mật khẩu");

        //apply loading process login api
       
        setLoading(true);
        const res = await getLogin({username, password});
        if(!res) return Alert.alert('Thông Báo', "Kết nối máy chủ thất bại vui lòng kiểm tra lại internet, nếu internet bình thường vui lòng liên hệ nhà cung cấp để được hỗ trợ");
        if(res.Code === '102'){
            try {
                signIn({ ...res.Account, ...{Key: res.Key} }); // dispath to app stack
            } catch (error) {
                setLoading(false);
                Alert.alert('Thông Báo', error);
            }
            
        } else {
            //logih fail
            setLoading(false);
            Alert.alert('Thông Báo', "Đăng nhập thất bại, vui lòng kiểm tra lại tên đăng nhập và mật khẩu");
        }
        
    }
    
    return (
        <View style={styles.container}>
            <ImageBackground
                imageStyle={{ resizeMode: 'cover' }}
                source={require('~/assets/ic_login_bg.png')}
                style={{ width: '100%',position: 'absolute', zIndex: 0, top: 0, left: 0, bottom: 0}}
            />
            <SafeAreaView style={styles.centerContainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    style={{ flex: 1 }}
                >
                <Header />
                    <ScrollView contentContainerStyle={[{flexGrow: 1, justifyContent: "center", paddingHorizontal: 15}]} removeClippedSubviews={false}>
                       
                        <View style={{ alignItems: 'center', width: '100%' }}>
                            <Image
                                resizeMode="contain"
                                source={require('~/assets/ic_logo.png')}
                                style={{ width: '70%', height: 100 }}
                            />
                        </View>
                        <View style={ styles.formWrap } >
                            <View style={styles.frow}>
                                <TextInput 
                                    style={styles.input}
                                    placeholderTextColor="#000" 
                                    placeholder="Tên đăng nhập"
                                    value={username}
                                    onChangeText={setUsername}
                                    editable={!isLoading} 
                                    autoCapitalize="none"
                                />
                            </View>
                            <View style={styles.frow}>
                                
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#000" 
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChangeText={setPassword}
                                    editable={!isLoading}
                                    autoCapitalize="none"
                                    secureTextEntry
                                />
                            </View>
                            <View style={[styles.frow, {flexDirection: "row-reverse"}]}>
                                <TouchableOpacity
                                    style={{  }}
                                    onPress={ () => navigation.navigate('ForgotPassword')  }
                                >
                                    <Text style={[styles.btn, {paddingVertical: 5}]}>Quên mật khẩu</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.frow, {alignItems: "center"}]}>
                                <TouchableOpacity
                                    style={{ width: '100%'}}
                                    onPress={_signInAsync}
                                >
                                    
                                    {isLoading ? <View style={[styles.btn, styles.btnPrimary]} >
                                        <ActivityIndicator color="#fff" />
                                    </View> : <Text style={[styles.btn, styles.btnPrimary]}>ĐĂNG NHẬP</Text>}
                                </TouchableOpacity>
                                
                            </View>
                            <TouchableOpacity
                                style={{ width: '100%', marginTop: 0 }}
                                onPress={ () => navigation.navigate('Register')  }
                            >
                                <Text style={[styles.btn, {textTransform: "uppercase"}]}>
                                Đăng ký tài khoản
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
    
}
export default LoginScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: "#fff",
        paddingTop: 0,
        position: "relative",
    },
    centerContainer: {
        flexGrow: 1,
        position: 'relative',
        zIndex: 1,
        justifyContent: 'center',
        padding: 15
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
    }
});
