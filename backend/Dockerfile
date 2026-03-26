FROM node:18-bookworm-slim

# プロキシ設定の引数を受け取る
ARG http_proxy
ARG https_proxy
ARG no_proxy

# Prisma エンジン用のOpenSSLをインストール
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 環境変数として設定する (コンテナ実行時にも引き継がれる)
ENV http_proxy=$http_proxy
ENV https_proxy=$https_proxy
ENV no_proxy=$no_proxy

# npm コマンドにもプロキシを適用する場合
RUN if [ -n "$http_proxy" ]; then npm config set proxy $http_proxy; fi
RUN if [ -n "$https_proxy" ]; then npm config set https-proxy $https_proxy; fi

WORKDIR /app

# npm install に必要なファイルをコピー
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

# 依存関係のインストールと Prisma クライアントの生成
RUN npm install
RUN npx prisma generate

# ソースコードのコピー
COPY . .

# 実行
CMD ["npm", "run", "dev"]
