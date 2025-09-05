#!/bin/bash

case "$1" in
  start)
    echo "Starting Redis container..."
    docker start redis-stack || docker run -d \
      --name redis-stack \
      -p 6379:6379 \
      -p 8001:8001 \
      redis/redis-stack:latest
    ;;
  stop)
    echo "Stopping Redis container..."
    docker stop redis-stack
    ;;
  restart)
    echo "Restarting Redis container..."
    docker stop redis-stack
    docker start redis-stack
    ;;
  remove)
    echo "Removing Redis container..."
    docker stop redis-stack
    docker rm redis-stack
    ;;
  status)
    docker ps | grep redis-stack
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|remove|status}"
    ;;
esac