FROM denoland/deno:latest as builder
WORKDIR /app
COPY . .
RUN deno cache src/main.ts

FROM denoland/deno:latest
WORKDIR /app
COPY --from=builder /app .
CMD ["deno", "run", "-A", "src/main.ts"]
