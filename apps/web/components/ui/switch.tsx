"use client";

import { InputHTMLAttributes } from "react";

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

export function Switch({ className, label, id, ...props }: SwitchProps) {
  const inputId = id ?? props.name;
  return (
    <label className="switch">
      <input id={inputId} type="checkbox" className="switch-input" {...props} />
      <span className={cx("switch-track", className)} />
      {label ? <span className="switch-label">{label}</span> : null}
    </label>
  );
}
