# Build stage
FROM rust:latest AS build
LABEL authors="Daniel Gustaw"

WORKDIR /opt

# Install required tools
RUN rustup install stable && \
    apt update && apt install -y build-essential curl

# Cache dependencies to avoid unnecessary rebuilds
COPY Cargo.toml Cargo.lock ./
RUN cargo fetch

# Copy source code and build
COPY src ./src
#RUN cargo build --release
RUN cargo build

# Final stage
FROM debian:latest

WORKDIR /app

# Install dependencies in a single step
RUN apt update && apt install -y bash ffmpeg

# Copy compiled binary
#COPY --from=build /opt/target/release/main .
COPY --from=build /opt/target/debug/main .

CMD ["./main"]
