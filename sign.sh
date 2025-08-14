#!/bin/bash

source .env

web-ext sign --channel=listed \
    --amo-metadata=./meta.json \
    --api-key=$AMO_JWT_ISSUER \
    --api-secret=$AMO_JWT_SECRET \
    --ignore-files "sign.sh" ".env"
