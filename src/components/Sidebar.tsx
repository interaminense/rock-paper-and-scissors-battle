import React from "react";

interface ISidebarProps extends React.HTMLAttributes<HTMLElement> {
  side: "left" | "right";
}

export function Sidebar({ children, side }: ISidebarProps) {
  return <div className={`${side}-sidebar`}>{children}</div>;
}
