import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";

// Tiptap packages
import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import Placeholder from "@tiptap/extension-placeholder";

// カスタム
import { LinkModal } from "./LinkModal";
import { Memo } from "../../Types";
import { useMemoContext } from "../../context/MemoContext";
import { Tooltip } from "@mui/material";
import IconTooltip from "./IconTooltop";

interface EditorProps {
  currentMemo: Memo;
  setCurrentMemo: React.Dispatch<React.SetStateAction<Memo>>;
}

const PopupEditor: React.VFC<EditorProps> = ({
  currentMemo,
  setCurrentMemo,
}) => {
  const { setEditingMemoId, handleUpdateMemo } = useMemoContext();
  // 実装するエディタの設定
  const editor = useEditor({
    // エディタ機能の設定
    extensions: [
      Document,
      History,
      Paragraph,
      Text,
      Link.configure({
        openOnClick: false,
      }),
      Bold,
      Underline,
      Strike,
      Code,
      Placeholder.configure({
        placeholder: "Enter Content", // プレースホルダーテキストを設定
      }),
    ],
    // エディタの初期内容
    content: currentMemo.content,
    // 更新処理の設定
    onUpdate: ({ editor }) => {
      setCurrentMemo({ ...currentMemo, content: editor.getHTML() });
    },
    // Blur時の処理
    onBlur: () => {
      handleUpdateMemo(currentMemo);
      setEditingMemoId(-1);
    },
  }) as Editor;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState<string>("");

  const openModal = useCallback(() => {
    setUrl(editor.getAttributes("link").href);
    setIsOpen(true);
  }, [editor]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setUrl("");
  }, []);

  const saveLink = useCallback(() => {
    console.log(url);
    // urlに値が入ってる場合はリンクを設定
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run(); // chainで設定したコマンドを実行
    } else {
      // urlに値が入ってない場合はリンクを削除
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    editor.commands.blur();
    closeModal();
  }, [editor, url, closeModal]);

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    closeModal();
  }, [editor, closeModal]);

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="editor editor-mini">
      {/* 文字列選択時に表示されるメニュー */}
      <BubbleMenu
        pluginKey="bubbleMenuText"
        className="editor__bubble-menu"
        tippyOptions={{ duration: 150, placement: "top" }}
        editor={editor}
        shouldShow={({ editor, view, state, oldState, from, to }) => {
          return from !== to;
        }}
      >
        <button
          className={classNames("editor__button editor__button--icon", {
            "is-active": editor.isActive("link"),
          })}
          onClick={openModal}
        >
          <IconTooltip title="リンク">
            <LinkIcon />
          </IconTooltip>
        </button>
        <button
          className={classNames("editor__button editor__button--icon", {
            "is-active": editor.isActive("bold"),
          })}
          onClick={toggleBold}
        >
          <IconTooltip title="太字">
            <FormatBoldIcon />
          </IconTooltip>
        </button>
        <button
          className={classNames("editor__button editor__button--icon", {
            "is-active": editor.isActive("underline"),
          })}
          onClick={toggleUnderline}
        >
          <IconTooltip title="下線">
            <FormatUnderlinedIcon />
          </IconTooltip>
        </button>
        <button
          className={classNames("editor__button editor__button--icon", {
            "is-active": editor.isActive("strike"),
          })}
          onClick={toggleStrike}
        >
          <IconTooltip title="取り消し線">
            <StrikethroughSIcon />
          </IconTooltip>
        </button>
        <button
          className={classNames("editor__button editor__button--icon", {
            "is-active": editor.isActive("code"),
          })}
          onClick={toggleCode}
        >
          <IconTooltip title="コード">
            <CodeIcon />
          </IconTooltip>
        </button>
      </BubbleMenu>

      {/* リンク選択時に表示されるメニュー */}
      <BubbleMenu
        pluginKey="bubbleMenuLink"
        className="editor__bubble-menu"
        tippyOptions={{ duration: 150, placement: "bottom" }}
        editor={editor}
        shouldShow={({ editor, view, state, oldState, from, to }) => {
          return from === to && editor.isActive("link");
        }}
      >
        <button
          className="editor__button editor__button--icon"
          onClick={openModal}
        >
          <IconTooltip title="編集">
            <EditIcon />
          </IconTooltip>
        </button>
        <button
          className="editor__button editor__button--icon"
          onClick={() => window.open(editor.getAttributes("link").href)}
        >
          <IconTooltip title="開く">
            <OpenInNewIcon />
          </IconTooltip>
        </button>
      </BubbleMenu>

      {/* エディタ本体 */}
      <EditorContent editor={editor} />

      <LinkModal
        url={url}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Link Modal"
        closeModal={closeModal}
        onChangeUrl={(e) => setUrl(e.target.value)}
        onSaveLink={saveLink}
        onRemoveLink={removeLink}
      />
    </div>
  );
};

export default PopupEditor;
