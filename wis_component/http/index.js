import React,{Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {origin} from './origin';     // 服务地址

import {DeviceEventEmitter} from 'react-native';
import { Toast } from '@ant-design/react-native';
import { Base64 } from 'js-base64';


/**
 * 网络请求的工具类
 * 方法是静态的 可以直接 WISHttpUtils.post|get
 */
export default class WISHttpUtils extends Component{

    constructor(props){
        super(props); 
    }

    /**
     * 获取服务器 地址
     */
    static getHttpOrigin(){  
        return origin;
    }  

    /**
     * 获取 用户数据
     */
    static getUserData(option={}){

        // this.post("api-user/main",{
        //     params:{
        //         userId: option["id"]
        //     },
        //     hideLoading:true
        // },(result) => {

        //     if(result){
        //         try{
        //             // 缓存 登录数据
        //             AsyncStorage.setItem("login_config",JSON.stringify(result.data));
        //         } catch (error) {
        //         } 
        //     }
        // });


        // 登录信息
        // this.post("api-supply/main",{
        //     params:{
        //         userId: option["id"]
        //     },
        //     hideLoading:true
        // },(result) => {

        //     if(result){
        //         try{

        //             // 缓存 登录数据
        //             AsyncStorage.setItem("login_config",JSON.stringify(result.data));


        //             // 缓存 登录数据
        //             // console.log(result);
        //             // 数据字典
        //             AsyncStorage.setItem("config_supply_entrys",JSON.stringify(result.data.entrys));
        //         } catch (error) {
        //         } 
        //     }
        // });

    }


    
    /**
     * 登录 方法
    */
    static loginFunc(option,callback){
        
        var that=this;

        // 关闭 loading
        if(!option["hideLoading"]){
            // 打开 loding
            DeviceEventEmitter.emit('globalEmitter_toggle_loding',true);            
        }


        // fetch(origin+"api-uaa/oauth/user/token",{
        fetch(origin+"j_spring_security_check.action",{
            method:'POST',
            headers:{
                // 'Content-Type': 'application/json;charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Authorization': 'Basic d2ViQXBwOndlYkFwcA=='
            },
            body: "username="+option.userName+"&password="+option.password+"&lang=zh_CN&j_captcha=NO"
            // body: "j_username="+option.userName+"&j_password="+option.password+"&lang=zh_CN&j_captcha=NO&customKey='toName=home'"
        })
        .then((response) => {
            // console.log(response);
 
            // 关闭 loding
            DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);
            
            // return;
            // 账户 密码 错误
            if( response["status"]==401 ){
                response.json().then((json)=>{
                    Toast.offline(json.message,2);
                })
            }


            if(response.ok){
                return response.json();
            }else{
                Toast.offline('服务器报错！',1);
                // Toast.offline(response.message);
            }
        })
        .then((json) => {

            // 关闭 loding
            DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);

            // console.log(json)


            if(!json.success){
                Toast.info(json["message"],3);
                return
            }

            var token=json.data.token;

            // 提示
            if(json && json["message"]){
                Toast.info(json["message"],3);
            }
      

            if(json){
                // console.log(json);
                // that.getUserData(json.data);

                try{
                    // 缓存 登录信息
                    AsyncStorage.setItem("login_message",JSON.stringify({
                        // userName: Base64.decode(option.userName),
                        // password:Base64.decode(option.password),
                        userName: option.userName,
                        password:option.password,
                    }));


                    // 缓存 token 信息
                    AsyncStorage.setItem("token_config",JSON.stringify(Object.assign(
                        json.data,
                        // {buffer_new_expires_in: new Date().getTime()+(json.data["buffer_new_expires_in"]*1000) } 
                        {buffer_new_expires_in: new Date().getTime()+(500000) }                
                    )));                  

                    // 登录成功
                    if(json.success){
                        callback();
                    }
                    // 缓存 token
                    // AsyncStorage.setItem("_token",token).then(()=>{
                    //     callback();
                    // });

                } catch (error) {

                }             

            } else{
                Toast.info(json["message"],3);
            }
        })   
        .catch(error => {
            Toast.offline('服务器响应失败！',1);
            // 关闭 loding
            DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);
        });      
    }


    /**
     * 普通的get请求 
     * @param {*} url 地址
     * @param {*} params  参数
     * @param {*} callback  成功后的回调
     */
    static get(url,params,callback){        

    };


    /**
     * token 失效
     */
    static async disabledToken(){

        try{
            var config= await AsyncStorage.getItem("token_config");
            var buffer_new_expires_in = JSON.parse(config||{})["buffer_new_expires_in"];


            // 失效|有效
            return (new Date().getTime()>=buffer_new_expires_in);

        } catch (error) {

        }

    }
  

    /**
     * @param {*} url 
     * @param {*} params 
     * @param {*} callback 
     */
    static async post(url,option,callback){
        var that=this;
        var okToken= await this.disabledToken();

        // token 失效|有效
        if(okToken){


            // 缓存的 登录信息
            AsyncStorage.getItem("login_message").then((option)=>{
                if(option){
                    try{
                        let loginMessage=JSON.parse(option);

                        that.loginFunc({
                            // userName: Base64.encode(loginMessage["userName"]),
                            // password: Base64.encode(loginMessage["password"]),
                            userName: loginMessage["userName"],
                            password: loginMessage["password"],
                            hideLoading:true
                        },()=>{
                            that.postAjax(url,option,callback);
                        });
                    } catch (error) {
            
                    }          
                }
            });

        }else{

            this.postAjax(url,option,callback);
        }
    
    };



    /**
     * post Ajax
     */
    static async postAjax(url,option,callback){

        try {


            // 模拟 form 数据提交
            var formData = '';
            Object.entries(option["params"]).map((o)=>formData+='&'+o[0]+'='+String(o[1]));

            
            AsyncStorage.getItem("_token").then((data)=>{
            

                // 关闭 loading
                if(!option["hideLoading"]){
                    // open loding
                    DeviceEventEmitter.emit('globalEmitter_toggle_loding',true);
                }



                fetch(origin+url,{
                    method:'POST',
                    headers: option["headers"]?Object.assign({'Authorization': 'Bearer '+data},option["headers"]):{
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With':'XMLHttpRequest',
                        'Authorization': 'Bearer '+data
                    },
                    // body: formData
                    body: option["body"] || formData.slice(1)
                })
                .then((response) => {

                    // console.log("post 返回数据");
                    // console.log(response); 
                    // console.log( response.json()); 


                    // 关闭 loding
                    DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);

                    // 如果相应码为200 将字符串转换为json对象
                    if(response.ok){
                        return response.json();
                    }else{
                        (!option["hideToast"]) && Toast.offline(`服务器报错！[${response.status}]`,1);
                        // Toast.offline(response.message);
                    }                  
                })
                .then((json) => {


                    // console.log(1111)
                    // console.log(json)

                    // 关闭 loding
                    DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);

                    // 提示
                    if(json && json["message"]){
                        Toast.info(json["message"],3);
                    }

                    // 返回数据
                    if(json){
                        if(json.success!=false){
                            callback(json);
                        }
                    }
                })
                .catch(error => {
                    // console.log(error.message)
                    // Toast.offline('服务器响应失败！',1);
                    // 关闭 loding
                    DeviceEventEmitter.emit('globalEmitter_toggle_loding',false);
                });                
            });
        } catch (error) {

        }
    }
}