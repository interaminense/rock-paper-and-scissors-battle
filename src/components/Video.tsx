import { useContext } from "react";
import { AppContext } from "../AppContext";

export function Video() {
  const [{ videoSrc }] = useContext(AppContext);

  return (
    <video src={videoSrc} width="100%" controls>
      Your browser does not support the video tag.
    </video>
  );
}
