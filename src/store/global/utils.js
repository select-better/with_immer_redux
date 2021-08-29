import { v4  as getUUid} from 'uuid'
const arr = [
    // 直辖市和省
    {
        code: 'cq',
        name: '重庆',
        parentCode: 'all',
        type: 'city'
    },
    {
        code: 'zj',
        name: '浙江',
        parentCode: 'all',
        type: 'region'
    },
    {
        code: 'all',
        name: '全国',
        parentCode: null,
        type: 'nation',
        number: 120
    },
    {
        code: 'js',
        name: '江苏',
        parentCode: 'all',
        type: 'region'
    }
]

export const isValidArray = arr => Array.isArray(arr) && arr.length > 0

// 构建树
export const buildTree = ( data, key = 'code', parentKey = 'parentCode') => {
    const map = new Map();
    if(!isValidArray(data)){
        return []
    }
    function getMapObj(key){
        if(map.get(key)){
            return map.get(key)
        }
        const item = {self: null, parent: null, children: []}
        map.set(key, item)
        return item;
    }
    data.forEach(item => {
        const selfNode = getMapObj(item[key]);
        const parentNode = getMapObj(item[parentKey]);
        selfNode.self = item;
        selfNode.parent = parentNode;
        parentNode.children.push(selfNode)
    });
   
    // 找到最上乘的节点，其实也是从children开始的
    let getTopNode = map.get(null)
    if(getTopNode){
       getTopNode = [getTopNode].flatMap(item=>item.children);

       function getTreeList(data){
          return  data.map(item=>{
               if(isValidArray(item.children)){
                 item.children = getTreeList(item.children)
               }
               return isValidArray(item.children)?{
                   ...item.self,
                   children: item.children
               }:{
                ...item.self,
               }
           })
       }
       if(isValidArray(getTopNode)){
          return getTreeList(getTopNode)
       }
    }
        return []
    
}

export const getData = () => {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(arr)
        }, 2000)
    })
}
// formatData 增加一下key 其实刚进来是没有id的需要key来进行关系
// 这个其实 可以和buildTree相互结合，算了，下次再说 模拟一下
// 这个只是简单的数据，实际会有更多层的数据
export const formatData = (data, parentPrimaryKey = null) => {
   return data.map(item=>{
       const primaryKey = getUUid();
       if(isValidArray(item.children)){
           item.children = formatData( item.children , primaryKey)
       }
       return isValidArray(item.children)?{
           ...item,
           parentPrimaryKey,
           primaryKey,
           children: item.children
       }:{
           ...item,
           parentPrimaryKey,
           primaryKey,
       }
   })
}

// 简单的遍历一下树 会逐层往下遍历
export const workTreeInFn = ( data , fn ) => {
    const childrenSet = new Set()
    if(isValidArray(data)){
        for(let item of data){
            // 当false的时候，就break;
            if(fn(item) === false){
                return;
            }
            childrenSet.add(item.children)
        }
        
        if(isValidArray([...childrenSet])){
            childrenSet.forEach(item=> workTreeInFn(item, fn))
        }
    }
}