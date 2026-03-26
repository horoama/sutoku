FROM node:18-alpine

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

# 初期データのプッシュなどは起動時に行う
# CMD ["sh", "-c", "npx prisma db push && npm run dev"]
CMD ["npm", "run", "dev"]
