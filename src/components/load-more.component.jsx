/* eslint-disable react/prop-types */
const LoadMoreDataBtn = ({ dataArr, fetchDataFunc, additionalParams = {}}) => {

    if(dataArr != null && dataArr.totalDocs > dataArr.results.length){
        return (
            <button onClick={() => fetchDataFunc({ ...additionalParams, page: dataArr.page + 1 })} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"> Load More </button>
        )
    }
    
    return;
}

export default LoadMoreDataBtn;