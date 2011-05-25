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

  Scenario: create category when offline
    Given a category "Baeume" with the description "Grosse Pflanzen"
    When I go to the start page
      And I wait for 3s
      And I get disconnected from the internet
      And I follow "Categories"
      And I follow "Add Category"
      And I fill in "Name" with "Elefanten"
      And I fill in "Description" with "Tiere"
      And I press "Add Category"
      And I follow "Add Category"
      And I fill in "Name" with "Tiger"
      And I fill in "Description" with "Tiere"
      And I press "Add Category"
    Then I should see "Baeume"
      And I should see "Elefanten"
      And I should see "Tiger"
    When I get connected to the internet
    Then the api should have received a call to create a category with the name "Elefanten"
      And the api should have received a call to create a category with the name "Tiger"
  
  Scenario: create category fails because of validation errors
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
    When I go to the start page
      And I follow "Categories"
    Then I should see "Baeume" within ".categories_table"
    When I press "delete"
    Then I should not see "Baeume" within ".categories_table"
  
  Scenario: edit category
    Given a category "Musik" with the description "Toene"
    When I go to the start page
      And I follow "Categories"
      And I follow "edit"
      And I fill in "Description" with "Klaenge"
      And I press "Update Category"
    Then I should see "Musik"
      And I should see "Klaenge"
      But I should not see "Toene"
      
  Scenario: edit category when offline
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a category "Musik" with the description "Toene"
    When I go to the start page
      And I wait for 3s
      And I get disconnected from the internet
      And I follow "Categories"
      And I follow "Edit Baeume"
      And I fill in "Description" with "B.A.E.U.M.E."
      And I press "Update Category"
      And I follow "Add Category"
      And I fill in "Name" with "Weine"
      And I fill in "Description" with "Getraenke"
      And I press "Add Category"
      And I follow "Edit Musik"
      And I fill in "Description" with "M.U.S.I.K."
      And I press "Update Category"
    Then I should see "Baeume"
      And I should see "B.A.E.U.M.E."
      And I should see "Weine"
      And I should see "Musik"
      And I should see "M.U.S.I.K."
    When I get connected to the internet
      And the api should have received a call to create a category with the name "Weine"
      And the api should have received a call to update a category with the name "Baeume" and the new description "B.A.E.U.M.E."
      And the api should have received a call to update a category with the name "Musik" and the new description "M.U.S.I.K."
  