# Products data management as HTML5 Web App

This is a basic business-oriented application which catalogues products and divides them into categories. Those categories as well as the products can be created, updated and deleted. In addition to this typical CRUD approach, there are other standard tasks that will be handled: internationalization, validation of input and controlling the application via the keyboard. One of the most important aspects of the app is that it will use HTML5 local storage in order to allow offline editing.


## Running the App

The easiest way to run the app is currently to start:

    ruby lib/proxy.rb

  
## Testing

  * Install Cucumber and Jasmine Gems
  * Run
    * `rake` for all tests
    * `rake cucumber` for acceptance tests
    * `rake jasmine:ci` for unit tests
  * Note: `testapp.rb` is the ruby backend used for the acceptance tests.


## Architecture

The app is built upon [Sammy.js](http://sammyjs.org) and the `master` branch is the most current and productive one. There is however a `backbone_js` branch which implements some of the functionality with [Backbone.js](http://documentcloud.github.com/backbone).


## API

### Categories

    GET /categories
    GET /categories/1
    POST /categories - expect created object back
    PUT /categories/1 - expect updated object back
    DELETE /categories/1


    Category {
      id: "1234",
      name: "Kategorie 1",
      description: "Die erste Kategorie"
    }    

### Products

    GET /products
    GET /products/1
    POST /products - expect created object back
    PUT /products/1 - expect updated object back
    DELETE /products/1


    Product {
      id: "5678",
      name: "Product1",
      description: "Beschreibung hier",
      unit_price: "232,00",
      valid_to: "20.12.2012",
      category_id: "1234"
    }
    
### Pagination

#### Request
    
    GET /products?page=1&per_page=5
    
#### Response

    {
      current_page: 1,
      total_pages: 2,
      total_entries: 7,
      per_page: 5,
      values: [{product1}, {product2}, ...]
    }
    
### Sorting

    GET /products?sort=description
    
### Filtering

    GET /products?filter=Strawberry



## Author

  * Frank Prößdorf <<fp@notjusthosting.com>> ([http://fp.njh6.de](http://fp.njh6.de))


## Contributions

Thank you!

  * Hannes Kunstreich <<hannes@kunstreich.name>> ([http://hannes.kunstreich.name](http://hannes.kunstreich.name)) for the Design, Interaction & Frontend