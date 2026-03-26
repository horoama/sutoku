FROM node:18-alpine

# プロキシ設定の引数を受け取る
ARG http_proxy
ARG https_proxy
ARG no_proxy

# 環境変数として設定する
ENV http_proxy=$http_proxy
ENV https_proxy=$https_proxy
ENV no_proxy=$no_proxy

# npm コマンドにもプロキシを適用する場合
RUN if [ -n "$http_proxy" ]; then npm config set proxy $http_proxy; fi
RUN if [ -n "$https_proxy" ]; then npm config set https-proxy $https_proxy; fi

WORKDIR /app

# npm install に必要なファイルをコピー
COPY package*.json ./
COPY app.json ./
COPY tsconfig.json ./

# 依存関係のインストール
RUN npm install

# ソースコードとアセットのコピー
COPY . .

# 8081ポートを外部に公開
EXPOSE 8081

# Web モードで Expo を起動
CMD ["npm", "start", "--", "--web"]
