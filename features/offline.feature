Feature: Offline
  In order to continue working when offline
  As a user
  I want all the data and functionality available offline

  Scenario: create product when offline
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a product "Fichte" with the description "Nadelbaum" and the price "232.00€" that is valid to "12/20/2027" and belongs to the category "Baeume"
      And I am logged in
    When I go to the start page
      And I follow "Products"
      And I wait for 3s
      And I get disconnected from the internet
      And I follow "Add Product"
      And I fill in "Name" with "Tanne"
      And I fill in "Description" with "Nadelbaum"
      And I fill in "Price" with "345.05€"
      And I fill in "Valid To" with "04/04/2035"
      And I select "Baeume" from "Category"
      And I press "Add Product"
      And I follow "Add Product"
      And I fill in "Name" with "Kiefer"
      And I fill in "Description" with "Nadelbaum"
      And I fill in "Price" with "227.25€"
      And I fill in "Valid To" with "01/08/2029"
      And I select "Baeume" from "Category"
      And I press "Add Product"
    Then I should see "Fichte"
      And I should see "Tanne"
      And I should see "Kiefer"
    When I get connected to the internet
    Then the api should have received a call to create a product with the name "Tanne"
      And the api should have received a call to create a product with the name "Kiefer"

  Scenario: edit product when offline
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a product "Fichte" with the description "Nadelbaum" and the price "232.00€" that is valid to "12/20/2027" and belongs to the category "Baeume"
      And a product "Tanne" with the description "Nadelbaum" and the price "232.00€" that is valid to "12/20/2027" and belongs to the category "Baeume"
      And I am logged in
    When I go to the start page
      And I follow "Products"
      And I wait for 3s
      And I get disconnected from the internet
      And I follow "Edit Fichte"
      And I fill in "Description" with "F.I.C.H.T.E."
      And I press "Update Product"
      And I follow "Add Product"
      And I fill in the product details for "Kiefer"
      And I press "Add Product"
      And I follow "Edit Tanne"
      And I fill in "Description" with "T.A.N.N.E."
      And I press "Update Product"
    Then I should see "Fichte"
      And I should see "F.I.C.H.T.E."
      And I should see "Kiefer"
      And I should see "Tanne"
      And I should see "T.A.N.N.E."
    When I get connected to the internet
      And the api should have received a call to create a product with the name "Kiefer"
      And the api should have received a call to update a product with the name "Fichte" and the new description "F.I.C.H.T.E."
      And the api should have received a call to update a product with the name "Tanne" and the new description "T.A.N.N.E."

  Scenario: create category when offline
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And I am logged in
    When I go to the start page
      And I follow "Categories"
      And I wait for 3s
      And I get disconnected from the internet
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

  Scenario: edit category when offline
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a category "Musik" with the description "Toene"
      And I am logged in
    When I go to the start page
      And I follow "Categories"
      And I wait for 3s
      And I get disconnected from the internet
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
