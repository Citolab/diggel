# Diggel

## Introduction

Diggel (digitale geletterdheid/digital literacy) a prototype created by Cito in collaboration with the University of Twente.
Diggel plays an assessment in context of a digital application. There are 4 different contexts:
- Spacebook: social media context
- Spacegram: social media context
- Webspace: student creates a website
- Spacetalk: student creates a slide show

Each context is an different Angular application deployed on a subsite of the same domain.
A fifth application named: Diggel contains the login, start and end pages and is deployed in the root.

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

The frontend application is wrapped into a Cordova Android app for real deliveries but can run in the browser too.

- `npm i` in the frontend folder
The applications can start without a backend; using the -nobackend npm scripts (e.g.) `npm run start:spacebook-nobackend`

[More info](/frontend)

## Backend
- install [dotnet](https://dotnet.microsoft.com/download/dotnet/5.0)
- `dotnet restore` in the backend folder
- add an appsettings.local.json file and add 
    - AppSettings:backoffice_admin_username": "--some username--",
    - AppSettings:backoffce_admin_password": "--some password--"
- optional change the database from memory to mongo to use a mongo database. In that case your should make sure the connectionString is pointing to an existing mongo database.

[More info](/backend)