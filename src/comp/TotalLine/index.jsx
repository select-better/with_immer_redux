import React,{ useCallback} from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { changeTotalNum } from '../../store/global'
import { isValidArray, workTreeInFn } from '../../store/global/utils'

const treeData = state => state.globalReducer.workTree;

const getTotalNumber = createSelector(
    treeData,
    workTree=>{
        // 其实就在找到最上层
        let topNumber
        if(isValidArray(workTree)){
            workTreeInFn(workTree, ( node ) => {
                // 当找到nation的时候就是最上层
                if(node.type === 'nation'){
                    topNumber = node.number;
                    return false
                }
            })
        }
        return topNumber
    }
)

const mapStateToProps = (state,cc) => {
    return {
        number: getTotalNumber(state)
    }
}

const TotalLine = ({
    number,
    dispatch
}) => {
    const getChange = useCallback((e)=>{
        dispatch(changeTotalNum({
            number: e.target.value
        }))
    }, [dispatch])
    return (
        <div>
            <div>
                全国总数量是：
            </div>
            <button onClick={()=>{
                dispatch(changeTotalNum({
                    number: ++number
                }))
            }}> 增加</button>
            <input value={number} onChange={getChange}/>
            <button onClick={()=>{
                dispatch(changeTotalNum({
                    number: --number
                }))
            }}> 减少</button>
            <hr/>
        </div>
    )
}

export default connect(mapStateToProps)(TotalLine)
