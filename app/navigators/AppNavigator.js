/**
 *
 *
 *
 *
 */
import React from 'react';
import { View, Text, StatusBar, Alert } from 'react-native';
import { NavigationContainer, createSwitchNavigator, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
// screens
import AuthLoadingScreen from './AuthLoadingScreen'
import Dashboard from '~/views/dashboard'
import DashboardDetail from '~/views/dashboard/detailWv'
import WebviewList from '~/views/order/'
import CartScreen from '~/views/cart/'
import OrderDone from '~/views/cart/orderDone'
import NotiScreen from '~/views/noti/'

import WebviewDetail from '~/views/order/webviewDetail'
import LoginScreen from '~/views/auth/LoginScreen'
import RegisterScreen from '~/views/auth/Register'
import ForgotpassScreen from '~/views/auth/forgotpass'
import Profile from '~/views/user/Profile';
import ChangePassword from '~/views/user/changePassword';
import MyDrawer from "./Sidebar"
import AsyncStorage from '@react-native-community/async-storage'
import { AuthContext } from '~/context/AuthController'
import { NavContext } from '~/context/NavController';
import HeaderApp, { HeaderRight, HeaderBackImage } from '~/components/HeaderNav'
import { color } from '~/config'

export const navigationRef = React.createRef();

const HomeNavigator = () => {
    const Stack = createStackNavigator();
    return <Stack.Navigator 
        // headerMode="none"
        // initialRouteName="Login"
        
        screenOptions={{
            // header: ({ scene, previous, navigation }) => <HeaderApp {...{ scene, previous, navigation }} />,
            headerRight: () => <HeaderRight />,
            headerTitle : () => null,
            headerStyle: { 
                backgroundColor: color.headerBackgroundColor,
            },
            headerTitleStyle:{
                color: '#fff'
            },
            headerBackTitle: '',
            headerTruncatedBackTitle: '',
            headerBackImage: () => <HeaderBackImage />,
            headerBackTitleStyle: {
                color: '#fff'
            },
            // headerTintColor: {
            //     color: '#fff'
            // },
            // leftButtonStyle: {
            //     color: '#fff'
            // }
        }}
    >
        <Stack.Screen 
            name="Dashboard" component={Dashboard} 
            options={{

            }} 
        />
        <Stack.Screen 
            name="DashboardDetail" component={DashboardDetail} 
            options={{
             
            }} 
        />
        <Stack.Screen 
            name="WebviewDetail" component={WebviewDetail} 
            options={{
             
            }} 
        />
        <Stack.Screen 
                name="WebviewList" component={WebviewList} 
                options={{
          
                }}  
            />
        <Stack.Screen 
            name="CartScreen" component={CartStack} 
            options={{
             
            }} 
        />
        {/* <Stack.Screen 
            name="OrderReview" component={OrderDone} 
            options={{
             
            }} 
        /> */}
        <Stack.Screen 
            name="NotiScreen" component={NotiScreen} 
            options={{
             
            }} 
        />
        <Stack.Screen 
            name="ProfileUser" component={Profile} 
            options={{
             
            }} 
        />
        <Stack.Screen 
            name="ChangePassword" component={ChangePassword} 
            options={{
             
            }} 
        />
        
        
    </Stack.Navigator>
}


function getHeaderTitle(route) {
    // If the focused route is not found, we need to assume it's the initial screen
    // This can happen during if there hasn't been any navigation inside the screen
    // In our case, it's "Feed" as that's the first screen inside the navigator
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'CartList';

    switch (routeName) {
        case 'CartList':
            return 'Giỏ hàng';
        case 'OrderReview':
            return 'Thông tin đơn hàng';
    }
}
const CartStack = ({ navigation, route }) =>{
    const Stack = createStackNavigator();
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => null,
            headerTitle : () => <Text style={{color: '#fff', fontSize: 16, fontWeight: "bold", textTransform: "uppercase"}}>Giỏ Hàng</Text>,
            headerTitleAlign: "center"
        })
    }, [navigation, route]);
    return <Stack.Navigator 
        headerMode="none"
        mode="modal"
        screenOptions={{
            // cardStyle: { backgroundColor: 'transparent' },
            cardOverlayEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
            
        }}
    >
        <Stack.Screen 
            name="CartList" component={CartScreen} 
            options={{
             
            }} 
        />
        <Stack.Screen 
            name="OrderReview" component={OrderDone} 
            options={{
             
            }} 
        />
    </Stack.Navigator>
} 
const Drawer = props => {
    const [menuState, setMenuState] = React.useState({
        echoURL: '',
        action: ''
    });   
    const Drawer = createDrawerNavigator()
    return <NavContext.Provider value={{state: menuState, setState: setMenuState}}>
        <Drawer.Navigator
            drawerContent={ props => <MyDrawer {...props} />}
            initialRouteName="HomeStack"
            // drawerPosition="left"
            screenOptions={{
                headerStyle: {
                    paddingTop: 5,
                    paddingBottom: 5
                }
            }}
            drawerContentOptions={{
                itemsContainerStyle: {
                    marginVertical: 0,
                    paddingVertical: 0,
                },
                itemStyle: {
                    borderTopColor: "#e1e1e1",
                    borderTopWidth: 1,
                    margin: 0,
                    padding: 0,
                    minHeight: 0,
                    borderRadius: 0,
                    backgroundColor: "#f8f8f8",
                    flexDirection: "row",
                },
                labelStyle: {
                    marginVertical: 0,
                    paddingVertical: 0,
                    minHeight: 0,
                    flexDirection: "row",
                }
            }}
        >
            <Drawer.Screen 
                name="HomeNavigator" component={HomeNavigator} 
                options={{
                    // drawerLabel: () => <DrawerLabel label="Dự án đang làm" icon={require('~/assets/drawer-right-arrow.png')} />,
                    // drawerIcon: () => null,
                }} 

            />
            
            
        </Drawer.Navigator> 
    </NavContext.Provider>
}
const AuthStack = () => {
    
    const Stack = createStackNavigator();
    return <Stack.Navigator headerMode="none"
        initialRouteName="Login"
       
    >
         <Stack.Screen 
            name="Login"
            options={{
                title: 'Sign in',
                // // When logging out, a pop animation feels intuitive
                // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
            component={LoginScreen} />
        <Stack.Screen 
            name="Register"
            options={{
                title: 'Đăng ký',
            }}
        component={RegisterScreen} />
        <Stack.Screen 
            name="ForgotPassword"
            options={{
                title: 'Quên mật khẩu',
            }}
        component={ForgotpassScreen} />
        
    </Stack.Navigator>
}
const AfterLoginStack = () => {
    const Stack = createStackNavigator()

    return <Stack.Navigator 
        headerMode="none"
        initialRouteName="Drawer" 
    >
        <Stack.Screen name="Drawer"  
            options={{
                // header: null,
                // headerShown: false,
            }} 
            component={Drawer} 
        />
        {/* <Stack.Screen name="NotiScreen"  
            options={{
                header: null,
                headerShown: false,
            }} 
            component={NotiScreen} 
        /> */}
        {/* <Stack.Screen 
            name="CartScreen"
            options={{
                title: 'Giỏ hàng',
            }}
            component={CartScreen} 
        /> */}
        
    </Stack.Navigator>
}
const NotLoginStack = () => {
    
    const Stack = createStackNavigator()

    return <Stack.Navigator 
        headerMode="none"
        initialRouteName="Drawer" mode="modal"
        screenOptions={{
            cardStyle: { backgroundColor: 'transparent' },
            cardOverlayEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
            
        }}
    >
        <Stack.Screen name="Drawer"  
            options={{
                // header: null,
                // headerShown: false,
            }} 
            component={Drawer} 
        />
        <Stack.Screen name="AuthScreen"  
            options={{
                header: null,
                headerShown: false,
            }} 
            component={AuthStack} 
        />
        <Stack.Screen 
            name="RegisterQuick"
            options={{
                title: 'Đăng ký',
                header: null,
                headerShown: false,
            }}
            component={RegisterScreen} 
        />
    </Stack.Navigator>
}


const PrimaryStack = () => { 
    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        userID:  action.id,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        userToken: action.token,
                        userID:  action.id,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        userToken: null,
                        userID:  0,
                    };
                case 'AUTH_LOADING':
                    return{
                        ...prevState,
                        isLoading: true
                    }
                
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
            userID: '0'
        }
    );
    React.useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let userToken, userId;
 
            try {
                userToken = await AsyncStorage.getItem('userToken');
                userId = await AsyncStorage.getItem('userID');
                
            } catch (e) {
                // Restoring token failed

            }
           
           
            console.log("AsyncStorage: userToken is", userToken, userId );
            // After restoring token, we may need to validate it in production apps

            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            dispatch({ type: 'RESTORE_TOKEN', token: userToken, id: userId });
        };

        bootstrapAsync();
    }, []);
    const authContext = React.useMemo(() => ({
        signIn: async data => {
            try {
                let tokenSignin = data.Key;
                let id = String(data.ID);
                await AsyncStorage.setItem('userToken', tokenSignin);
                await AsyncStorage.setItem('userID', id);
                await AsyncStorage.setItem('userData', JSON.stringify(data));
                dispatch({ type: 'SIGN_IN', token: tokenSignin, id:  id});
            } catch (error) {
                Alert.alert('Thông báo',error);
            }
                
            
        },
        signOut: async () => {
            await AsyncStorage.multiRemove(['userToken', 'userID', 'userData']);
            dispatch({ type: 'SIGN_OUT' });
        },
        signUp: async data => {
            // In a production app, we need to send user data to server and get a token
            // We will also need to handle errors if sign up failed
            // After getting token, we need to persist the token using `AsyncStorage`
            // In the example, we'll use a dummy token

            dispatch({ type: 'SIGN_IN', token: data.Key });
        }
    }), [] );
    
    const Stack = createStackNavigator();
    
    return <AuthContext.Provider value={{...authContext, ...{state}}}>
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator 
                headerMode="none"            
            >
                {state.isLoading ? (
                    // checking for the token 
                    <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
                ) : state.userToken === null ? (
                    // isn't signed in
                    //<Stack.Screen name="Auth" component={ AuthStack } options={{ // When logging out, a pop animation feels intuitive animationTypeForReplace: state.isSignout ? 'pop' : 'push', }} />
                    <Stack.Screen name="NotLoginStack" 
                        component={NotLoginStack}
                        options={{
                            // header: null,
                            // headerShown: false,
                        }} 
                    />
                    
                ) : <Stack.Screen name="AfterLoginStack" 
                        component={AfterLoginStack}
                        options={{
                            // header: null,
                            // headerShown: false,
                        }} 
                    />
                        
                }
            </Stack.Navigator>
        </NavigationContainer>
    </AuthContext.Provider>    
}

export default () => <PrimaryStack />;
