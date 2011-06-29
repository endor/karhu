# Writing a business oriented web application using IE9 + HTML5 local storage

A lot of people still consider JavaScript a "toy language", despite the fact that it has received much attention lately and there are quite a number of high quality libraries and frameworks available for creating production-ready applications. This article will follow the creation of a basic business oriented application. The application is meant as a starting point for digging deeper into the existing options and to experience how much fun coding quality JavaScript can be and how the integration of HTML5 applications with Internet Explorer 9 into the Windows operating system will enhance the user experience. 

The basic application that was developed alongside this article catalogues products and divides them into categories. Those categories as well as the products can be created, updated and deleted. In addition to this typical CRUD approach, there are other standard tasks that will be handled: internationalization, validation of input and controlling the application via the keyboard. One of the most important aspects of the app is that it will use HTML5 local storage in order to allow offline editing.


## How to start

So how does one go about writing a business oriented JavaScript application? One well established way is by using a Model-View-Controller structure. This has been successfully employed in frameworks like Ruby on Rails or Django. It allows for a strict structure and the separation of the concerns of the application like view and business logic. This is especially important with JavaScript as it is really easy to write confusing code, doing everything in one place. I often have to remind myself not to do that and to try and write clean, readable and reusable code. There are several frameworks built for a MVC structure. Some of the most notable ones are [Backbone.js](http://documentcloud.github.com/backbone), [Eyeballs.js](https://github.com/paulca/eyeballs.js) and [Sammy.js](http://sammyjs.org).

For this example application I used Sammy.js, primarily because I already know it but also because it is small, well written, tested, and does all the things I need to get started. It does not provide you with an implicit MVC structure but it allows you to easily build upon its base. The only dependency it currently has is [jQuery](http://jquery.com) and that is a library I personally use for DOM manipulation anyway. The directory structure I started with looks like this:

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


In `templates` I put all the template files that may be rendered through the JavaScript code and in `views` all the JavaScript code relevant for rendering those templates.


## The application file

The actual Sammy.js application is created in `app.js` - here the controllers are loaded and their routes are initialized. I tend to namespace all the variables (controllers, models, etc.) I create. In this case I chose to call this namespace karhu.

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


First we start loading plugins such as [Mustache](https://github.com/janl/mustache.js) which is a template rendering engine. Then we initialize helpers (`karhu.ApplicationHelper`) and controllers (`karhu.Products`). Once the app is defined and all the DOM elements are loaded, you can run the sammy app and direct it to the initial route which is the index of all products.


## Writing tests

Before showing you how the products controller works and displays all the products I want to briefly go into how the quality of JavaScript applications can be greatly increased through testing. As I went about developing the example application before every major step I first wrote an acceptance test to ensure that the code is actually working. This also prevents regressions, guaranteeing everything I wrote before is also still functioning correctly. For more complex code, I write unit tests and try to cover most of the cases that can happen when running the code. For writing acceptance tests one of the easiest and most readable ways is using [Capybara](https://github.com/jnicklas/capybara) with Selenium. In the first scenario we can test if we can see a list of products:

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


Once headless browsers like [Phantomjs](http://www.phantomjs.org/) are available as Capybara drivers, it will probably make sense to use those instead of Selenium as they are a lot faster.

For unit testing there are a lot of different possibilities. I used to work with jspec, since it is similar to Ruby's rspec which I have used before. Recently that has been deprecated in favor of jasmine, so I've used that here. It works quite well and brings a `rake` task that allows it to easily run alongside the acceptance tests. One of the unit tests for the example application looks like this:

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


At the moment there is only one route defined, which is a GET on the `#/products` route. The callback will be run once the location hash in the URL changes to `/products`. So if you append the route to your URL (like `http://localhost:4567/index.html#/products`) the attached callback will be executed. The same will happen when the application is just started, because we defined in our `app.js` that the initial path points to the same route.

Inside the route we retrieve the categories and products via helpers that just do a basic AJAX GET request to our backend. Once we have retrieved this data we map it to JavaScript objects and then render those objects inside the `index.mustache` template. This will render them in the `<div id="main">` HTML tag, which was defined as the root `element_selector` in the `app.js` file.


## Defining models
  
We need to map the data to JavaScript objects so we can associate the products with the category they belong to and can render the name of the category alongside the product, which looks like this:
  
    karhu.Product = function(attributes, categories) {
      _.extend(this, attributes);

      attachCategory(this, categories);

      function attachCategory(product, categories) {
        product.category = _.find(categories, function(category) {
          return parseInt(category.id, 10) === parseInt(product.category_id, 10);
        });
      }
    };


We extend the object with all the attributes of the product and then we attach the category of the product to the object. `attachCategory` is kept inside the closure to make it a private function. Important to note in this code is the use of the underscore functions which are provided by [Underscore.js](http://documentcloud.github.com/underscore/). Underscore defines helpers for enumerables and helps one to write easy to read, concise code.


## Rendering templates

In the above case, we do not need an additional view layer object because the rendering logic is very basic - it is just iterating over the objects of the products we created and displaying the attributes of each, including the category name we attached beforehand. The logic-free mustache template that will be rendered looks like this:

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


## Moving model specific controller code into the model

It is a matter of taste how much responsibility a controller is given and how much can be refactored into model code. If I want to write the above code in a more model-centric fashion, I could do something like this:

### Controller

    karhu.Products = function(app) {
      app.get('#/products', function(context) {
        karhu.Product.all(function(products) {
          context.partial('templates/products/index.mustache', {products: products});
        });
      });
    };


### Model

    karhu.Product.all = function(callback) {
      karhu.backend.get('/categories', {}, function(categories) {
        karhu.backend.get('/products', function(products) {
          products = products.map(function(product) { return new karhu.Product(product, categories); });
          callback(products);
        });
      });
    };


## Standard tasks and difficulties

There are several tasks that are very common to web development and will be recurrent when working on JavaScript applications. I want to explain how I solved those tasks and which problems I encountered. As usual, there are several different ways to approach an issue.


### Authentication

Most applications, including ours, add basic security by making the user log in before using the application. Since HTTP is stateless, we need to resend the authentication with every request. We can accomplish this by saving a token when first logging in and then using that for every request thereafter. The way I chose to do that was to save a token in local storage once the user had logged in successfully and send that token as a header attached to the XMLHttpRequest. The code to do this looks similar to the following. It is stashed in a backend model which is used by the helpers I mentioned earlier:

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
    
One case is that we already have a token, the other is that the user just logged in and there is a user(name) and a password available. Either way we attach the token or user/password combination as a header and if the request is successful, we know that the user is authenticated successfully. Otherwise the backend will just return an error. This approach was relatively straight forward to implement and the only issue I encountered was that the code became a little complex and unreadable. To fix this I refactored the helpers in to separate model. Abstracting the requests into a backend model is quite common, as, for example, seen in the Backbone.js library where it is a core part of the library. Authentication code is often unique per-application and always depends on the backend and what it expects the frontend to send.


### I18n

A very common library for internationalization in JavaScript applications is [jquery.global.js](http://github.com/jquery/jquery-global). It provides us with methods to format numbers and dates and enables us to translate strings using a dictionary for the current locale. Once we have loaded this dictionary, which is a simple JavaScript object with keys and translated values, the only thing we need to pay attention to is formatting numbers and dates. A sensible place to do that is in the models before rendering the objects to the templates, in the product model it would look something like this:

    var valid_to = Date.parse(product.valid_to);
    product.valid_to = $.global.format(valid_to, "d");


### Validation

One of the benefits of developing in JavaScript is we have the opportunity to give the user real-time feedback. It makes sense to use this potential to validate the data before it is sent to the backend. Note that it is still necessary to validate the data in the backend as well since there might be requests that are not using the frontend. There is a common jQuery library for validations, [jquery.validate.js](http://bassistance.de/jquery-plugins/jquery-plugin-validation/). The library uses a set of rules on a form and shows errors on the appropriate input fields if the content does not match the provided rules. It makes sense to structure those validation rules into the models we already have, so every model has a `validations` function which returns the rules. This is similar to Backbone.js but different from Eyeballs.js where the validations work in a more Rails-like fashion. Here is how the validations for our category model could look:

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

This is the most central and complex part of the application. All objects need to be cached ahead of time so that once we are offline they can be correctly sorted, paginated and filtered. There needs to be a queue for all actions being done before the objects are cached, so that those actions can be applied to the objects as soon as they are cached. There also needs to be a second queue that is filled once we actually are offline, so that when we are back online, everything that was done offline can be patched through to the backend.

There are several issues that need to be addressed outside of the already complicated caching and queuing process. For example, when an object is created when offline, it cannot be updated or deleted without further code because it does not have an id. I worked around that for now by simply disallowing those actions for objects created while offline. Another issue was that categories created while offline cannot be used for creating products; here again the reason being that they do not have an id yet. I simply do not display those categories in the list of available categories for creating a product. Some of those problems might be solved by working with temporary ids and by rearranging the offline queue.

In addition, the available partials and template need to be cached. This can either be done through a cache manifest as defined in HTML5 if the targeted browser group supports it, or simply through loading the partials and putting them into local storage. This is quite simple with Sammy.js and looks something like this:

    context.load('templates/products/index.mustache', {cache: true});

## Integrating into Windows

Internet Explorer 9 is great in running HTML5 applications. Further it gives Web applications the ability to natively integrate into the Windows 7 Operating System with Jump Lists. Jump Lists integration is straightforward, in its simplest level just a declaration of meta tag attributes. This is exactly the approach used in Karhu. Direct jump list tasks to add product and categories and navigate between them. This is how it looks to declare a simple jump list task:

    <meta name="msapplication-task"
          content="name=Products;
          action-uri=/#products;
          icon-uri=/images/karhu.ico" />

## Conclusion

At this point, all of the requirements for the example application were implemented. With enough time one could also handle the issues mentioned above. Tasks like authentication, internationalization and handling business logic need to be coded independent of the frameworks and libraries, which are really just a starting point.

If you always write tests and pay attention to the structure of the application, writing JavaScript production-ready applications that can continue to evolve is, in my opinion, possible and a goal well worth investing in. Getting started is easy, however, it is important to keep checking for a clean code base and refactoring if necessary. If these requirements are met, JavaScript gives you the opportunity to write very elegant and maintainable applications.

The code of the example application can be found on [codeplex](). Other starting points for getting a better understanding of the subject are the documentations of the aforementioned libraries and frameworks, other example applications and, of course, JavaScript books.




# TODO
* I/you vs. we
* Present tense vs. past tense


## Authoren

Frank Prößdorf <<fp@notjusthosting.com>> ([http://fp.njh6.de](http://fp.njh6.de))
Dariusz Parys <<dparys@microsoft.com>> ([http://downtocode.net](http://downtocode.net))
