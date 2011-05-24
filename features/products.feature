Feature: Products
  In order to know which products I have
  As a user
  I want to manage products
  
  Scenario: list products
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a product "Fichte" with the description "Nadelbaum" and the price "232.00" that is valid to "12/20/2027" and belongs to the category "Baeume"
      And a product "Birke" with the description "Laubbaum" and the price "115.75" that is valid to "03/01/2019" and belongs to the category "Baeume"
    When I go to the start page
      And I follow "Products"
    Then I should see "Baeume"
      And I should see "Fichte"
      And I should see "Nadelbaum"
      And I should see "232.00"
      And I should see "12/20/2027"
      And I should see "Birke"
  
  Scenario: create product
    Given a category "Baeume" with the description "Grosse Pflanzen"
    When I go to the start page
      And I follow "Products"
      And I follow "Add Product"
      And I fill in "Name" with "Tanne"
      And I fill in "Description" with "Nadelbaum"
      And I fill in "Unit Price" with "345.05"
      And I fill in "Valid To" with "04/04/2035"
      And I select "Baeume" from "Category"
      And I press "Add Product"
    Then I should see "Tanne"
      And I should see "Nadelbaum"
      And I should see "345.05"
      And I should see "04/04/2035"
      And I should see "Baeume"

  Scenario: create product when offline
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a product "Fichte" with the description "Nadelbaum" and the price "232.00" that is valid to "12/20/2027" and belongs to the category "Baeume"
    When I go to the start page
      And I wait for 3s
      And I get disconnected from the internet
      And I follow "Products"
      And I follow "Add Product"
      And I fill in "Name" with "Tanne"
      And I fill in "Description" with "Nadelbaum"
      And I fill in "Unit Price" with "345.05"
      And I fill in "Valid To" with "04/04/2035"
      And I select "Baeume" from "Category"
      And I press "Add Product"
      And I follow "Add Product"
      And I fill in "Name" with "Kiefer"
      And I fill in "Description" with "Nadelbaum"
      And I fill in "Unit Price" with "227.25"
      And I fill in "Valid To" with "01/08/2029"
      And I select "Baeume" from "Category"
      And I press "Add Product"
    Then I should see "Fichte"
      And I should see "Tanne"
      And I should see "Kiefer"
    When I get connected to the internet
    Then the api should have received a call to create a product with the name "Tanne"
      And the api should have received a call to create a product with the name "Kiefer"

  Scenario: delete product
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a product "Fichte" with the description "Nadelbaum" and the price "232.00" that is valid to "12/20/2027" and belongs to the category "Baeume"
    When I go to the start page
      And I follow "Products"
    Then I should see "Fichte" within ".products_table"
    When I press "delete"
    Then I should not see "Fichte" within ".products_table"
  
  Scenario: edit product
    Given a category "Alphabete" with the description "ABC"
      And a category "Baeume" with the description "Grosse Pflanzen"
      And a product "Fichte" with the description "Nadelbaum" and the price "232.00" that is valid to "12/20/2027" and belongs to the category "Baeume"
    When I go to the start page
      And I follow "Products"
      And I follow "edit"
    Then "Baeume" should be the selected "Category"
    When I fill in "Description" with "Gruen"
      And I press "Update Product"
    Then I should see "Fichte"
      And I should see "Gruen"
      But I should not see "Nadelbaum"