# ToDo App

仕様技術
* バックエンド：Express（TypeScript）
  * 構成管理：ServerlessFramework
* フロントエンド：React（TypeScript）
  * UIフレームワーク：MUI
* データベース：DynamoDB

想定稼働環境
* Express：Lambda + API Gateway
* React：Vercel

動作確認バージョン
* NodeJS: v14.x
* npm: 8.6.x

## APIリファレンス
[Todo API - Swagger UI](https://gre212.github.io/ToDO/dist/)

## バックエンド

### 開発方法
Serverless-offline を用いて開発

```bash
$ cd backend
$ npm install
$ cp .env.example .env.dev # ステージごとに .env.{stage} を作成
$ vi .env.dev #必要な情報を入力する
```

```bash
$ npx sls dynamodb install
$ npm run offline-start

...

   ┌───────────────────────────────────────────────────────────────────────────┐
   │                                                                           │
   │   ANY | http://localhost:3000/dev                                         │
   │   POST | http://localhost:3000/2015-03-31/functions/express/invocations   │
   │   ANY | http://localhost:3000/dev/{proxy*}                                │
   │   POST | http://localhost:3000/2015-03-31/functions/express/invocations   │
   │                                                                           │
   └───────────────────────────────────────────────────────────────────────────┘

Server ready: http://localhost:3000 🚀
```

上記コマンド実行でローカルにエンドポイントが作られる

### デプロイ方法

ServerlessFrameworkを使ってデプロイ

```bash
# 事前準備：AWSのアクセスキーを登録する
$ serverless config credentials --provider aws --key <ACCESS_KEY> --secret <SEACRET_KEY>

# デプロイ
## ステージ `dev` へデプロイ
$ npm run deploy:dev

## ステージ `v1` へデプロイ
$ npm run deploy:v1
```

## React

### 開発方法

```bash
$ cd frontend
$ npm install
$ cp .env.example .env # 必要な情報を入力する
$ npm start
```

### デプロイ方法

Vercelにリポジトリを登録済みのため、  
masterにpushすることでデプロイが走る

## 設計のログ
[surabowさんのスクラップ一覧 | Zenn](https://zenn.dev/surabow?tab=scraps)
