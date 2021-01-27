# Diggel

## Introduction

Diggel a prototype that is created by Cito in collaboration with the University of Twente. It presents items in a context of a digital application. There are 2 social media applications: Spacebook and Spacegram. Webspace is application to build a Website and with SpaceTalk the student creates a slide show.

![alt text](screenshot.png)

## Demo

A demo application is deployed [here](https://diggel.azurewebsites.net/).
The code 55555 can be used to login as an demo user.
Other than a regular user, a demo user:
- can navigate through items
- responses and log is sent to the console instead of the backend
- choose to start an application (regular user are coupled to 2 application  e.g. first spacebook then webspace)

## Getting started

### Frontend
- `npm i` in the frontend folder
The applications can be started without a backend; using the -nobackend npm scripts (e.g.) `npm run start:spacebook-nobackend`

[More info] (/frontend)

## Backend
- install [dotnet](https://dotnet.microsoft.com/download/dotnet/5.0)
- `dotnet restore` in the backend folder
- add an appsettings.local.json file and add 
    - AppSettings:backoffice_admin_username": "--some username--",
    - AppSettings:backoffce_admin_password": "--some password--"
- optional change the database from memory to mongo to use a mongo database. In that case your should make sure the connectionString is correct.

[More info] (/backend)