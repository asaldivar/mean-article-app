# Purpose
---

The intention of this app is help provide an application built with opinionated conventions, so that instructors can have somewhat of a style guide , and further, students can have lesson source code that follows conventions allowing for easier understanding of new topics.

The source code of this app has been put together with thought-out commits, so that anyone can follow them to build and structure a simple RESTful MEAN stack app from the back-end to the front-end.

The app itself is broken into two main parts, an `app` folder and a `public` folder. The thought behind this, is that the majority of server-side code will in `app` and all client-side code will live within `public`. Building out the application in this way helps clearly define the purpose of code. For example, if a student is having trouble discerning whether code they are looking at affects the server-side or the browser, they can refer to the parent's parent directory name, `app` or `public`. Besides relying on this naming convention, which is not a truly technical explanation, instructors can refer to `server.js` which acts as the heart of the application, connecting the front-end to the back-end and giving them life.

Specifically, instructors can refer to these lines within `server.js`:

```
app.use('/api', apiRouter);
```
The use of this router middleware serves as the gateway to the back-end.
When you trace its path from `server.js` it looks something like router > controllers > model.

and

```
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});
```
This is the app's gateway to the front-end. As you can see, this "gateway" points to code that is within our `public` folder.

## App Structure

```
- app
-- config
--- config.js
--- env.json
--- routes.js
-- models
--- Article.js
-- controllers
--- articles-controller.js
- public
-- app.js
-- css
--- style.css
-- assets
--- logo.png
-- components
--- articles
---- articles-view.html
---- articles-controller.js
---- articles-service.js
--- article-form
---- article-form-view.html
---- article-forms-controller.js
-- services
---- api-service.js
--- directives
---- some-custom-directive.html
----
- node_modules
- package.json
- server.js
```

### APP
---

This is where the server-side code lives.

### Config
The config (configuration) folder is where you dictate the structure of the back-end of your web application.

**_routes.js_**

Your routes file defines which controller will be used to handle endpoints being hit by varying HTTP methods:

```
...
apiRouter.route('/articles')

  .post(articlesController.create)

  .get(articlesController.index);

apiRouter.route('/articles/:article_id')

  .get(articlesController.show)

  .patch(articlesController.update)

  .delete(articlesController.destroy);

...
```

**_env.json_**

The env.json file, short for environments.json, is used to describe environment-specific data/variables for your app. For example, when in a development environment use the local database URI and API test tokens and secrets, and when in a production environment use the production database URI and API real tokens and secrets:

```
{
  "development": {
    "db": "<local  database URI>",
    "api": {
      "facebook": {
        "token": "<fb token>",
        "secret": "<fb secret>",
      }
      "instagram": {
        "token": "<ig token>",
        "secret": "<ig secret>",
      }
    }
  },
  "production": {
    "db": "<production database URI>"
  }
}
```

**_config.js_**

Config.js (configuration) will be ran within your server.js and based off the environment your server is running in, it will access the appropriate environment variables from env.json:

```
var environment = require('./env.json');

exports.config = function() {
  var node_env = process.env.NODE_ENV || 'development';
    this will return the key-value pairs from the env.json
    based off the environments
  return environment[node_env];
}
```

### Models


**_Article.js_**

```
var mongoose = require('mongoose');
var Schema = mongoose.Schema; // allows us to create a constructor for our model

var ArticleSchema = new Schema({
  title: String, // define data types
  author: String,
  created_at: Date,
  votes: {type:Number, default: 0},
  content: String
});

// defines prehook for document
// before each save the created_at value will be set
ArticleSchema.pre('save', function(next){
  this.created_at = new Date();
  next();
});

module.exports = mongoose.model('Article', ArticleSchema);
```

### Controllers

All controller files belong to this folder.

Controller function naming convention (follows CRUD convention):


| HTTP METHOD | Controller Name |
| :---------: | :-------------: |
| GET (all)   | index           |
| GET (show)  | show            |
| POST        | create          |
| PATCH       | update          |
| DELETE      | destory         |


**_article-controller.js_**


```
var Article = require('../models/Article');

function articleById(request, response, next, id) {
  Article.findById(id, function(error, article) {
    if (error) console.error('Could not update article b/c:', error);

    request.article = article; // store article in request
    next(); // callback to move onto next handler
  });
}

...


function show(request, response) {
  response.json(request.article);
}

...

module.exports = {
  articleById: articleById,
  create: create,
  index: index,
  show: show,
  update: update,
  destroy: destroy
};
```
When we export all functions as an object, it can help serve as a reference to all controller functions within the file.

### Public
---

This is where client-side code lives.

***_app.js_***

The mother of your angular app. `app.js` is where you create your angular module and inject any necessary dependencies.

### components

A simpler and also logical way to structure this application would be to have all controllers within a controllers folder and all views within a views folder. Although this layout may suffice for the majority of the simple applications students and instructors will build, it does not take into account scalability nor does it help introduce the increasingly implemented concept of components.

Building with scale in mind, it is best to structure your app based off components. In this way you can find all related code quickly since relative files will be grouped together.

For example,

```
--- articles
---- articles-view.html
---- articles-controller.js
--- article-form
---- article-form-view.html
---- article-forms-controller.js
```

this type of file structure is a lot easier to navigate opposed to

```
--- controllers
---- articles-controller.js
---- article-forms-controller.js
--- views
---- articles-view.html
---- article-form-view.html
```
when you start to have 10+ controller and views each.

Further, as newer technologies such as Angular 2.0 and React, which are component-based, become adopted, this application structure can help ease the learning curve and speed up a student's transition in learning any of these frameworks.



### services

All services files, such as API services, will go within this folder. They are not specific to components since they can be purposed across various controllers.

***_api-service.js_***

```
angular.module('reddit')

.factory('apiService', ['$http', function($http) {
  return {
    index: function() {
      return $http.get('/api/articles')
      .then(function(response) {
        var articles = response.data;
        console.log('articles:',articles)
        return articles
      });
    },
    create: function(article) {
      $http.post('/api/articles', article);
    }
  }
}]);
```

**.gitignore**

```
node_modules/*
app/config/env.json
```
Since your node_modules will have to be installed in the environment your server is running in, whether it's on a co-developer's machine or on a production server, it is not necessary to have your node_modules pushed up to the remote repo. That is one of the purposes of the package.json, to serve as a documentation of what must be installed.

We also don't want to push our `env.json` file since it can contain sensitive information such as API token data and production database URIs.

***disclaimer:***

You will have to build out your own `env.json` file since it cannot be cloned from the remote repo.

All angular code is built with $scope opposed to controllerAs syntax because there are no nested controllers. Having worked on various production Angular applications, I have yet to see controllerAs syntax implemented. Based-off this experience, while I do believe teaching controllerAs syntax is great at covering the topic of context, I don't necessarily think it needs to be a standard convention. At the same time it totally could be. Once again, the purpose of this app is to help create conventions for application structure.