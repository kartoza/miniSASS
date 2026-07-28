#!/usr/bin/env bash

# Target for the playwright specs in this directory.
#
# These specs drive the "Add Record" flow and therefore CREATE sites and
# observations in whatever environment they point at. The default is the local
# development stack on purpose. Export BASE_URL yourself to run them against a
# deployed environment, and do not point them at production.

echo "Setting BASE_URL for test site"
BASE_URL=${BASE_URL:-http://localhost:61122/#/}
export BASE_URL
echo "BASE_URL=${BASE_URL}"
