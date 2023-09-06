import React from "react";

type SwitchInputProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  status: boolean;
  title: string;
  onChange: (data: boolean) => void;
};

const Switch = ({ status, title, onChange }: SwitchInputProps) => {
  return (
    <div
      className="d-flex justify-content-start align-items-center"
      style={{ gap: 8 }}
    >
      <label className="switch ">
        <input
          type="checkbox"
          className="default"
          checked={status}
          onChange={(e: any) => onChange(e.target.checked)}
        />
        <span className="slider round"></span>
      </label>
      <span className="font-weight-bold">{title}</span>
    </div>
  );
};

export default Switch;
