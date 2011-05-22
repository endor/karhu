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


## API

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