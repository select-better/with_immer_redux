import { applyMiddleware, combineReducers, createStore, compose } from "redux"
import globalReducer from './global'
import middleWares from './middleWares'

// 创建store
export default createStore(
    // 合并reducer
    combineReducers({
        globalReducer
    }),
    // 接受中间件
    compose(
        applyMiddleware(...middleWares),
    )
)


// 简单的createStore
// const createStore = (reducer) => {
//     let listeners = new Set()
//     let state;
    
//     // dispatch触发动作
//     const dispatch = (action) => {
//         state = reducer(state,action)
//        listeners.forEach(listener=>listener&& listener())
//     }
//     // 由于返回删除监听的，所以这样就能卸载这个事件
//     // 一旦state变化就会触发
//     const subscribe = (listener) => {
//         listeners.add(listener)
//         return () => {
//             listeners.delete(listener)
//         }
//     }

//     const getState = () => state;

//     return {
//         subscribe,
//         getState,
//         dispatch
//     }
// }

