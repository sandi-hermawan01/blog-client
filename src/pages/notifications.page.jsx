import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App"
import axios from "axios";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import NotificationCard from "../components/notification-card.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const Notifications = () => {

    const [ filter, setFilter ] = useState("all");
    const [ notifications, setNotifications ] = useState(null);

    let { userAuth, userAuth: { access_token, new_notifications_available }, setUserAuth } = useContext(UserContext);

    let filters = ['all', 'like', 'comment', 'reply'];

    const fetchNotifications = ({ page, deletedDocCount = 0 }) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/notifications', { page, filter, deletedDocCount } ,{
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(async ({ data: { notifications: data } }) => {

            if(new_notifications_available){
                setUserAuth({ ...userAuth, new_notifications_available: false })
            }

            let formatedData = await filterPaginationData({
                arr: notifications, data, page,
                countRoute: "/all-notification-count",
                data_to_send: { filter },
                user: access_token
            })

            setNotifications(formatedData)
        })
        .catch(err => {
            console.log(err)
        })

    }

    useEffect(() => {
        if( access_token ) {
            fetchNotifications({ page: 1 });
        }
    }, [access_token, filter])

    const handleFilter = (e) => {

        let btn = e.target;

        setFilter(btn.innerHTML);

        setNotifications(null)
    }

    return(
        <div>
        
            <h1 className="max-md:hidden">Recent Notifications</h1>

            <div className="my-8 flex gap-6 ">
                {
                    filters.map((filtername, i) => {
                        return <button key={i} className={"py-2 " + ( filter == filtername ? "btn-dark" : "btn-light" )} onClick={handleFilter}>{filtername}</button>
                    })
                }
            </div>

            {
                notifications == null ? <Loader /> :
                <>
                    {
                        notifications.results.length ? 
                            notifications.results.map((notification, i) => {
                                return <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}><NotificationCard data={notification} index={i} notificationData={{ notifications, setNotifications }} /></AnimationWrapper>
                            })
                        : <NoDataMessage message="Nothing available" />
                    }

                    <LoadMoreDataBtn dataArr={notifications} fetchDataFunc={fetchNotifications} additionalParams={{ deletedDocCount: notifications.deletedDocCount }} />
                </>
                
            }

        </div>
    )
}

export default Notifications;