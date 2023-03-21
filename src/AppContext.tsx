import { createContext, useReducer } from "react";
import { Animation } from "./classes/animation";
import { TYPES, Types } from "./components/Canvas";

interface IContext {
  animation?: Animation | null;
  start: boolean;
  types: Types;
  recorder: any;
  videoSrc: string;
}

interface IAction {
  type: string;
  payload: any;
}

interface IDispatch {
  (action: IAction): void;
}

const initialArg: IContext = {
  animation: null,
  start: false,
  types: TYPES,
  recorder: null,
  videoSrc: "",
};

export const AppContext = createContext<[IContext, IDispatch]>([
  initialArg,
  () => null,
]);

function reducer(state: IContext, action: IAction): IContext {
  if (action.type === "set_animation") {
    return {
      ...state,
      animation: action.payload,
    };
  }

  if (action.type === "start") {
    if (action.payload) {
      state.animation?.start();
    } else {
      state.animation?.stop();
    }

    return {
      ...state,
      start: action.payload,
    };
  }

  if (action.type === "set_types") {
    return {
      ...state,
      types: action.payload,
    };
  }

  if (action.type === "set_recorder") {
    return {
      ...state,
      recorder: action.payload,
    };
  }

  if (action.type === "set_video_src") {
    return {
      ...state,
      videoSrc: action.payload,
    };
  }

  throw Error("Unknown action.");
}

export function AppContextProvider({
  children,
}: React.HTMLAttributes<HTMLElement>) {
  const [state, dispatch] = useReducer(reducer, initialArg);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
}
