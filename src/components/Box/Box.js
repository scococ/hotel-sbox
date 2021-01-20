import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import Button from "../Button/Button";
import Screen from "../Screen/Screen";
import {
  IDLE_SCREEN_TIME,
  INPUT_SUBMIT_TIME,
  LOCKING_TIME,
  SERIAL_NUMBER,
} from "../../constants/constants";
import { useDispatch } from "react-redux";
import {
  preventType,
  setActive,
  setAsyncLocking,
  setAsyncUnLocked,
  setError,
  setInactive,
  setService,
  setUnLocking,
} from "../../redux/actions/actions";
import { DecrptPass, EncriptPass } from "../../auth/auth";
import Cookies from "js-cookie";

const Buttons = [
  { val: 7 },
  { val: 8, icon: 1 },
  { val: 9 },
  { val: 4, icon: 1 },
  { val: 5 },
  { val: 6, icon: 1 },
  { val: 1 },
  { val: 2, icon: 1 },
  { val: 3 },
  { val: "*", icon: "A" },
  { val: 0 },
  { val: "L", icon: "B" },
];

const BoxContainer = ({ active, status, locked, service_mode, locking }) => {
  let [boxState, setBoxState] = useState([]);
  let [submit, setSubmit] = useState(false);
  const dispatch = useDispatch();
  const lockTimer = useRef("");
  const idleTimer = useRef("");

  //locking part
  useEffect(() => {
    if (boxState?.length > 5 && submit && !service_mode) {
      //set logic for locking
      dispatch(setAsyncLocking());
      const hash = EncriptPass(boxState);
      //password expires after two days?
      Cookies.set(process.env.REACT_APP_COOKIE, hash, { expires: 2 });
      setBoxState([]);
      setSubmit(false);
    }

    return () => {
      if (lockTimer.current) {
        clearTimeout(lockTimer.current);
      }
    };
  }, [boxState, submit]);

  //Unlocking part and control idle process
  useEffect(() => {
    if (boxState?.length > 5 && !service_mode) {
      let isLocked;
      try {
        isLocked = Cookies.get(process.env.REACT_APP_COOKIE);
      } catch (e) {
        console.log(e);
      }
      if (isLocked) {
        const decrypt = DecrptPass(isLocked);
        const currentPassword = JSON.stringify(boxState);
        const stringDecrypt = JSON.stringify(decrypt);
        setTimeout(() => {
          dispatch(setUnLocking());
          if (currentPassword === process.env.REACT_APP_MASTER_RESET) {
            //service mode
            resetBoxState();
            dispatch(setService());
          } else if (currentPassword === stringDecrypt) {
            resetBoxState();
            Cookies.remove(process.env.REACT_APP_COOKIE);
            dispatch(setAsyncUnLocked());
          } else {
            dispatch(setError());
            resetBoxState();
          }
        }, INPUT_SUBMIT_TIME);
      }
    }

    idleTimer.current = setTimeout(() => {
      dispatch(setInactive());
    }, IDLE_SCREEN_TIME);
  }, [boxState]);

  useEffect(() => {
    if (service_mode && boxState?.length > 1 && submit) {
      let fixedVal = boxState.join();
      fixedVal = fixedVal.replace(/,/g, "");
      fetch(
        `https://9w4qucosgf.execute-api.eu-central-1.amazonaws.com/default/CR-JS_team_M02a?code=${fixedVal}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.sn === SERIAL_NUMBER) {
            Cookies.remove(process.env.REACT_APP_COOKIE);
            resetBoxState();
            dispatch(setAsyncUnLocked());
          } else {
            resetBoxState();
            dispatch(setError());
          }
        });
    }

    if (service_mode) {
      setInputTimer();
    }
    return () => {
      clearLockTimer();
    };
  }, [service_mode, boxState, submit]);

  const handleClick = (value) => {
    clearIdleTimer();
    clearLockTimer();
    if (boxState?.length > 5 && !service_mode) {
      return;
    }

    if (service_mode && boxState?.length > 15) {
      return;
    }

    if (service_mode) {
      setInputTimer();
    }

    if (!active) {
      dispatch(setActive());
    }

    setBoxState((prevState) => [...prevState, value]);
  };

  const handleLock = () => {
    if (boxState?.length > 5 && !service_mode) {
      dispatch(preventType());
    }
    clearIdleTimer();
    setInputTimer();
  };

  const resetBoxState = () => {
    setBoxState((prevState) => []);
  };

  const clearLockTimer = () => {
    clearTimeout(lockTimer.current);
    setSubmit(false);
  };

  const clearIdleTimer = () => {
    clearTimeout(idleTimer.current);
  };

  const setInputTimer = () => {
    lockTimer.current = setTimeout(() => {
      setSubmit(true);
    }, INPUT_SUBMIT_TIME);
  };

  return (
    <div className="safe-container">
      <Screen
        message={boxState.length < 1 ? status : boxState}
        status={locked}
        active={active}
      />
      <div className="btn-box">
        {Buttons.map((btn, i) => (
          <Button
            value={btn.val}
            key={i + `_key`}
            icon={btn?.icon}
            handleClick={handleClick}
            handleLock={handleLock}
            service_mode={service_mode}
            locking={locking}
            locked={locked}
          />
        ))}
      </div>
      <SerialNumber />
    </div>
  );
};

const SerialNumber = () => {
  return <div>S/N : {SERIAL_NUMBER}</div>;
};

function mapStateToProps(state) {
  const { active, status, locked, service_mode, locking } = state.box;
  return { active, status, locked, service_mode, locking };
}

export default connect(mapStateToProps, null)(BoxContainer);
