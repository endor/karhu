Feature: Pagination
  In order to easily browse through the objects
  As a user
  I want to have pagination

  Background:
    Given I am logged in

  Scenario: paginate categories
    Given a category "Kaffees" with the description "Getraenke"
      And a category "Tees" with the description "Getraenke"
      And a category "Biere" with the description "Getraenke"
      And a category "Weine" with the description "Getraenke"
      And a category "Cognacs" with the description "Getraenke"
      And a category "Portweine" with the description "Getraenke"
      And a category "Grappas" with the description "Getraenke"
    When I go to the start page
      And I follow "Categories"
    Then I should see "1" within ".pagination"
      And I should see "2" within ".pagination"
      And I should not see "Portweine"
      And I should not see "Grappas"
      But I should see "Kaffees"
    When I follow "2"
    Then I should see "Portweine"
      And I should see "Grappas"
      But I should not see "Kaffees"

  Scenario: paginate products
    Given a product "Fichte" with the description "Baum"
      And a product "Kiefer" with the description "Baum"
      And a product "Tanne" with the description "Baum"
      And a product "Ahorn" with the description "Baum"
      And a product "Birke" with the description "Baum"
      And a product "Linde" with the description "Baum"
    When I go to the start page
      And I follow "Products"
    Then I should see "1" within ".pagination"
      And I should see "2" within ".pagination"
      And I should not see "Linde"
      But I should see "Fichte"
    When I follow "2"
    Then I should see "Linde"
      But I should not see "Fichte"
