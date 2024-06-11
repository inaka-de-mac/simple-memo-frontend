export interface Memo {
  id: number;
  content: string;
  createdAt: string; // 日付文字列として扱う場合
  updatedAt: string; // 日付文字列として扱う場合
}

export interface MemoTableProps {
  currentMemos: Memo[];
  handleRowClick: (tableId: number) => void;
  handleMemoUpdate: (targetMemo: Memo) => void;
  handleKeyDown: (e: React.KeyboardEvent, targetMemo: Memo, tableId: number) => void;
  handleMemoDelete: (id: number) => void;
  handleMemoEdit: (e: React.ChangeEvent<HTMLTextAreaElement>, id: number) => void;
  textareaRefs: React.MutableRefObject<HTMLTextAreaElement[]>;
}

export interface NewMemoRowProps {
  newMemo: Memo;
  handleRowClick: (tableId: number) => void;
  currentMemos: Memo[];
  setNewMemo: React.Dispatch<React.SetStateAction<Memo>>;
  handleMemoUpdate: (targetMemo: Memo) => void;
  handleKeyDown: (e: React.KeyboardEvent, targetMemo: Memo, tableId: number) => void;
  textareaRefs: React.MutableRefObject<HTMLTextAreaElement[]>;
}

export interface MemoRowProps {
  memo: Memo;
  tableId: number;
  handleRowClick: (tableId: number) => void;
  handleMemoUpdate: (targetMemo: Memo) => void;
  handleKeyDown: (e: React.KeyboardEvent, targetMemo: Memo, tableId: number) => void;
  handleMemoDelete: (id: number) => void;
  handleMemoEdit: (e: React.ChangeEvent<HTMLTextAreaElement>, id: number) => void;
  textareaRefs: React.MutableRefObject<HTMLTextAreaElement[]>;
}