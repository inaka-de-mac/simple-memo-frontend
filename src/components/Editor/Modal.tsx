import React from "react";
import ReactModal, { Props } from "react-modal";

// Modal setting.
const modalStyles = {
  overlay: {
    zIndex: 10000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "600px", // TODO: SP対応r
    marginRight: "-50%",
    padding: "2rem",
    transform: "translate(-50%, -50%)",
    border: "0.2rem solid var(--gray03)",
    borderRadius: "0.4rem",
  },
};

ReactModal.setAppElement("#root");

export function Modal(props: Props) {
  const { style, ...rest } = props;

  return (
    <ReactModal style={{ ...modalStyles, ...style }} {...rest}>
      {props.children}
    </ReactModal>
  );
}
