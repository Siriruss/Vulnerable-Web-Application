# Black Hills Information Security Vulnerable Web Application

## Description
This vulnerable web application has been created for use as a teaching aid as well as a place for users to learn and train various skills that may be utilized during the penetration testing of a web application.

## Installation

1) Install the following dependencies

- [Node.js] (https://nodejs.org/) v16.15.1 LTS.
- [MongoDB Community Server] - MongoDB Compass is not required.
    - Windows - (https://www.mongodb.com/try/download/community) It is recommended to download MongoDB as a service.
    - Linux - (https://www.mongodb.com/docs/manual/administration/install-on-linux)- It is recommended to download MongoDB as a service.

2) Clone or download the project from the gitlab.
```sh
git clone https://git.nopsled.me/nrussaw/bhis-vulnerable-web-application.git
```

3) Navigate to the Vulnerable Web Application folder on your system and create a new blank .env file.
```sh
sudo nano .env
```

4) In the new .env file add the following text and save the file.
```sh
SESSION_SECRET=anyrandomstring
```

5) In any terminal, run the following command to download all required node modules and start the application and API.

```sh
npm i
npm start
```

6) If you have been successful so far you should receive a "Server/API Started on port:XXXX" message for each application.

7) In any browser, navigate to localhost:3000 to begin utilizing the vulnerable web application.
