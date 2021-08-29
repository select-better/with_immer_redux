import React, { useCallback } from 'react'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { workTreeInFn } from '../../store/global/utils';
import { changeNodeNumber } from '../../store/global'

const getWorkTree = (state, ownProps) =>({ workTree: state.globalReducer.workTree, ownProps});

const getNodeValue = () =>{
    return createSelector(
        getWorkTree,
        ({workTree, ownProps}) => {
            const { primaryKey } = ownProps;
            let value = null;
            workTreeInFn(workTree, (node) => {
                if(node.primaryKey === primaryKey){
                    value = node.number;
                    return false;
                }
            })
            return value
        }
    )
}
const mapStateToProps = (state, props) => {
    // 这样能形成颗粒度的更新，就不会对不用修改的数据进行渲染
    const getNode = getNodeValue();
    return {
        value: getNode(state, props)
    }
}

const Input = ({
    value,
    dispatch,
    primaryKey
}) => {
    const onInputChange = useCallback(
        (e) => {
            dispatch(changeNodeNumber({
                number: e.target.value,
                primaryKey
            }))
        },
        [dispatch, primaryKey]
    )
    return (
        <>
            <input value={value} onChange ={ onInputChange }/>
        </>
    )
}

export default connect(mapStateToProps)(Input);
