Project Title: PeepsArena

Description: PeesArena is a social networking platform. Users can send messages, videos and images to one another in a real time mode. Users can post articles and have those articles commented and reacted upon. There can be one on one and group communication within this platform .

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

In this project, I made use of yarn for all matters relating to initialization, installation and start. This was based on my preference. If you choose to clone this app, you could clone with this link [git@github.com:Peterzolo/Social-Network-Application-backend.git]. After cloning, run yarn install to install all dependencies used within the project. You can start the application with yarn dev.

Using NPM: Should you decide to use npm, all you need to do after cloning is 1. On the left side where you have a dropdown of files and folders, you will see a file called yarn.lock, make sure to delete it and run npm install. After the installation, you can start the app with npm run dev. However before you run the app, make sure to add the items in the .env-example file which are also described in the prerequisites below.

## Prerequisites

MONGO_URI =
JWT_TOKEN_SECRET =
COOKIE_SECRET_ONE =
COOKIE_SECRET_TWO =
NODE_ENV =
CLIENT_URL =
REDIS_HOST =
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =
CLOUDINARY_CLOUD_NAME =
SENDGRID_API_KEY = ""
SENDER_EMAIL =
SENDER_EMAIL_PASSWORD=
EC2_URL =
API_URL=

## Usage

The first place to start from as a user is the onboarding. You need to register by supplying you username, email and password. Your data will have to pass through verification process and if evrything is good, you will be registered, and your details will be stored in the application's database. After the registeration, you will be redirected to authentication where you can login with the credentials you registered with, which are essentially your username and password. If you supply the right credentials, you will have access to the system.
What you can do within the application include: 1.Post: You can create a post for people to read and comment as well as react to the post. You can view all your posts, edit and delete any post of your 2. Comment: You will be able to like and comment as well as react to other people's posts. 3. Follow: You can follow other users and also be followed by them. 4. Chat: You will be able to have one on one chat with another user within the platform. You can also have a group chat. API documentation in progress : https://documenter.getpostman.com/view/10754987/2s93ebTqjY

## Features

1. Chat: User can have a chat with another user.
2. Post : User can post an article.
3. Sending Messages and Videos. User can send and receive message in real time mode

## Contributing

Ideas that can bring an improvement to the application is highly welcome. Contributors can reach out to me with some ideas that they feel could elevate the application to make it better and more scalable via my email [petersolomon704@gmail.com]. After we have agreed on the what could be added, then a submain branch will be created where new PRs would be merged with before merging with the main branch.

## License

MIT License

## Contact

Email: petersolomon704@gmail.com, Linkedin:https://www.linkedin.com/in/peter-solomon/
