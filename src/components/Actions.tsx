import { useCallback, useContext } from "react";
import { AppContext } from "../AppContext";

export function Actions() {
  const [{ recorder, start }, dispatch] = useContext(AppContext);

  const startAnimation = useCallback(() => {
    dispatch({ type: "start", payload: true });

    recorder.record();
  }, [dispatch, recorder]);

  const stopAnimation = useCallback(() => {
    dispatch({ type: "start", payload: false });

    setTimeout(() => {
      recorder.stop(function (blob: Blob) {
        dispatch({
          type: "set_video_src",
          payload: URL.createObjectURL(blob),
        });
      });
    }, 1000);
  }, [dispatch, recorder]);

  return (
    <>
      {!start && (
        <button className="btn btn-reset" onClick={() => startAnimation()}>
          start
        </button>
      )}
      {start && (
        <button className="btn btn-reset" onClick={() => stopAnimation()}>
          stop
        </button>
      )}
      <button
        className="btn btn-reset"
        onClick={() => {
          window.location.reload();
        }}
      >
        reset
      </button>
    </>
  );
}
