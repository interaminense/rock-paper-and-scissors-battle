import React from "react";

export function Container({ children }: React.HTMLAttributes<HTMLElement>) {
  return <div className="container">{children}</div>;
}
