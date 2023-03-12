import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppContext } from "../AppContext";
import {
  CIRCLE_SIZE,
  CIRCLE_TOTAL,
  ENABLE_COLLISION,
  ENABLE_STROKE,
  SPEED,
  TYPES,
} from "./Canvas";
import { createPopup } from "@picmo/popup-picker";

const usePopup = (
  refContainer: React.MutableRefObject<null>,
  refBtn: React.MutableRefObject<null>
) => {
  return useMemo(() => {
    if (refContainer?.current && refBtn?.current) {
      return createPopup(
        {},
        {
          position: "top-start",
          triggerElement: refBtn.current,
          referenceElement: refContainer.current,
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refBtn.current, refContainer.current]);
};

export function AnimationManager() {
  const [{ types }, dispatch] = useContext(AppContext);
  const refPickerContainer = useRef(null);
  const refBtnA = useRef(null);
  const refBtnB = useRef(null);
  const refBtnC = useRef(null);

  const [{ animation }] = useContext(AppContext);
  const [size, setSize] = useState(CIRCLE_SIZE);
  const [total, setTotal] = useState(CIRCLE_TOTAL);
  const [speed, setSpeed] = useState(SPEED);
  const [enableCollision, setEnableCollision] = useState(ENABLE_COLLISION);
  const [enableStroke, setEnableStoke] = useState(ENABLE_STROKE);

  const popupA = usePopup(refPickerContainer, refBtnA);
  const popupB = usePopup(refPickerContainer, refBtnB);
  const popupC = usePopup(refPickerContainer, refBtnC);

  useEffect(() => {
    function selectIcon(event: any, key: keyof typeof TYPES) {
      const newTypes = {
        ...types,
        [key]: { ...types[key], icon: event.emoji },
      };

      dispatch({ type: "set_types", payload: newTypes });
      animation?.updateProps("types", newTypes);
    }

    popupA?.addEventListener("emoji:select", (event: any) =>
      selectIcon(event, "rock")
    );
    popupB?.addEventListener("emoji:select", (event: any) =>
      selectIcon(event, "paper")
    );
    popupC?.addEventListener("emoji:select", (event: any) =>
      selectIcon(event, "scissors")
    );

    return () => {
      popupA?.removeEventListener("emoji:select", (event: any) =>
        selectIcon(event, "rock")
      );
      popupB?.addEventListener("emoji:select", (event: any) =>
        selectIcon(event, "paper")
      );
      popupC?.addEventListener("emoji:select", (event: any) =>
        selectIcon(event, "scissors")
      );
    };
  }, [animation, dispatch, popupA, popupB, popupC, types]);

  return (
    <>
      <h3 className="title">Controls</h3>

      <div ref={refPickerContainer} />

      <div className="mb-2">
        <button
          onClick={() => {
            popupA?.open();
            popupB?.close();
            popupC?.close();
          }}
          ref={refBtnA}
          type="button"
          className="btn mb-2"
        >
          {types["rock"].icon}
        </button>
        <button
          onClick={() => {
            popupB?.open();
            popupA?.close();
            popupC?.close();
          }}
          ref={refBtnB}
          type="button"
          className="btn mb-2"
        >
          {types["paper"].icon}
        </button>
        <button
          onClick={() => {
            popupC?.open();
            popupA?.close();
            popupB?.close();
          }}
          ref={refBtnC}
          type="button"
          className="btn mb-2"
        >
          {types["scissors"].icon}
        </button>
      </div>

      <div className="mb-2">
        <label htmlFor="circleSize">circle size</label>
        <div>
          <input
            id="circleSize"
            max="30"
            min="5"
            name="circleSize"
            onChange={(event) => {
              const newValue = Number(event.target.value);

              setSize(newValue);
              animation?.updateProps("circleSize", newValue);
            }}
            type="range"
            value={size}
          />
        </div>
      </div>

      <div className="mb-2">
        <div>
          <label htmlFor="circleTotal">total circles</label>
        </div>
        <input
          id="circleTotal"
          max="300"
          min="3"
          name="circleTotal"
          onChange={(event) => {
            const newValue = Number(event.target.value);

            setTotal(newValue);
            animation?.updateProps("circleTotal", newValue);
          }}
          step="3"
          type="range"
          value={total}
        />
      </div>

      <div className="mb-2">
        <div>
          <label htmlFor="speed">speed</label>
        </div>
        <input
          id="speed"
          max="10"
          min="1"
          name="speed"
          onChange={(event) => {
            const newValue = Number(event.target.value);

            setSpeed(newValue);
            animation?.updateProps("speed", newValue);
          }}
          type="range"
          value={speed}
        />
      </div>

      <div className="mb-2">
        <input
          onChange={(event) => {
            const newValue = event.target.checked;

            setEnableCollision(newValue);
            animation?.updateProps("enableCollision", newValue);
          }}
          type="checkbox"
          checked={enableCollision}
        />

        <label htmlFor="enableCollision">enable collision</label>
      </div>

      <div className="mb-2">
        <input
          onChange={(event) => {
            const newValue = event.target.checked;

            setEnableStoke(newValue);
            animation?.updateProps("enableStroke", newValue);
          }}
          type="checkbox"
          checked={enableStroke}
        />

        <label htmlFor="enableStroke">enable circle stroke</label>
      </div>
    </>
  );
}
