FROM golang:1.23-bookworm AS builder

WORKDIR /app

# Enable CGO for SQLite
ENV CGO_ENABLED=1

# Install build dependencies for CGO and SQLite
RUN apt-get update && apt-get install -y gcc libsqlite3-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies for SQLite
RUN apt-get update && apt-get install -y sqlite3 libsqlite3-0 ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/main .

EXPOSE 3000

CMD ["./main"]
