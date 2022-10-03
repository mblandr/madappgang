# Project Description

The project is a solution to a  [React test task](https://doc.clickup.com/4717441/d/h/4fyw1-3382/4f9d716244343b5).

The project is implemented using create-react-app.

## Deployment

Implemented automatic deployment on Netlify using GitHub Actions.

The repository address is [https://github.com/mblandr/madappgang](https://github.com/mblandr/madappgang).

The address of the finished application is [https://tiny-cactus-f13366.netlify.app/](https://tiny-cactus-f13366.netlify.app)

Publishing happens automatically when you send a commit to a remote repository (using git push origin master), all application tests are run in the process.

## Publish setting

The application uses Firebase to register and authorize users. For proper work is important the creation of environment variables in the site settings on Netlify (Site Settings -> Build and Deploy -> Environment). List of variables:
* REACT_APP_API_KEY, REACT_APP_AUTH_DOMAIN
* REACT_APP_PROJECT_ID
* REACT_APP_STORAGE_BUCKET
* REACT_APP_MESSAGING_SENDER_ID
* REACT_APP_APP_ID

The variables correspond to the object key values in the function initializeApp of the Firebase project (in the Firebase console Project Settings -> General-> SDK setup and configuration).

The domain of the published site must be in the list of authorized Firebase domains (in the Firebase console Authentication -> Settings -z> Authorized domains console)