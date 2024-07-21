# How to setup


# setting up .env
- add your mongo atlas server with the variable name `MONGODB_URI`
- add any random pass phase for jwt with teh variale name `JWT_SECRET` (this cant be hardcoded as its not good practice and will lead to problems in the future)


# building dependencies

2. open powersheel or cmd and run the following commands to install dependencise
```
npm i -g pnpm
pnpm i
```

# running the app

```pnpm start```
