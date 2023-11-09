# Inventory Organizer ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
  
## Description
The purpose of this project is create an application that'll help bussiness owners maintain a well established and highly functioning ecommerce website by utilizing mysql to create, update, and store data regarding inventory.The backend of the application allows managers and owners to easly keep track of their internet retail bussiness's stock by organizing stock based on product, categories, and tags associated with the items. This way, its very easy for both management and others to view and update the bussiness's data.

## Table of Contents
1. [Description](#description)
2. [Installation](#installation)
3. [Usage](#usage)
4. [License](#license)
5. [Contribution](#contribution)
6. [Test](#test)
7. [Questions](#questions)

## Installation 
To install the application, clone the folder from its Github repo. Next, the user has to type in the terminal 'npm install' to install all necessary packages. After, typing 'npm init -y' will make sure the application has been intialized. To make sure the database exists, run mysql with 'mysql -u root -p' and enter password for your mysql account (make sure env file is updated with login information aswell). Enter the following sql commands: 'SHOW DATABASES'; 'CREATE DATABASE ecommerce_db'. If the database already exists, exit mysql and enter 'run npm seed' in terminal.Lastly, enter 'npm start' to start the application on local server.
## Usage 
To use application, the user hasto send requests in Insomia. For the request, the url should like this 'http://localhost:3001/api/' with the desired route or table addded to the end of the url. Use GET to view any of the databse tables. Use POST to added a row or item to a table, PUT to update a ro or item, and DELETE to remove a row or item; These requests need the specific id number added to the end of the http request inorder to work.
## License 
For this project, I license my work under the MIT License.License info is here https://choosealicense.com/licenses/mit/
## Contribution
 To contribute to further development, offer ways to add code so new tables can be created and how to make a presentable front-end.
## Test 
Test by sending http requests in Insomia.
## Questions
My Github is K1tanaK0mbat https://github.com/K1tanaK0mbat and my email is Kitanak365@gmail.com Email me anytime.
