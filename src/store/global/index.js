
import produce from 'immer';
import {buildTree, getData, formatData, workTreeInFn} from './utils';

const initStore = {
    workTree: [],
    // 先不写，有map主要为了值改变错误修改方便
    workTreeMap :{},
    pageLoading: false
}

const handlers = {}
// 改变total的数据
const CHANGE_TOTAL_NUM = 'changeTotalNum';
export const changeTotalNum = (payload) =>{
   return {
       type: CHANGE_TOTAL_NUM,
       payload
   }
}
handlers[CHANGE_TOTAL_NUM] = (draft, payload) => {
    const { number } = payload;
    const { workTree } = draft
    workTreeInFn(workTree, (data) => {
        if(data?.type === 'nation'){
            data.number = number
            return false
        }
    })
}

// 改变区域的input的数据
const CHANGE_NODE_NUMBER = 'changeNodeNumber'

export const changeNodeNumber= (payload) => {
   return {
       type: CHANGE_NODE_NUMBER,
       payload
   }
}

handlers[CHANGE_NODE_NUMBER] = (draft , { number, primaryKey }) => {
    const { workTree } = draft
    workTreeInFn(workTree, (node) => {
        if(node.primaryKey === primaryKey){
           node.number = number
           return false
        }
    })
}


// 设置内部的值
const SET_IMMER = 'setImmer';
export const setImmer= (payload) =>{
   return {
       type: SET_IMMER,
       payload
   }
}
handlers[SET_IMMER] = async (draft, payload = {}) => {
   for(let key in payload){
     draft[key] = payload[key]
   }
}

// 异步数据直接这样，不写在handler里面，不然会报错 由于draft设置完一个属性就会卸载掉
// 外面的函数不需要async await 里面的才需要
export const getInit= (payload) => {
    return async (dispatch, getState) => {
        dispatch(setImmer({pageLoading: true}));
        let  result = await getData()
        result = formatData(buildTree(result))
        dispatch(setImmer({pageLoading: false, workTree: result }));
    }
}

export default produce((draft = initStore, action)=>{
    if(handlers[action.type]){
       handlers[action.type](draft, action.payload)
    }
    return draft;
})