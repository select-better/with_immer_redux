import React, { useCallback} from 'react'
import {connect} from 'react-redux'
import { createSelector} from 'reselect';
import { isValidArray, workTreeInFn } from '../../store/global/utils';
import { changeNodeNumber } from '../../store/global'

const getWorkTree = (state, ownerProps) => ({workTree: state.globalReducer.workTree, ownerProps})

const getStateRadio = () => {
    return createSelector(
        getWorkTree,
        ({
            workTree,
            ownerProps
        }) => {
            const { primaryKey, parentPrimaryKey } = ownerProps;
            let sum = 1;
            let radio = null;
            workTreeInFn(workTree, (node) => {
                if(node.primaryKey === parentPrimaryKey){
                    sum = node.number;
                    if(isValidArray(node.children)){
                        const findOne = node.children.find(child =>child.primaryKey ===  primaryKey)
                        radio = findOne.number / sum * 100
                    }
                    return false
                }
            })
            return {
                sum,
                radio
            }
        }
    )
}


const mapStateToProps = (state,props) => {
   const getRadio = getStateRadio();
   return {
     ...getRadio(state, props)
   }
}

const RadioInput = ({
    radio,
    sum,
    primaryKey,
    dispatch
}) => {
    const onRadioChange = useCallback(
        (e) => {
            dispatch(changeNodeNumber({
                primaryKey,
                number: sum / 100 * e.target.value
            }))
        },
        [primaryKey, dispatch],
    )

    return (
        <>
            <input value={radio || null} onChange={onRadioChange} style={{marginLeft: '10px'}}/> %
        </>
    )
}

export default connect(mapStateToProps)(RadioInput)
