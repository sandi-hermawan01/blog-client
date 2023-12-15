/* eslint-disable react/prop-types */
import { useState } from "react";

const InputBox = ({ name, type, id, placeholder, icon, disable = false, value = "" }) => {

    const [ passwordVisible, setPasswordVisibility ] = useState(false);

    return (
        <div className="relative w-[100%] mb-6">
            <input name={name} type={type == "password" ? passwordVisible ? "text" : "password" : type}
                id={id} defaultValue={value} className="input-box" placeholder={placeholder} disabled={disable}/>
            <i className={"fi " + icon + " input-icon"}></i>

            {
                type == "password" ?
                <i className={`fi fi-sr-eye${ !passwordVisible ? "-crossed" : "" } input-icon left-[auto] right-4 cursor-pointer`} 
                onClick={() => setPasswordVisibility(currentVal => !currentVal)}>
                </i>
                : ""
            }
        </div>
    );
};

export default InputBox;
