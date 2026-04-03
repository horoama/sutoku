# プロジェクト開発およびAIエージェントへの指示 (AGENTS.md)

このドキュメントは、本プロジェクトの開発に参加するAIエージェントおよび開発者が遵守すべきルール、制約、ベストプラクティスをまとめたものです。

## 全体的なルールおよびAIエージェントへの指示

* **言語の指定**: プロジェクト内のドキュメント（JSDoc / GoDoc）、チャットでの応答、Pull Requestの作成など、ユーザーに向けたコミュニケーションや説明文は**必ず日本語**を使用してください。
* **ログファイル等の除外**: 開発中のログファイルや不要な一時ファイルなどはコミットしないでください。
* **デザインへの準拠と不要なコードの削除**: UIデザインを実装・更新する際は提供されたデザインリファレンスに厳密に従ってください。また、新しいデザインに存在しない既存の画面、UI要素、機能（例：古いチャット画面など）は積極的に削除してください。
* **モックの非推奨**: すべてのUIボタンやインタラクティブな要素は、モックデータや空のハンドラに頼らず、バックエンドAPIと完全に連携し機能するように実装してください。必要に応じてデータベースのモデルやAPIエンドポイントをプロアクティブに作成・更新してください。
* **ネットワーク制限の考慮**: 開発環境ではインターネットアクセスが制限されている場合があります（依存関係のダウンロード時に `ETIMEDOUT` が発生するなど）。依存関係がキャッシュされていない場合は、静的解析や手動のコードレビューによる検証を優先してください。

## プロジェクト構成

* プロジェクトは React Native (Expo) を使用したフロントエンドと、Go (Gin) を使用したバックエンドで構成されています。
* フロントエンドのディレクトリ: `frontend/`
* バックエンドのディレクトリ: `backend/`

## フロントエンドのルール

* **技術スタック**: TypeScript, Expo (React Native), Zustand (状態管理), Axios (API通信), React Navigation, NativeWind v4 (Tailwind CSS)
* **アイコン**: `@expo/vector-icons` を使用してください。Expoのクラッシュを引き起こすため、`react-native-vector-icons` は使用しないでください。
* **スタイリング**: NativeWind v4を使用しています。グローバルスタイルは `frontend/global.css` に定義され、`App.tsx` でインポートされます。
* **コード構造とドキュメント**:
  * コンポーネントの肥大化を防ぐため、UIコンポーネントは適切に分割・抽出してください。
  * Zustandのストアはドメインごとに分割し、型定義は `types/store.ts` のように一元管理してください。
  * すべての構造体、関数、コンポーネントに対して**日本語のJSDoc**を追加してください。
* **日付の計算**: 画面表示（期限など）のために日付の差分を `date-fns` で計算する場合は、24時間ごとのインターバル計算による1日ズレのバグを防ぐため、`differenceInDays` ではなく、**必ず `differenceInCalendarDays` を使用**してください。
* **パフォーマンス最適化**: 重いデータ変換処理（日付ごとのリストのグループ化など）は `useMemo` でラップしてください。また、コンポーネントの状態に依存しない静的なヘルパー関数は、不要な再生成を防ぐためコンポーネント定義の外に移動してください。
* **依存関係の競合解決**: React 19.2.0 と React Native のテストライブラリ間でピア依存関係の競合が発生した場合は、`--legacy-peer-deps` は使用せず、`package.json` の `overrides` を使用して解決してください（例: "react": "$react" をマッピングするなど）。`package-lock.json` への不必要な大量の変更を避けるためです。
* **サーバーの起動**: `cd frontend && npm start -- --web` または `npx expo start --web` を使用してください。

## バックエンドのルール

* **技術スタック**: Go 1.23, Gin (Webフレームワーク), GORM (ORM), SQLite (データベース)
* **コード構造とドキュメント**:
  * バックエンドのモデルとハンドラは、機能ごとに別々のファイルに分割してください（例: `user.go`, `item_handler.go`）。
  * すべての構造体や関数に対して**日本語のGoDoc**を追加してください。
* **Docker環境**: Alpineイメージや `apk` を使用せず、Debianベースのイメージ（例: `golang:1.23-bookworm`, `debian:bookworm-slim`）と `apt-get` を使用してください。また、`go-sqlite3` ビルド時の CGO/GCC コンパイラエラーを避けるため、必ず Go 1.23 を使用してください。
* **GORMとUUID**: データベースの挿入エラーを防ぐため、GORMのモデルには `BeforeCreate` フックを明示的に定義し、`ID` フィールドにUUID（例: `uuid.New().String()`）を自動生成して割り当てるようにしてください。
* **データベースのセットアップ**: ローカルの SQLite データベース（`dev.db`）を使用します。バックエンドサーバーの起動前に `backend/data` ディレクトリが存在している必要があります。`unable to open database file` エラーを防ぐため、事前に `mkdir -p backend/data` を実行してください。
* **サーバーの起動**: `cd backend && go run .`、または Docker Compose を経由して起動してください。

## テストとCIのルール

* **CI環境**: `.github/workflows/test.yml` に GitHub Actions ワークフローが設定されています。main / master ブランチへのPR作成時にバックエンド (`go test`) とフロントエンド (`npm test`) のテストが自動実行されます（Go 1.23, Node.js 20）。
* **網羅的なテスト**: バックエンド・フロントエンド問わず、テストを作成または更新する際は、正常系だけでなく**必ず異常系のテストケース**（不正なJSON形式、リソースが存在せず 404 が返るケースなど）を含め、適切なエラーハンドリングが行われているか検証してください。

### フロントエンドのテスト
* Jest と `jest-expo` を使用します。
* `ReferenceError: import outside of scope` を防ぐため、`NODE_OPTIONS=--experimental-vm-modules npm test` で実行してください。
* `jest.config.js` では `testEnvironment: 'node'` を設定し、必要なパッケージ（`zustand`, `nativewind`, `@react-native/.*` など）を `transformIgnorePatterns` に含めてください。
* モジュール解決エラー（`Cannot find module react-native-worklets/plugin` など）が発生した場合は、`react-native-worklets` を devDependencies に追加してください。
* Zustand ストアのテストに注力し、API呼び出しはモック化（例: `jest.mock('../api/client')`）してください。Jest環境下で `expo/virtual/streams` ワーカーのエラーを引き起こす可能性があるため、AxiosのAPIクライアント自体を直接テストすることは避けてください。

### バックエンドのテスト
* インメモリの SQLite データベース (`sqlite.Open("file::memory:?cache=shared")`) を使用してテストを実行してください。テストがメインの `dev.db` に影響を与えないよう、`testutil` パッケージなどのヘルパーを用いて初期化を行ってください。
* Gin のテストを書く際は、クリーンなアサーション環境を保つため、デフォルトのミドルウェア（Logger / Recovery）が含まれる `gin.Default()` ではなく `gin.New()` を使用してください。
