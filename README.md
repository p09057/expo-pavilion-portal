# 大阪・関西万博パビリオンポータル

大阪・関西万博のパビリオン情報を管理・閲覧するためのWebアプリケーションです。

## 機能

- **認証機能**: 事前登録されたユーザーのみアクセス可能
- **パビリオン一覧表示**: カード形式でパビリオン情報を表示
- **検索・フィルター機能**: パビリオン名での検索、カテゴリーでのフィルタリング
- **管理者機能**: パビリオン情報の追加・編集・削除・並び替え（管理者のみ）
- **レスポンシブ対応**: PC・スマートフォンに対応

## 技術スタック

- React + TypeScript
- Vite
- TailwindCSS
- React Router
- GitHub Pages（ホスティング）
- GitHub API（データ管理）

## セットアップ

1. リポジトリをクローン
```bash
git clone [your-repository-url]
cd expo-pavilion-portal
```

2. 依存関係をインストール
```bash
npm install
```

3. 開発サーバーを起動
```bash
npm run dev
```

## デプロイ

GitHub Pagesへのデプロイ:

1. `vite.config.ts`の`base`をあなたのリポジトリ名に変更
2. GitHubにプッシュ
3. 以下のコマンドを実行:
```bash
npm run deploy
```

## GitHub API設定

管理者機能でパビリオン情報を更新するには、GitHub Personal Access Tokenが必要です：

1. GitHubで[Personal Access Token](https://github.com/settings/tokens)を作成
   - 必要な権限: `repo`スコープ
2. 管理者ページの「GitHub設定」からトークンとリポジトリ情報を設定

## パビリオンカテゴリー

- 海外パビリオン
- シグネチャーパビリオン
- 企業パビリオン
- 日本パビリオン
- テーマ館
- その他

## ライセンス

プライベートプロジェクト - 一般公開はしません