#!/bin/sh

docker build -t hj-system-frontend-toubiao:latest .
docker stop hj-system-frontend-toubiao
docker rm hj-system-frontend-toubiao
# docker run -d -p 8002:8002 --name llm-writing-system-backend --privileged llm-writing-system-backend:latest 

# bridge
docker run -d -p 8870:80 --name hj-system-frontend-toubiao --privileged --restart=always hj-system-frontend-toubiao:latest


# host
# docker run -d --name llm-writing-system-backend --privileged \
# -e "JDBC_URL=jdbc:mysql://127.0.0.1:3306/llm_demo" -e "API_PORT=8002" \
# --network host \
# llm-writing-system-backend:latest


# network
# docker run -d -p 8002:8002 --name llm-writing-system-backend --privileged \
# -e "JDBC_URL=jdbc:mysql://db:3306/llm_demo" -e "API_PORT=8002" \
# --network llm-writing-system --network-alias backend \
# llm-writing-system-backend:latest 


