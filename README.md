# User role system - Server Code

## Prerequisites:

1. Node
2. MongoDB

## Installation:

Execute below commands to install all packages

`npm install`

For running the app, please execute below command

`npm run start`

## API Endpoints

Below are used APIs:

### Swagger

`/api-docs`

### GET

1. Get All Roles `/api/v2/roles/getAllRoles`
2. Get All Users by Authorize Type `/api/v2/users/getUsersByAuthType?authType=all`

### POST

1. Create a User `/api/v2/users/signup`
2. Sign up user by providing credentials `/api/v2/users/signin`
3. Signout User `/api/v2/users/signout`
4. Change Authorize Status `/api/v2/users/changeAuthorizeStatus`
5. Create Role by providing name `/api/v2/createRole`
