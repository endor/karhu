# Writing a business oriented web application using HTML5 local storage

A lot of people still consider JavaScript a "toy language", despite the fact that it has got much attention lately and there is quite a number of high quality libraries and frameworks available to help create applications ready for production. This article will follow the creation of a basic business oriented application and will show one of several possible ways to do that. The application is meant as a starting point for digging deeper into the existing options and maybe even for experiencing how much fun coding quality JavaScript can be. 

The basic application that was developed alongside this article catalogues products and divides them into categories. Those categories as well as the products can be created, updated and deleted. In addition to this typical CRUD approach, there are other standard tasks that were to be handled: internationalization, validation of input and controlling the application via the keyboard. The last and one of the most important aspects of the app is that it is supposed to use HTML5 local storage in order to allow offline editing. 


## How to start

So how does one go about writing a business oriented JavaScript application? One well established way is by using a Model-View-Controller structure. This has been successfully employed in frameworks like Ruby on Rails or Django. It allows for a strict structure and the separation of different parts of the application like view and business logic, which is especially important with JavaScript since it is really easy to write mixed-up code, doing everything in one place. I often have to remind myself not to do that and to try and write clean, readable and reusable code. There are several frameworks allowing for a MVC structure. Some of the most notable ones are [Backbone.js](http://documentcloud.github.com/backbone), [Eyeballs.js](https://github.com/paulca/eyeballs.js) and [Sammy.js](http://sammyjs.org).

For this example app I used Sammy.js, mostly because I already know it but also because it is small, well written and tested and does all the things I need to get started. It does not provide you with a given MVC structure but it allows you to easily build that upon its basis. The only dependency it currently has is [jQuery](http://jquery.com) and that is a library I personally use for DOM manipulation anyway. The directory structure I started with looks like this:

    - public
      - js
          app.js
        + controllers
        + models
        + helpers
        + views
      + templates
      - vendor
        - sammy
            sammy.js
        - jquery
            jquery.js


In templates I put all the template files that may be rendered through the JavaScript code and the JavaScript code relevant for rendering those templates is in views.


## The application file

The actual Sammy.js application is created in `app.js` where also the controllers are loaded and their routes are initialized. I tend to namespace all the variables (controllers, models, etc.) I create, and chose to call this namespace karhu.

    karhu.app = $.sammy(function() {
      this.element_selector = '#main';
      
      this.use(Sammy.Mustache, 'mustache');
      this.use(Sammy.NestedParams);
      this.use(Sammy.JSON);  
  
      this.helpers(karhu.ApplicationHelper);
      this.helpers({ store: karhu.config.store });

      karhu.Products(this);
    });

    $(function() {
      karhu.app.run('#/products');
    });


What you start with is the loading of plugins such as [Mustache](https://github.com/janl/mustache.js) which is a template rendering engine. Then you initialize helpers (`karhu.ApplicationHelper`) and controllers (`karhu.Products`). Once the app is defined and all the DOM elements are loaded, you can run the sammy app and let it go to the first route which is the index of all products.


## Writing tests

Before showing you how the products controller works and displays all the products I want to briefly go into how the quality of JavaScript applications can be greatly increased - through testing. I go about developing the example application step by step and before every major step I first write an acceptance test to ensure that the code is actually working and everything I have developed before is also still functioning correctly. If there are more complex parts of code, I write unit tests for those and try to cover most of the cases that can happen when running the code. For acceptance tests one of the easiest and most readable ways is using [Capybara](https://github.com/jnicklas/capybara) with Selenium. The first scenario for testing if I can see a list of products looks like this:

    Feature: Products
      In order to know which products I have
      As a user
      I want to see a list of products
  
      Scenario: list products
        Given a category "Trees" with the description "Plants"
          And a product "Oak" with the description "Brown" and the price "232.00€" that is valid to "12/20/2027" and belongs to the category "Trees"
          And a product "Birch" with the description "White" and the price "115.75€" that is valid to "03/01/2019" and belongs to the category "Trees"
        When I go to the start page
        Then I should see "Trees"
          And I should see "Oak"
          And I should see "Brown"
          And I should see "232.00€"
          And I should see "12/20/2027"
          And I should see "Birch"


For unit testing there are a lot of different possibilities. I used to work with jspec, since it is similar to rspec which I have used before, but that has been deprecated in favor of jasmine now, so that is what I am using. It works quite well and brings a `rake` task that allows it to easily run together with the acceptance tests. One of the unit tests for the example application looks like this:

    describe("Product", function() {
      describe("attachCategory", function() {
        it("should assign itself its category", function() {
          var categories = [{id: 1, name: 'Papiere'}, {id: 2, name: 'Baeume'}];
          var attributes = {id: 1, name: 'Fichte', category_id: 2};
          var product = new karhu.Product(attributes, categories);
          expect(product.category.name).toEqual('Baeume');
        });    
      });
    });


## Defining controllers

Once I finish the scenario I start with the controller, which is very simple when just starting out:

    karhu.Products = function(app) {
      app.get('#/products', function(context) {
        context.get('/categories', {}, function(categories) {
          context.get('/products', {}, function(products) {
            products = products.map(function(product) { return new karhu.Product(product, categories); });
            context.partial('templates/products/index.mustache', {products: products});
          });
        });
      });
    };


At the moment there is only one route defined, which is a GET on the `#/products` route. The appended callback will be run once the location hash in the URL changes to `/products`. So if you append the route to your URL similar to this: `http://localhost:4567/index.html#/products`, the attached callback will be run. The same will happen when the application is just started, because we defined in our `app.js` that the first redirect is to that same route.

Inside the route we retrieve the categories and products via helpers that just do a basic AJAX GET request to our backend. Once we have retrieved this data we map it to JavaScript objects and then render those objects inside the `index.mustache` template, which will display them in the `<div id="main">` HTML tag, because this element was defined in the `app.js` file.


## Defining models
  
First we need to map the data to JavaScript objects so we can associate the products with the category they belong to and can render the name of the category alongside the product, which looks like this:
  
    karhu.Product = function(attributes, categories) {
      _.extend(this, attributes);

      attachCategory(this, categories);

      function attachCategory(product, categories) {
        product.category = _.find(categories, function(category) {
          return parseInt(category.id, 10) === parseInt(product.category_id, 10);
        });
      }
    };


We extend the object with all the attributes of the product and then we attach the category of the product to the object. The `attachCategory` is a private function so the behavior is encapsulated. Important to notice in this code is the use of the underscore functions which are provided by the [Underscore.js](http://documentcloud.github.com/underscore/) library. Most of the behavior defined in that library is related to enumerables and allows one to write easy to read, concise code.


## Rendering templates

In the above case, we do not need an extra view object because the logic of rendering is very basic - it is just the objects of the products we created. The logic-free mustache template that will be rendered looks like this:

    <h2>Products</h2>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Valid To</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {{#products}}
          <tr>
            <td>{{name}}</td>
            <td>{{description}}</td>
            <td>{{unit_price}}</td>
            <td>{{valid_to}}</td>
            <td>{{#category}}{{name}}{{/category}}</td>
          </tr>
        {{/products}}
      </tbody>
    </table>


We just iterate over all the products and render the attributes of each, including the category name we attached beforehand.


## Standard tasks and difficulties

There are several tasks that are very common to web development and will be recurrent when working on JavaScript applications. I want to explain how I solved those tasks and which problems I encountered. As usual, there are several different ways to approach an issue.


### Authentication

Most applications, just like our example application, want security by making the user log in before allowing the usage of the application. Since HTTP is stateless, we need to resend the authentication with every request, so we need to save some kind of a token when first logging in and then use that for everything thereafter. The way I chose to do that was to save a token in the locale storage once the user had logged in successfully and send that token as a header attached to the XMLHttpRequest. The code to do this looks similar to the following. It is stashed in a backend model which is used by the helpers I mentioned earlier:

    this.get = function(url, data, success, error) {
      sendRequest('get', url, data, success, error);
    };
    
    function authenticate(xhr) {
      var token = '';
      if(karhu.token) {
        token = karhu.token;
      } else if(karhu.user && karhu.password) {
        token = SHA256(karhu.user + karhu.password);
      }
      karhu.token = token;
      xhr.setRequestHeader("X-Karhu-Authentication", 'user="' + karhu.user + '", token="' + karhu.token + '"');
    };
    
    function sendRequest(verb, url, data, success, error) {
      $.ajax({
        url: url,
        data: data,
        type: verb,
        beforeSend: function(xhr) {
          authenticate(xhr);
        },
        success: function(result) {
          success(result);
        }
      });
    }
    
One possibility is that we already have a token, the other is that the user just logged in and there is a user(name) and a password available. Either way I attach the token or user/password combination as a header and if the request is successful, I know that the user is authenticated successfully. Otherwise the backend will just return an error. This approach was relatively straight forward to implement and I did not really encounter any issues except that I had all the code in helpers before putting it in a separate model which led to relatively complex, unreadable code. Abstracting the requests into a backend model is quite common, as, for example, seen in the Backbone.js library where it is practised even more profoundly. The authentication code is unique for this example application though and always depends on the backend and what it expects the frontend to send.


### I18n

A very common library for internationalizing JavaScript applications which is based on jQuery is [jquery.global.js](http://github.com/jquery/jquery-global). It provides us with methods to format numbers and dates and enables us to translate strings once we have loaded a dictionary for the current locale. Once we have loaded this dictionary, which is a simple JavaScript object with keys and translated values, the only thing we need to pay attention to is formatting numbers and dates in all places in the application. A sensible place to do that is in the models before rendering the objects to the templates, so in the product model it would look something like this:

    var valid_to = Date.parse(product.valid_to);
    product.valid_to = $.global.format(valid_to, "d");


### Validation

When developing in JavaScript, we have the opportunity to inform the user right away if the provided input is invalid, so it makes sense to use that opportunity and validate the data before it is sent to the backend. This does not mean that it is not necessary to validate the data in the backend as well since there might be requests that are not using the frontend. Again, there is a common jQuery library for validations which is [jquery.validate.js](http://bassistance.de/jquery-plugins/jquery-plugin-validation/). The library will use a set of rules on a form and show errors on the appropriate input fields if the content does not match the provided rules. It makes sense to structure those validation rules into the models we already have, so every model has a `validations` function which returns the rules. This is again similar to Backbone.js but different from Eyeballs.js where the validations work in a more Rails-like fashion. Here is how the validations for our category model could look:

    karhu.Category = function() {
      this.validations = function() {
        return {
          rules: {
            'category[name]': {
              required: true,
              maxlength: 100
            }
          }
        };
      };
    };


### Caching objects for offline editing

This is the most central and complex part of the application. All objects need to be cached beforehand so that in case we are offline they can be correctly sorted, paginated and filtered. There needs to be a queue for all actions being done before the objects are cached, so that those actions can be applied to the objects once they are cached. Then there needs to be a second queue that is filled once we actually are offline, so that when we are back online, everything that was done offline can be patched through to the backend.

There are several issues that need to be addressed outside of the already complicated caching and queuing process. One, for example, is that when an object is created when offline, it cannot be updated or deleted without further code because it does not have an id. I worked around that for now by simply disallowing those actions for objects created while offline. Another issue was that categories created while offline cannot be used for creating products; here again the reason being that they do not have an id yet. I simply do not display those categories in the list of available categories for creating a product. Some of those problems might be solved by working with temporary ids and by rearranging the offline queue.

In addition, the available partials definitely need to be cached. This can either be done through a cache manifest as defined in HTML5 if the targeted browser group supports it, or simply through loading the partials and putting them into the local storage. This is quite simple with Sammy.js and looks something like this:

    context.load('templates/products/index.mustache', {cache: true});


## Conclusion

All of the requirements for the example application were implemented. With enough time one could also handle the issues mentioned above. Tasks like authentication, internationalization and handling business logic need to be done independent of the frameworks and libraries, which are really just a starting point.

If you always test the code of the application and try to pay attention to structure cleanly separating different parts of the application, writing JavaScript applications ready for production that can continue to evolve is in my opinion possible and a goal well worth investing in. Getting started is easy, however it is important to keep checking for a clean code base and refactoring if necessary. If these requirements are met, JavaScript gives you the opportunity to write very elegant applications and solutions.

The code of the example application can be found on [codeplex](). Other starting points for getting a better understanding of the subject are the documentations of the aforementioned libraries and frameworks, other example applications and, of course, JavaScript books.




# TODO
* I/you vs. we
* Present tense vs. past tense