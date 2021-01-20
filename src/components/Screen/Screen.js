import React, { useEffect } from "react";


const Screen = ({status, message, active }) => {

    useEffect(() => {

    }, [])

    return (
      <div className={`screen-bar ${active && 'active'}`}>
        <div className="status-bar">{status ? 'Locked' : 'Unlocked'}</div>
        <div className="message-bar">{message}</div>
      </div>
    );

}

export default Screen;