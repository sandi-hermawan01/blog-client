import axios from "axios";

export const filterPaginationData = async ({ user, create_new_arr = false, arr, data, page, countRoute, data_to_send = { } }) => {
    let obj;

    if(arr != null && !create_new_arr){
        obj = { ...arr, results: [ ...arr.results, ...data ], page: page };
    } else{

        let headers = { headers : { } };

        if(user){
            headers.headers = {
                'Authorization': `Bearer ${user}`
            }
        }

        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, { ...data_to_send }, headers)
        .then(({ data: { totalDocs } }) => {
            obj = { results: [ ...data ], page: 1, totalDocs: totalDocs, deletedDocCount: 0 };
        })
        .catch(err => console.log(err));
    }

    return obj;
}