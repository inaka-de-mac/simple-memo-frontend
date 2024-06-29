import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MemoContainer from "../components/Main/MemoContainer/MemoContainer";

// モックデータ
const mockMemos = [
  {
    id: 1,
    content: "Memo 1",
    createdAt: "2024-06-07T07:46:36",
    updatedAt: "2024-06-11T17:12:36",
  },
  {
    id: 2,
    content: "Memo 2",
    createdAt: "2024-06-07T08:02:53",
    updatedAt: "2024-06-10T20:07:43",
  },
];

describe("MemoContainer", () => {
  beforeEach(() => render(<MemoContainer />)); // 各テスト実行前にレンダリングを実行

  // MemoContainerコンポーネントがレンダリングされているかを確認
  test("renders MemoContainer", () => {
    const memoContainer = screen.getByTestId("memo-container");
    expect(memoContainer).toBeInTheDocument();
  });

  // // NewMemoRowコンポーネントがレンダリングされているかを確認
  // test("renders NewMemoRow", () => {
  //   const newMemoRow = screen.getByTestId("new-memo-row");
  //   expect(newMemoRow).toBeInTheDocument();
  // });

  // // NewMemoRowを押下したら対象のテキストエリアがfocusされるかを確認
  // test("click NewMemoRow", () => {
  //   const newMemoRow = screen.getByTestId("new-memo-row");
  //   newMemoRow.click();
  //   const textarea = screen.getByTestId("new-memo-textarea");
  //   expect(textarea).toHaveFocus();
  // });

  // // テキストエリアに入力したらstateに反映されるかを確認
  // test("input NewMemoRow", () => {
  //   const newMemoRow = screen.getByTestId("new-memo-row");
  //   newMemoRow.click();
  //   const textarea = screen.getByTestId("new-memo-textarea");
  //   fireEvent.change(textarea, { target: { value: "New memo content" } });
  //   expect(textarea.value).toBe("New memo content");
  // });
});
