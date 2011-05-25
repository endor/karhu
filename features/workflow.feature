Feature: Workflow
  In order to guarantee an uninterrupted workflow
  As a user
  I want to have make sure nothing I enter is lost

  Scenario: when browser is closed while editing a product, when starting the app I should edit the same product again
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a product "Fichte" with the description "Nadelbaum" and the price "232.00$" that is valid to "12/20/2027" and belongs to the category "Baeume"
      And a product "Tanne" with the description "Nadelbaum" and the price "232.00$" that is valid to "12/20/2027" and belongs to the category "Baeume"
    When I go to the start page
      And I follow "Products"
      And I follow "Edit Tanne"
      And I fill in "Description" with "T.A.N.N.E."
      And I trigger a "change" event on the "product_description"
      And the browser is closed and reopened with the start page
    Then the "Name" field should contain "Tanne"
      And the "Description" field should contain "T.A.N.N.E."
    When I follow "Categories"
    Then the "Name" field should contain "Tanne"
    When I fill in "Description" with "Hans"
      And I press "Cancel"
    Then I should see "Tanne"
      And I should see "Nadelbaum"
      But I should not see "Hans"
  
  Scenario: when browser is closed while adding a product, when starting the app I should add the same product again
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a category "Maeuse" with the description "Tiere"
    When I go to the start page
      And I follow "Products"
      And I follow "Add Product"
      And I fill in "Name" with "Speedy"
      And I trigger a "change" event on the "product_name"
      And I fill in "Description" with "Fastest Mouse in Mexico"
      And I trigger a "change" event on the "product_description"
      And I fill in "Price" with "222222$"
      And I trigger a "change" event on the "product_unit_price"
      And I fill in "Valid To" with "04/04/2020"
      And I trigger a "change" event on the "product_valid_to"
      And I select "Maeuse" from "Category"
      And I trigger a "change" event on the "product_category_id"
      And the browser is closed and reopened with the start page
    Then the "Name" field should contain "Speedy"
      And the "Description" field should contain "Fastest Mouse in Mexico"
      And the "Price" field should contain "222222$"
      And the "Valid To" field should contain "04/04/2020"
      And "Maeuse" should be the selected "Category"
  
  Scenario: when browser is closed while editing a category, when starting the app I should edit the same category again
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a category "Weine" with the description "Getraenke"
      And a product "Fichte" with the description "Nadelbaum" and the price "232.00$" that is valid to "12/20/2027" and belongs to the category "Baeume"
    When I go to the start page
      And I follow "Categories"
      And I follow "Edit Weine"
      And I fill in "Description" with "W.E.I.N.E."
      And I trigger a "change" event on the "category_description"
      And the browser is closed and reopened with the start page
    Then the "Name" field should contain "Weine"
      And the "Description" field should contain "W.E.I.N.E."
    When I follow "Products"
    Then the "Name" field should contain "Weine"
    When I press "Cancel"
    Then I should see "Weine"
      And I should see "Getraenke"
      But I should not see "Hans"
  
  Scenario: when browser is closed while adding a category, when starting the app I should add the same category again
    When I go to the start page
      And I follow "Categories"
      And I follow "Add Category"
      And I fill in "Name" with "Paint"
      And I trigger a "change" event on the "category_name"
      And I fill in "Description" with "it Black"
      And I trigger a "change" event on the "category_description"
      And the browser is closed and reopened with the start page
    Then the "Name" field should contain "Paint"
      And the "Description" field should contain "it Black"
  
  Scenario: see queue when offline
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a product "Fichte" with the description "Nadelbaum" and the price "232.00$" that is valid to "12/20/2027" and belongs to the category "Baeume"
      And a product "Tanne" with the description "Nadelbaum" and the price "232.00$" that is valid to "12/20/2027" and belongs to the category "Baeume"
    When I go to the start page
    Then the "Queue" link should be hidden
    When I wait for 3s
      And I get disconnected from the internet
      And I follow "Products"
      And I follow "Edit Fichte"
      And I fill in "Description" with "F.I.C.H.T.E."
      And I press "Update Product"
      And I follow "Add Product"
      And I fill in "Name" with "Kiefer"
      And I fill in "Description" with "Nadelbaum"
      And I fill in "Price" with "227.25$"
      And I fill in "Valid To" with "01/08/2029"
      And I select "Baeume" from "Category"
      And I press "Add Product"
      And I follow "Edit Tanne"
      And I fill in "Description" with "T.A.N.N.E."
      And I press "Update Product"
      And I follow "Categories"
      And I follow "edit"
      And I fill in "Description" with "Klein"
      And I press "Update Category"
      And I follow "Queue"
    Then I should see "Updated Product Fichte"
      And I should see "F.I.C.H.T.E."
      And I should see "Created Product Kiefer"
      And I should see "Nadelbaum"
      And I should see "Updated Category Baeume"
      And I should see "Klein"
    When I get connected to the internet
    Then the "Queue" link should be hidden  
  
  Scenario: i18n
    When I go to the start page
    Then I should see "Categories"
    When I follow "Deutsch"
    Then I should see "Kategorien"
      But I should not see "Categories"
    When I follow "English"
    Then I should see "Categories"
      But I should not see "Kategorien"
  