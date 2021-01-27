# Diggel - backend

.NET 5 backend containing an API and a backoffice.

## API

Most of the logic is client side (scoring, navigation etc.). The backend is only used to: 

- Manage sessions
- Store responses and log-entries to a Mongo database
- Prepare and download export files of responses and log.

## Backoffice

The backoffice is used to:

- Manage groups and users
- Download export files
- Download the .apk (if place in the remote_server_apk folder)
