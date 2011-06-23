Feature: Categories
  In order to easily manage products
  As a user
  I want to create, list and delete categories

  Scenario: list categories
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a category "Boote" with the description "Dinger die im Wasser schwimmen"
      # And I am logged in
    When I go to the start page
      And I follow "Categories"
    Then I should see "Baeume"
      And I should see "Boote"
      And I should see "Grosse Pflanzen"
      And I should see "Dinger die im Wasser schwimmen"
  
  Scenario: create category
    # Given I am logged in
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
  
  Scenario: create category fails because of validation errors
    # Given I am logged in
    When I go to the start page
      And I follow "Categories"
      And I follow "Add Category"
      And I fill in "Description" with "Fluessige Dinge"
      And I press "Add Category"
    Then I should see "cannot be empty"
    When I fill in "Name" with "Getraenke"
      And I fill in "Description" with ""
    Then I should see "cannot be empty"
  
  Scenario: delete category
    Given a category "Baeume" with the description "Grosse Pflanzen"
      # And I am logged in
    When I go to the start page
      And I follow "Categories"
    Then I should see "Baeume" within ".categories_table"
    When I press "delete"
    Then I should not see "Baeume" within ".categories_table"
  
  Scenario: edit category
    Given a category "Musik" with the description "Toene"
      # And I am logged in
    When I go to the start page
      And I follow "Categories"
      And I follow "edit"
      And I fill in "Description" with "Klaenge"
      And I press "Update Category"
    Then I should see "Musik"
      And I should see "Klaenge"
      But I should not see "Toene"
  