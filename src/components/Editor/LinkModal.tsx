import React from "react";
import ReactModal from "react-modal";
import { Modal } from "./Modal";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import AddLinkIcon from "@mui/icons-material/AddLink";

interface IProps extends ReactModal.Props {
  url: string;
  closeModal: () => void;
  onChangeUrl: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveLink: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemoveLink: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function LinkModal(props: IProps) {
  const { url, closeModal, onChangeUrl, onSaveLink, onRemoveLink, ...rest } =
    props;
  return (
    <Modal {...rest} className="link-modal">
      <h2 className="link-modal__title">リンクを編集</h2>
      <input
        className="common__form common__form--input"
        name="url"
        type="text"
        placeholder="リンクを入力"
        value={url}
        onChange={onChangeUrl}
      />
      <div className="link-modal__button-box">
        <button
          className="common__form common__form--button link-modal__button link-modal__button--delete"
          onClick={onRemoveLink}
        >
          <LinkOffIcon />
          <p>リンクを削除する</p>
        </button>
        <button
          className="common__form common__form--button link-modal__button modal__button--cancel"
          onClick={onSaveLink}
        >
          <AddLinkIcon />
          <p>リンクを保存する</p>
        </button>
      </div>
    </Modal>
  );
}
