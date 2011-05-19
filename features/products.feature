Feature: Products
  In order to know which products I have
  As a user
  I want to manage products
  
  Scenario: list products
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a product "Fichte" with the description "Nadelbaum" and the price "232,00" that is valid to "20.12.2027" and belongs to the category "Baeume"
      And a product "Birke" with the description "Laubbaum" and the price "115,75" that is valid to "01.03.2019" and belongs to the category "Baeume"
    When I go to the start page
      And I follow "Products"
    Then I should see "Baeume"
      And I should see "Fichte"
      And I should see "Nadelbaum"
      And I should see "232,00"
      And I should see "20.12.2027"
      And I should see "Birke"