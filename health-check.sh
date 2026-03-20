#!/bin/sh
# Docker health check script
curl -f http://localhost:3001/api/health/ready || exit 1
