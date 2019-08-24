import React from "react";
import cn from "classnames";

interface Props {
  image: string;
  loading?: boolean;
}

export const Stikker: React.FunctionComponent<Props> = ({ image, loading }) => (
  <div className={cn(["stikker", loading && "stikker--loading"])}>
    <img src={image} className="stikker__image" />
    {!!loading && <div className="stikker__loader">Loading…</div>}
  </div>
);
