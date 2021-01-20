import {
  ERROR_STATUS,
  LOCKED_STATUS,
  LOCKING_STATUS,
  READY_STATUS,
  SERVICE_STATUS,
  SET_ACTIVE,
  SET_INACTIVE,
  UNLOCKED_STATUS,
  UNLOCKING_STATUS,
  VALIDATING_STATUS,
  TEST,
  PREVENT_TYPE,
} from "../../constants/constants";
import Cookies from "js-cookie";

let isLocked;
try {
  isLocked = Cookies.get(process.env.REACT_APP_COOKIE);
} catch (e) {
  console.log(e);
}

const initialState = {
  active: true,
  status: "Ready",
  locked: isLocked ? true : false,
  locking: false,
  service_mode: false,
};

export function box(state = initialState, action) {
  console.log(action.type, "TYPEEEE", state.status);
  switch (action.type) {
    case LOCKED_STATUS:
      return { ...state, locked: true, status: "", locking: false };

    case UNLOCKED_STATUS:
      return {
        ...state,
        locked: false,
        status: "Ready",
        service_mode: false,
        locking: false,
      };

    case ERROR_STATUS:
      return { ...state, status: "Error", locking: false };

    case PREVENT_TYPE:
      return { ...state, locking: true };

    case READY_STATUS:
      return { ...state, status: "Ready" };

    case LOCKING_STATUS:
      return { ...state, status: "Locking", locking: true };
    case UNLOCKING_STATUS:
      return { ...state, status: "Unlocking", locking: true };

    case SERVICE_STATUS:
      return {
        ...state,
        status: "Service",
        service_mode: true,
        locking: false,
      };
    case VALIDATING_STATUS:
      return { ...state, status: "Validating" };
    case SET_ACTIVE:
      return { ...state, active: true };

    case SET_INACTIVE:
      return { ...state, active: false };
    case TEST:
      return { ...state, status: "TEST" };
    default:
      return state;
  }
}
