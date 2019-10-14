# Wetube

Cloning Youtube with Vanilla and NodeJS

## Pages:

- [ ] Home
- [x] Join
- [x] Login
- [x] Search
- [ ] User Detail
- [ ] Edit Profile
- [ ] Change Password
- [ ] Upload
- [ ] Video Detail
- [ ] Edit Video

## How to create Https Server

- https://cinema4dr12.tistory.com/984

1. Download Window Openssl

   - http://slproweb.com/products/Win32OpenSSL.html
   - Win64 OpenSSL v1.1.0(n) download
   - setup openssl and regist path

2. Issue Private and Public Key in the folder you want to

   - openssl genrsa 1024 > private.pem
   - openssl req -x509 -new -key private.pem > public.pem

3. Coding your app.js

   ```javascript
   import https from "https";

   const options = {
     key: fs.readFileSync("private.pem"),
     cert: fs.readFileSync("public.pem")
   };

   https.createServer(options, app).listen(PORT, handleListening);
   ```
