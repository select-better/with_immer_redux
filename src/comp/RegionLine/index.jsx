import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { isValidArray, workTreeInFn } from '../../store/global/utils';
import RadioInput from './RadioInput'
// import isEqual from 'lodash.isEqual'
import Input from './Input'

const getRegionState = state => state.globalReducer.workTree;
let lastLegionData = [];

const getRegionData = createSelector(
    getRegionState,
    (workTree) => {
        const returnData = []
        workTreeInFn(workTree, (node) => {
           // 先找到最上面
           if(node.type === 'nation'){
              if(isValidArray(node.children)){
                 node.children.forEach(child=>{
                     if(child.type === 'region'){
                        returnData.push({
                            parentPrimaryKey: child.parentPrimaryKey,
                            primaryKey: child.primaryKey,
                            name: child.name
                        })
                     }
                 })
              }
              return false
           }
        })
        if(JSON.stringify(returnData)!== JSON.stringify(lastLegionData)){
            lastLegionData = returnData
        }
        return lastLegionData
    }
)

const mapStateToProps = (state) => {
    return {
        regionData: getRegionData(state)
    }
}

const RegionLine = ({
    regionData,
}) => {
    console.log('cc')
    return (
        <div>
           {regionData.map(item=>{
              return <div key={item.primaryKey}>
                   <div>
                       {item.name}
                   </div>
                   <Input primaryKey={item.primaryKey} />
                   <RadioInput primaryKey={item.primaryKey} parentPrimaryKey={item.parentPrimaryKey}/>
               </div>
           })}
           <hr/>
        </div>
    )
}

export default connect(mapStateToProps)(RegionLine)
