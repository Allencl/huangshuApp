import React, { Component } from 'react';
import { NativeModules,TouchableOpacity,DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text,   } from 'react-native';
import { Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button,Tabs } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross} from '@wis_component/ul';
import {WisFormText} from '@wis_component/form';   // form 


import TaskPage from './task.js';   // 任务下发
import DetailedPage from './detailed.js';   // 配料清单
import SearchPage from './search.js';   // 查询清单




class Page extends Component {
  constructor(props) {
    super(props);

    this.state={
      showDetailed:false,


      tabsPage:0,
      show:true,
      baseCofig:{
        // isEnd: true,
        // taskId: 22
      },
      config:{}
    }

  }

  componentWillMount(){

  }


  componentDidMount(){
    const that=this;
    let routeParams=this.props.route;


    // 监听扫码枪
    this.honeyWellPrint=DeviceEventEmitter.addListener('globalEmitter_honeyWell',function(key=""){
      let _key=key;
      if(key&&key.length>11){
        _key =(key.split("-")[0]).slice(3);
      }

      // 判断设备
      if( !(/^\d{2}\.\d{2}\.\d{2}\.\d{2}$/.test(_key)) ){
        Toast.fail('错误设备编号！',2);
        return
      }

      if(that.state.tabsPage==1){
        that.setState({
          tabsPage:0
        });
        that.taskPageRef.scanHandle(_key);
        // Toast.fail('1112233错误设备编号！',2);
        // 
      }


    });





    // 刷新
    this.update=DeviceEventEmitter.addListener('globalEmitter_to_update_malfunctionList',function(){
      that.setState({
        tabsPage:1
      })
      setTimeout(()=>{
        that.setState({
          showDetailed:true,
        },()=>{
          that.detailedPageRef.searchData(that.state.baseCofig);
        })
      },1500)
    });


 	  // 进入页面使手机音量按键失效
    NativeModules.KeyEventLister.audioSwitch(true); // 拦截手机音量按键事件


    this.keyEvent = DeviceEventEmitter.addListener('keyup', (e) => {
        if(routeParams.name=="malfunctionList"){
            // 上
            if(e.keyCode==24){
              if(that.state.tabsPage==0){
                // Toast.success( "打印" ,2);
                that.taskPageRef.printFunc();
              }
            }

            // 下
            if(e.keyCode==25){

              if(that.state.tabsPage<2){
                that.setState({
                  // showDetailed:false,
                  tabsPage:(that.state.tabsPage+1)
                })
              }else{
                that.setState({
                  // showDetailed:false,
                  tabsPage:0
                }) 
              }
              // Toast.success( String(that.state.tabsPage),2);
            }
        }    
    })



  
   
  }

  componentWillUnmount(){
    this.update.remove();
    this.honeyWellPrint.remove();



    // 恢复手机音量按键原本功能
    NativeModules.KeyEventLister.audioSwitch(false); // 取消拦截手机音量按键事件
    if (this.keyEvent) {
      // 移除事件监听
      this.keyEvent.remove();
    }
  }

  /**
   * 设置 基础信息
   * @param {*} index 
   */
  setBase=(option)=>{
    this.setState({
      baseCofig:option
    });
  }

  /**
   * tabs 切换
   * @returns 
   */
   tabsChange(index){
      const {baseCofig,showDetailed}=this.state;

      this.setState({
        showDetailed:false,
        tabsPage:index
      });

      // 配料清单
      if(index==1){
        // showDetailed && this.detailedPageRef.searchData(baseCofig);
      }

      // 配料查询
      // if(index==2){
      //   this.searchPageRef.searchData(baseCofig);
      // }

   }

  render() {
    let that=this;
    let{showDetailed,tabsPage,config,show}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');
    let routeParams=this.props.route.params.routeParams;



    const tabs = [
      { title: '任务下发' },
      { title: '配料清单' },
      { title: '历史查询' }
    ];

    return ( show ?
      <View style={{height:height,backgroundColor:"#fff"}}>
        <Tabs 
          tabs={tabs} 
          page={tabsPage}
          animated={false}
          onChange={(obj,index)=>{
            this.tabsChange(index)
          }}
        >
          <View>
            { (tabsPage==0) ?
              <TaskPage 
                onRef={(ref)=>{this.taskPageRef=ref}}

                onGetPageIndex={()=>{
                  return that.state.tabsPage
                }}
                onSetBase={(option)=>{
                  that.setBase(option);
                }}
              />
              :
              <View></View>
            }
          </View>
          <View>
            { showDetailed ?
              <DetailedPage 
                onRef={(ref)=>{this.detailedPageRef=ref}}
              />
              :
              <View></View>
            }
          </View>
          <View>
            { (tabsPage==2) ?
              <SearchPage 
                onRef={(ref)=>{this.searchPageRef=ref}}
              />
              :
              <View></View>
            }
          </View>
        </Tabs> 
      </View>
      :
      <View></View>
    );
  }
}



export default Page;

