import React, { Component } from 'react';
import { TouchableOpacity,TextInput,DeviceEventEmitter,NativeModules,Dimensions,StyleSheet, ScrollView, View,Text,   } from 'react-native';
import { Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button,Tabs } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross} from '@wis_component/ul';
import {WisFormText} from '@wis_component/form';   // form 


// 配料清单
class Page extends Component {
  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state={

        columns1:[
          {
            label:"产线",
            key:"lineCode"
          },
          {
            label:"台车",
            key:"trolleyCode"
          },   
          {
            label:"台车名称",
            key:"trolleyName"
          },               
          {
            label:"屏幕",
            key:"screenNo"
          },
                                 
        ],
        dataList1:[],

        columns2:[
          {
            label:"印刷NO",
            key:"printNo"
          },
          {
            label:"顺位NO",
            key:"sequenceNo"
          },    
          {
            label:"作业日",
            key:"workDay"
          },
          {
            label:"页数",
            key:"totalPage"
          },                                     
        ],
        dataList2:[],

        columns3:[
          {
            label:"No.",
            key:"_index"
          },
          {
            label:"货位",
            key:"cargoSpace"
          },    
          {
            label:"数量",
            key:"num"
          },
          {
            label:"图号/累进",
            key:"drawingNo"
          },     
          {
            label:"打印No",
            key:"printNo"
          }                                            
        ],
        dataList3:[]


    }

  }

  componentWillMount(){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  
  /**
   * 查询
   * @returns 
  */
  searchData=(option={})=>{
    let that=this;
    const {ToastExample}=NativeModules;



    if(!option.taskId){
      // Toast.info("任务下发未初始化！",2);
      ToastExample.show("任务下发未打印！");
      return
    }

    WISHttpUtils.post("tmBatchingTask/getBathingTaskInfo.do",{
      params:{
        taskId:option.taskId,
      },
      // hideLoading:true
    },(result) => {
      let {data,success}=result;
      // console.log(result);
      
      that.setState({
        dataList1:[(data.base||{})],
        dataList2:[(data.base||{})],
        dataList3:(data.detailList||[]).map((o,i)=>Object.assign(o,{_index:i+1}))
      });
    }); 

  }

  render() {
    let that=this;
    let {columns1,dataList1,columns2,dataList2,columns3,dataList3}=this.state;
    let {navigation,form} = this.props;
    const {width, height, scale} = Dimensions.get('window');


    return (
      <ScrollView style={{height:height-180}}>

        <View style={{height:8}}></View>
        <View><Text style={{fontSize:12,fontWeight:'600',color:"#1890ff",paddingLeft:12}}>台车信息</Text></View>
        
        <WisTableCross
          columns={columns1}
          data={dataList1||[]}
        />

        <View><Text style={{fontSize:12,fontWeight:'600',color:"#1890ff",paddingLeft:12}}>配料任务</Text></View>

        <WisTableCross
          columns={columns2}
          data={dataList2||[]}
        />

        <View><Text style={{fontSize:12,fontWeight:'600',color:"#1890ff",paddingLeft:12}}>配料明细</Text></View>
        
        { (dataList3||[]).length ? 
            <WisTableCross
              columns={columns3}
              data={(dataList3||[])}
            />
            :
            <View style={{marginTop:12}}>
              <Text style={{textAlign:"center"}}>无图号</Text>
            </View>
        }


      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    // backgroundColor:"red",

  },
});

export default Page;

