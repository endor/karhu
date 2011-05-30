# Produkt-Stammdatenpflege als HTML5 Web App

## Running the App

  * The easiest way to run the app is currently to start `ruby lib/proxy.rb`.
  
  
## Testing

  * Install Cucumber and Jasmine Gems
  * Run
    * `rake` for all tests
    * `rake cucumber` for acceptance tests
    * `rake jasmine:ci` for unit tests
  * Note: testapp.rb is the ruby backend used for the acceptance tests.


## TODO

  * When caching for offline work we need to differentiate between 
    retrieving a paginated result and retrieving all results -> Categories page vs. Categories in products.
  * Need to find a way to correctly adjust paginated cached results when an object is added.


## API

### Categories

    GET /categories
    GET /categories/1
    POST /categories
    PUT /categories/1
    DELETE /categories/1
    
    Category {
      id: "1234",
      name: "Kategorie 1",
      description: "Die erste Kategorie"
    }    

### Products

    GET /products
    GET /products/1
    POST /products
    PUT /products/1
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
    
    GET /products?page=1&per_page=3
    
#### Response

    {
      current_page: 1,
      total_pages: 2,
      total_entries: 7,
      per_page: 5,
      values: [{product1}, {product2}, ...]
    }