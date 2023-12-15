/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";

const AboutUser = ({ className, bio, social_links, joinedAt }) => {
    return (
        <div className={"md:w-[90%] md:mt-7 " + className}>
            <p className="text-xl leading-7">{bio.length ? bio : "Nothing to read here."}</p>

                {/* <Link to="" target="_black"><i className="fi fi-brands-youtube text-2xl hover:text-black"></i></Link> */}
                <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
                    {
                        Object.keys(social_links).map((key) => {

                            let link = social_links[key];
                            
                            return link ? <Link to={link} key={key} target="_black"><i className={"fi " + (key != 'website' ? "fi-brands-" + key : "fi-br-link-alt") + " text-2xl hover:text-black"}></i></Link> : ""
                        })
                    }
                </div>

            <p className="text-xl leading-7 text-dark-grey">Joined on {getFullDay(joinedAt)}</p>
        </div>
    )
}

export default AboutUser;