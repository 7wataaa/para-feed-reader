FROM node:16.13.0

RUN apt-get update && apt-get install -y locales vim
RUN locale-gen ja_JP.UTF-8
RUN localedef -f UTF-8 -i ja_JP ja_JP
ENV LANG ja_JP.UTF-8
ENV COLUMNS 131
ENV TZ Asia/Tokyo

WORKDIR /app