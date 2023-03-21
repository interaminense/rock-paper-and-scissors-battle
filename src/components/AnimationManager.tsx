import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppContext } from "../AppContext";
import {
  CIRCLE_SIZE,
  CIRCLE_TOTAL,
  ENABLE_COLLISION,
  ENABLE_STROKE,
  SPEED,
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

interface IBtnIconProps extends React.HTMLAttributes<HTMLElement> {
  type: {
    name: string;
    icon: string;
    img?: HTMLImageElement;
  };
}

const BtnIcon: React.FC<IBtnIconProps> = ({ onClick, type }) => {
  return (
    <button onClick={onClick} type="button" className="btn mb-2">
      {type?.img ? (
        <img src={type.img.src} alt="" width={20} height={15} />
      ) : (
        type.icon
      )}
    </button>
  );
};

export function AnimationManager() {
  const [{ types }, dispatch] = useContext(AppContext);
  const refPickerContainer = useRef(null);
  const popupRef = useRef(null);

  const [{ animation }] = useContext(AppContext);
  const [size, setSize] = useState(CIRCLE_SIZE);
  const [total, setTotal] = useState(CIRCLE_TOTAL);
  const [speed, setSpeed] = useState(SPEED);
  const [enableCollision, setEnableCollision] = useState(ENABLE_COLLISION);
  const [enableStroke, setEnableStoke] = useState(ENABLE_STROKE);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [btnClicked, setBtnClicked] = useState<string>("rock");

  const popup = usePopup(refPickerContainer, popupRef);

  useEffect(() => {
    function selectIcon(event: any, key: string) {
      const newTypes = {
        ...types,
        [key]: { ...types[key], icon: event.emoji },
      };

      delete newTypes[key]?.img;

      dispatch({ type: "set_types", payload: newTypes });
      animation?.updateProps("types", newTypes);
    }

    popup?.addEventListener("emoji:select", (event: any) =>
      selectIcon(event, btnClicked)
    );

    return () => {
      popup?.removeEventListener("emoji:select", (event: any) =>
        selectIcon(event, btnClicked)
      );
    };
  }, [animation, btnClicked, dispatch, popup, types]);

  return (
    <>
      <h3>Controls</h3>

      <div ref={refPickerContainer} />

      <div className="mb-2">
        <BtnIcon
          type={types["rock"]}
          onClick={() => {
            setIsOpenDropdown((isOpenDropdown) => !isOpenDropdown);
            setBtnClicked("rock");
          }}
        />

        <BtnIcon
          type={types["paper"]}
          onClick={() => {
            setIsOpenDropdown((isOpenDropdown) => !isOpenDropdown);
            setBtnClicked("paper");
          }}
        />

        <BtnIcon
          type={types["scissors"]}
          onClick={() => {
            setIsOpenDropdown((isOpenDropdown) => !isOpenDropdown);
            setBtnClicked("scissors");
          }}
        />
      </div>

      <div
        style={{ display: isOpenDropdown ? "block" : "none" }}
        className="dropdown"
      >
        <button
          className="btn"
          ref={popupRef}
          key="icon"
          onClick={() => {
            setIsOpenDropdown(false);
            popup?.open();
          }}
        >
          {"select an icon"}
        </button>
        <div key="image">
          <input
            className="btn"
            accept=".jpg, .jpeg, .gif, .png"
            type="file"
            onChange={(event) => {
              setIsOpenDropdown(false);

              if (event?.target?.files) {
                const img = new Image();
                img.src = URL.createObjectURL(event.target.files[0]);

                img.onload = () => {
                  const newTypes = {
                    ...types,
                    [btnClicked]: { ...types[btnClicked], img },
                  };

                  dispatch({ type: "set_types", payload: newTypes });
                  animation?.updateProps("types", newTypes);
                };
              }
            }}
          />
        </div>
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
