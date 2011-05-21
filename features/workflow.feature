Feature: Workflow
  In order to guarantee an uninterrupted workflow
  As a user
  I want to have make sure nothing I enter is lost

  Scenario: when browser is closed while editing a product, when starting the app I should edit the same product again
    Given a category "Baeume" with the description "Grosse Pflanzen"
      And a product "Fichte" with the description "Nadelbaum" and the price "232.00" that is valid to "12/20/2027" and belongs to the category "Baeume"
      And a product "Tanne" with the description "Nadelbaum" and the price "232.00" that is valid to "12/20/2027" and belongs to the category "Baeume"
    When I go to the start page
      And I follow "Products"
      And I follow "Edit Tanne"
      And the browser is closed and reopened with the start page
    Then the "Name" field should contain "Tanne"
  