
FROM node:23.0.0

WORKDIR /src

COPY . .

RUN npm install

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
