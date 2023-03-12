import { useContext } from "react";
import { AppContext } from "../AppContext";

export function About() {
  const [{ types }] = useContext(AppContext);

  return (
    <>
      <h3 className="title">How it works?</h3>
      <p className="description">
        <span className="icon-rock">{types["rock"].icon}</span>,{" "}
        <span className="icon-paper">{types["paper"].icon}</span>, and{" "}
        <span className="icon-scissors">{types["scissors"].icon}</span> icons
        are rendered and move randomly across the screen. When two icons meet,
        they change according to the rules of the animation:
      </p>

      <ol>
        <li>
          <span className="icon-paper">{types["paper"].icon}</span> wins
          <span className="icon-rock">{types["rock"].icon}</span>
        </li>
        <li>
          <span className="icon-rock">{types["rock"].icon}</span> wins
          <span className="icon-scissors">{types["scissors"].icon}</span>
        </li>
        <li>
          <span className="icon-scissors">{types["scissors"].icon}</span> wins
          <span className="icon-paper">{types["paper"].icon}</span>
        </li>
      </ol>
    </>
  );
}
