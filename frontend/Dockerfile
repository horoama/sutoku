FROM node:18-alpine

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
