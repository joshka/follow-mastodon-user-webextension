# See https://just.systems/

run:
    web-ext run --source-dir ./src --target firefox-desktop --devtools --browser-console

build:
    web-ext build --source-dir ./src --overwrite-dest

lint:
    web-ext lint --source-dir ./src
