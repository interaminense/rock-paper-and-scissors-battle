import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../AppContext";
import { Animation } from "../classes/animation";

export const CIRCLE_SIZE = 15;
export const CIRCLE_TOTAL = 30;
export const ENABLE_COLLISION = true;
export const ENABLE_STROKE = false;
export const SPEED = 2;
export const TYPES = {
  rock: { name: "rock", icon: "🪨" },
  paper: { name: "paper", icon: "📰" },
  scissors: { name: "scissors", icon: "✂️" },
};

export function Canvas() {
  const [{ recorder }, dispatch] = useContext(AppContext);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // @ts-ignore
      const recorder = new CanvasRecorder(canvasRef.current);

      dispatch({ type: "set_recorder", payload: recorder });
    }
  }, [dispatch]);

  useEffect(() => {
    if (canvasRef.current) {
      const animation = new Animation({
        onFinish: () => {
          dispatch({ type: "start", payload: false });

          setTimeout(() => {
            recorder.stop(function (blob: Blob) {
              dispatch({
                type: "set_video_src",
                payload: URL.createObjectURL(blob),
              });
            });
          }, 2000);
        },
        canvas: canvasRef.current,
        circleSize: CIRCLE_SIZE,
        circleTotal: CIRCLE_TOTAL,
        enableCollision: ENABLE_COLLISION,
        enableStroke: ENABLE_STROKE,
        speed: SPEED,
        types: TYPES,
      });

      dispatch({
        type: "set_animation",
        payload: animation,
      });
    }
  }, [dispatch, recorder]);

  return <canvas id="canvas" ref={canvasRef} width="500" height="700" />;
}
