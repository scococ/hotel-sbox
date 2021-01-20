import * as t from "../../constants/constants";
import { LOCKING_TIME } from "../../constants/constants";

export const setInactive = () => ({
  type: t.SET_INACTIVE,
});

export const setActive = () => ({
  type: t.SET_ACTIVE,
});

export const setLocked = () => ({
  type: t.LOCKED_STATUS,
});

export function setLockedAsync() {
  return (dispatch) => {
    setTimeout(function () {
      dispatch(setLocked());
    }, LOCKING_TIME);
  };
}

export const setUnLocked = () => ({
  type: t.UNLOCKED_STATUS,
});

export function setAsyncUnLocked() {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(setUnLocked());
    }, LOCKING_TIME);
  };
}

export const setError = () => ({
  type: t.ERROR_STATUS,
});

export const setReady = () => ({
  type: t.READY_STATUS,
});

export const setLocking = () => ({
  type: t.LOCKING_STATUS,
});

export const preventType = () => ({
  type: t.PREVENT_TYPE,
});

export function setAsyncLocking() {
  return (dispatch) => {
    dispatch(setLocking());
    setTimeout(() => {
      dispatch(setLocked());
    }, LOCKING_TIME);
  };
}

export const setTEST = () => ({
  type: t.TEST,
});

export const setUnLocking = () => ({
  type: t.UNLOCKING_STATUS,
});

export const setService = () => ({
  type: t.SERVICE_STATUS,
});

export const setValidating = () => ({
  type: t.VALIDATING_STATUS,
});
