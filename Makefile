.PHONY: help up down build push release restart logs shell-frontend shell-backend sync-deps

# ビルド用自動生成バージョン (例: 20260414-1234)
VERSION := $(shell date +%Y%m%d-%H%M)

# デフォルトのターゲットをhelpに設定します
help:
	@echo "使用可能なコマンド一覧:"
	@echo "  make up             - コンテナ群をバックグラウンドで起動します"
	@echo "  make down           - コンテナ群を停止・削除します"
	@echo "  make restart        - コンテナ群を再起動します"
	@echo "  make build          - キャッシュを利用しつつコンテナイメージをビルドします"
	@echo "  make push           - ビルドしたイメージをプライベートレジストリにプッシュします"
	@echo "  make release        - build と push を連続して実行します"
	@echo "  make logs           - 全コンテナのログをリアルタイムで追跡監視します"
	@echo "  make shell-frontend - フロントエンドコンテナのシェルに入ります"
	@echo "  make shell-backend  - バックエンドコンテナのシェルに入ります"
	@echo "  make sync-deps      - フロントエンドの node_modules をコンテナから抽出しローカルに同期します（IDEエラー対策）"

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

build:
	@echo "イメージをビルドしています..."
	docker-compose build
	@echo "========================================"
	@echo "自動バージョンタグを付与しています: $(VERSION)"
	docker tag registry.gate.home/sutoku-frontend:latest registry.gate.home/sutoku-frontend:$(VERSION)
	docker tag registry.gate.home/sutoku-backend:latest registry.gate.home/sutoku-backend:$(VERSION)
	@echo "ビルド完了！"
	@echo "========================================"

push:
	@echo "イメージをプッシュしています..."
	docker push registry.gate.home/sutoku-frontend:latest
	docker push registry.gate.home/sutoku-frontend:$(VERSION)
	docker push registry.gate.home/sutoku-backend:latest
	docker push registry.gate.home/sutoku-backend:$(VERSION)
	@echo "プッシュ完了！"
	@echo "========================================"

release: build push

logs:
	docker-compose logs -f

shell-frontend:
	docker-compose exec frontend sh

shell-backend:
	docker-compose exec backend bash

sync-deps:
	@echo "コンテナのイメージから node_modules を抽出し、ローカル空間に展開しています..."
	@echo "※環境によっては数十秒かかります"
	docker create --name temp-frontend registry.gate.home/sutoku-frontend:latest
	docker cp temp-frontend:/app/node_modules ./frontend/node_modules
	docker rm temp-frontend
	@echo ""
	@echo "==== 完了 ===="
	@echo "エディタのエラー表示が消えない場合は、VSCodeのコマンドパレットから"
	@echo "「TypeScript: Restart TS server」を実行してください。"
