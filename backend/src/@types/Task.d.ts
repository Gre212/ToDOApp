export declare interface Task {
  id: string | null,
  title: string,
  content: string,
  limit: string, // TODO: "yyyy-mm-dd" の形式に制限する
  state: string // TODO: 受け入れるステータスは定義済みのもののみなので制限する
}

