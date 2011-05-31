Feature: Pagination
  In order to easily browse through the objects
  As a user
  I want to have pagination

  Scenario: paginate categories
    Given I am logged in
      And a category "Kaffees" with the description "Getraenke"
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
    Given I am logged in
      And a product "Fichte" with the description "Baum"
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
  
  Scenario: pagination when working offline
    Given a category "Kaffees" with the description "Getraenke"
      And a category "Tees" with the description "Getraenke"
      And a category "Biere" with the description "Getraenke"
      And a category "Weine" with the description "Getraenke"
      And a category "Cognacs" with the description "Getraenke"
      And a category "Portweine" with the description "Getraenke"
      And a category "Grappas" with the description "Getraenke"
      And a category "Sherries" with the description "Getraenke"
      And a category "Vodkas" with the description "Getraenke"
      And a category "Whiskeys" with the description "Getraenke"
      And a category "Obstler" with the description "Getraenke"
      And I am logged in
    When I go to the start page
      And I follow "Categories"
      And I wait for 3s
    Then I should see "Biere" within ".categories_table"
    When I press "Delete Biere"
      And I follow "Edit Tees"
      And I fill in "Description" with "Heisse Getraenke"
      And I press "Update Category"
      And I get disconnected from the internet
      And I follow "Products"
      And I follow "Categories"
    Then I should not see "Biere" within ".categories_table"
      And I should not see "Vodkas" within ".categories_table"
      And I should not see "Grappas"
      But I should see "Kaffees"
      And I should see "Portweine"
      And I should see "Heisse Getraenke"
    When I follow "2"
    Then I should see "Grappas"
      But I should not see "Kaffees"
    When I follow "Edit Grappas"
      And I fill in "Description" with "Italienische Getraenke"
      And I press "Update Category"
      And I follow "Add Category"
      And I fill in "Name" with "Tequilas"
      And I fill in "Description" with "Getraenke"
      And I press "Add Category"
      And I follow "3"
    Then I should see "Tequilas"
      But I should not see "Kaffees"
      And I should not see "Grappas"
    When I get connected to the internet
    Then the api should have received a call to create a category with the name "Tequilas"
      And the api should have received a call to update a category with the name "Grappas" and the new description "Italienische Getraenke"    