export interface Memo {
  id: number;
  content: string;
  createdAt: string; // 日付文字列として扱う場合
  updatedAt: string; // 日付文字列として扱う場合
}

// interface MemoTableProps 不要なので削除

// interface NewMemoRowProps 不要なので削除

export interface MemoRowProps {
  memo: Memo;
  tableId: number;
}
