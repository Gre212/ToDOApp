清書は最後に行う



## Express

開発環境
起動方法
`node index.js` でExpressで処理書いたファイルを実行。localhost:3001がフォワードされてるので動く。

## React
`npx create-react-app . --template typescript` でSPA環境作った。

## DynamoDB
DynamoDB-Localを用いて開発。
コンテナ内でawsコマンド実行にあたりクレデンシャル（ダミーでOK）が必要になるため配置。
Expressとはネットワークを共有しているので　`http://dynamodb-local:8000` でアクセスできる

## 参考URL
[React + Express + Docker の環境構築 - Qiita](https://qiita.com/ykdoi/items/488f73c4eb22dd0a066b)
[Node.jsからDynamoDBのテーブルの作成・削除と行追加・読み取り - Qiita](https://qiita.com/kter/items/0cfaf377792ed544ca5d)
[DynamoDB localの読み書きをNode.jsで行う](https://zenn.dev/satokazur222/articles/1b355b5979566a)
