Feature: Categories
  In order to easily manage products
  As a user
  I want to create, list and delete categories

  Scenario: list categories
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a category "Boote" with the description "Dinger die im Wasser schwimmen"
    When I go to the start page
      And I follow "Categories"
    Then I should see "Baeume"
      And I should see "Boote"
      And I should see "Grosse Pflanzen"
      And I should see "Dinger die im Wasser schwimmen"
  
  Scenario: create category
    When I go to the start page
      And I follow "Categories"
      And I follow "Add Category"
      And I fill in "Name" with "Getraenke"
      And I fill in "Description" with "Fluessige Dinge"
      And I press "Add Category"
      And I follow "Add Category"
      And I fill in "Name" with "Brote"
      And I fill in "Description" with "Gebacken"
      And I press "Add Category"
    Then I should see "Getraenke"
      And I should see "Fluessige Dinge"
      And I should see "Brote"
      And I should see "Gebacken"
  