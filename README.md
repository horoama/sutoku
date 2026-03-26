# Sutoku

家族で共有できる買い物リストおよび冷蔵庫（食材の消費期限）管理を行うスマホアプリ（MVPバージョン）です。

## 機能
* **買い物リスト**: アイテムの追加、優先度（今日/いつか）設定、メモの記述。「長押し」でアイテムを仮想冷蔵庫へ移動。
* **冷蔵庫・食糧庫管理**: 食材ごとの期限を管理し、期限間近のものを色分けして表示。現在庫を使ったレシピのGoogle検索。
* **購入履歴**: 過去の購入履歴を月ごとにグループ化して表示（消費ペースの確認）。
* **チャット機能**: 家族間で買い物依頼（「2つ買ってきて」など）ができるメッセージ機能。

## 技術スタック
* **フロントエンド**: Expo (React Native Web/iOS/Android), Zustand, Axios
* **バックエンド**: Node.js, Express, Prisma, SQLite

## ローカル開発環境の立ち上げ

Docker と Docker Compose を使用して、手元の環境で簡単に起動できます。

1. **Docker Compose の起動**
   ```bash
   docker-compose up -d --build
   ```

   *プロキシ環境下の場合は、あらかじめ環境変数を設定して起動してください。*
   ```bash
   export HTTP_PROXY="http://your.proxy.address:port"
   export HTTPS_PROXY="http://your.proxy.address:port"
   export NO_PROXY="localhost,127.0.0.1"
   docker-compose build --build-arg http_proxy=$HTTP_PROXY --build-arg https_proxy=$HTTPS_PROXY
   docker-compose up -d
   ```

2. **アプリへのアクセス**
   - **フロントエンド (Expo Web)**: http://localhost:8081
   - **バックエンド API**: http://localhost:3000

   *※ 初期データ（ユーザー・家族グループ・アイテム）は、フロントエンド起動時に自動的に設定または取得されます。*

## データベースのリセットやマイグレーションが必要な場合
バックエンドのコンテナに入り、Prismaコマンドを実行してください。

```bash
docker-compose exec backend npx prisma db push
docker-compose exec backend npm run seed
```
