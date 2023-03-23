import { useContext } from "react";
import { AppContext } from "../AppContext";
import { Type } from "./Canvas";

function RenderType({ type }: { type: Type }) {
  return type?.img ? (
    <img className="img-border-radius" src={type.img.src} alt="" width={20} />
  ) : (
    <span>{type.icon}</span>
  );
}

export function About() {
  const [{ types }] = useContext(AppContext);

  return (
    <>
      <h3 className="title">How it works?</h3>
      <p className="description">
        <span className="icon-rock">
          <RenderType type={types["rock"]} />
        </span>
        ,{" "}
        <span className="icon-paper">
          <RenderType type={types["paper"]} />
        </span>
        , and{" "}
        <span className="icon-scissors">
          <RenderType type={types["scissors"]} />
        </span>{" "}
        icons are rendered and move randomly across the screen. When two icons
        meet, they change according to the rules of the animation:
      </p>

      <ol>
        <li>
          <span className="icon-paper">
            <RenderType type={types["paper"]} />
          </span>{" "}
          wins{" "}
          <span className="icon-rock">
            <RenderType type={types["rock"]} />
          </span>
        </li>
        <li>
          <span className="icon-rock">
            <RenderType type={types["rock"]} />
          </span>{" "}
          wins{" "}
          <span className="icon-scissors">
            <RenderType type={types["scissors"]} />
          </span>
        </li>
        <li>
          <span className="icon-scissors">
            <RenderType type={types["scissors"]} />
          </span>{" "}
          wins{" "}
          <span className="icon-paper">
            <RenderType type={types["paper"]} />
          </span>
        </li>
      </ol>
    </>
  );
}
