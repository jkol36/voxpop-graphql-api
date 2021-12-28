#!/usr/bin/env bash

echo "Checking docker graphql network status"
url="http://localhost:8080/graphql"
status_code=$(docker exec hhsbgraphql-express curl -o /dev/null --silent --head --write-out '%{http_code}\n' $url)
echo "Status $status_code"
if [ $status_code == "502" ]
then
    echo "Build failed. Local GraphQL API is down."
    exit 1
fi

echo "success!"

exit 0
