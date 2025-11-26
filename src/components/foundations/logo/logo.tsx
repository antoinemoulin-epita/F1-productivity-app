import React from "react";

const Logo = (className: string) => {
    return (
        <div className={"cursor-pointer " + className}>
            <h1 className="font-black" onClick={() => (window.location.href = "/landing")}>
                VROOM
            </h1>
        </div>
    );
};

export default Logo;
