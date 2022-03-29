export declare interface Task {
  Id: string | null,
  Title: string,
  Content: string,
  Limit: string, // TODO: "yyyy-mm-dd" の形式に制限する
  State: string, // TODO: 受け入れるステータスは定義済みのもののみなので制限する
  CreatedAt: string
}

