
import React,{ useEffect } from 'react';
import { connect }from 'react-redux'
import { createSelector } from 'reselect'
import logo from './logo.svg';
import './App.css';
import TotalLine from './comp/TotalLine'
import RegionLine from './comp/RegionLine'
import { getInit } from './store/global'

const getStateLoading = state => state.globalReducer.pageLoading

const getLoading = createSelector(
  getStateLoading,
  (loading) => loading 
)

const mapStateToProps = (state) => {
    console.log(getLoading(state))
    return {
      loading: getLoading(state)
    }
}

function App({
  dispatch,
  loading
}) {
  useEffect(()=>{
    dispatch(getInit())
  }, [])

  return (
    <div className="App">
     { loading && <div>loading</div> ||
      <>
      <TotalLine />
      <RegionLine />
      </>}
    </div>
  );
}

export default connect(mapStateToProps)(App);
