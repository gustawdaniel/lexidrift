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
RUN apt update && apt install -y bash curl ffmpeg && \
    curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash && \
    apt-get update && apt-get install -y infisical

# Copy compiled binary
#COPY --from=build /opt/target/release/main .
COPY --from=build /opt/target/debug/main .

CMD ["infisical", "run", "--domain", "https://infisical.preciselab.space", "--projectId", "28d53423-b8f5-499f-b76c-bc714da0e8d6", "--env", "prod", "--path", "/apps/video", "--", "./main"]
