FROM golang:1.24-alpine AS builder

WORKDIR /app

# Enable CGO for SQLite
ENV CGO_ENABLED=1

# Install build dependencies for CGO and SQLite
RUN apk add --no-cache gcc musl-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

FROM alpine:latest

WORKDIR /app

# Install runtime dependencies for SQLite
RUN apk add --no-cache sqlite-libs sqlite

COPY --from=builder /app/main .

EXPOSE 3000

CMD ["./main"]
