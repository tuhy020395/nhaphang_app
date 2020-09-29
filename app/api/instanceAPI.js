import React from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {webViewRoot} from '~/config'
export const getAccessToken = async () => {
    try {
        const retrievedItem = await AsyncStorage.getItem('userToken');
        if (retrievedItem !== null) {
            return retrievedItem;
        } return '';
    } catch (error) {
        // Error retrieving data
    }
};
export const getUserData = async () => {
    try {
        const retrievedItem = await AsyncStorage.getItem('userData');
        if (retrievedItem !== null) {
            return retrievedItem;
        } return '';
    } catch (error) {
        // Error retrieving data
    }
};
const apiConfig = {
    baseUrl: `${webViewRoot}/webservice1.asmx`,
    // should end with a slash
    // clientSecret: 'xc34jamesDevV41XwKbWhrsGgHvR3hjwG8',
};


const instance = axios.create({
    baseURL: apiConfig.baseUrl,
    headers: {
        Accept: 'application/json',
    },
    // data: {
    //     // client_id: apiConfig.clientId,
    //     // client_secret: apiConfig.clientSecret,
    //     id: 'password',
    //     scope: '*',
    // },
});
export default instance;
function getUrl(config) {
    if (config.baseURL) { return config.url.replace(config.baseURL, ''); }
    return config.url;
}
// Intercept all request
instance.interceptors.request.use(
    config => {
        console.log(
            `%c ${config.method.toUpperCase()} - ${getUrl(config)}:`,
            'color: #0086b3; font-weight: bold', config);
        return config;
    }, error => Promise.reject(error),
);
// Intercept all responses
instance.interceptors.response.use(
    async response => {
        console.log(
            `%c ${response.status} - ${getUrl(response.config)}:`,
            'color: #008000; font-weight: bold',
            response,
        );
       
        return response;
    }, error => {
        console.log(
            `%c ${error.response.status} - ${getUrl(error.response.config)}:`,
            'color: #a71d5d; font-weight: bold',
            error.response,
        ); 
        return Promise.reject(error);
    }
);
// export const doTranslateRequest = async e => {
//     let data = '';
//     var sourceText = e.sourceText || '';
//     var sourceLang = e.sourceLang || 'auto';
//     var targetLang =  e.targetLang || 'en';
//     try {
//         const accessToken = await getAccessToken();
//         const res  = await instance.get(InstancePath + '/GetAllMenu', {
//             //setting
//             params: {
//                 Key: accessToken,
//                 ...e
//             }
//         });
    
//         data = res.data;
//     } catch (error) {
//         data = error;
//     }
//     return data;
// }
// function doTranslateRequest(e) {

//     var sourceText = e.sourceText || '';
//     var sourceLang = e.sourceLang || 'auto';
//     var targetLang =  e.targetLang || 'en';

//     var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" 
//               + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
//     return $.ajax({
//         url: url,
//         method: 'GET'
//     }).done(function(rs){
//         console.log(rs[0]);
//     });
// }