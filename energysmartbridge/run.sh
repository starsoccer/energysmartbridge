set -e

echo Setting ENV Variables
export CONFIG_PATH="/data/options.json"
echo Env Set

echo Listing Versions!
nginx -v
echo "Node Version: $(node -v)"

nginx -g 'daemon off;' &
./app --no-warnings | node /node_modules/.bin/pino-pretty --colorize