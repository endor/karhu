Feature: Filter
  In order to easily find the category or product I am looking for
  As a user
  I want to filter categories and products

  Scenario: filter categories
    Given a category "Kaffees" with the description "HH"
      And a category "Tees" with the description "GG"
      And a category "Biere" with the description "FF"
      And a category "Weine" with the description "EE"
      And a category "Sherries" with the description "AA"
      And I am logged in
    When I go to the start page
      And I follow "Categories"
      And I fill in "search" with "ee"
    Then I should see "Kaffees"
      And I should see "Tees"
      And I should see "Weine"
      But I should not see "Biere"
      And I should not see "Sherries"
      
  Scenario: filter products
    Given a category "Biere" with the description "Getraenke"
      And a product "Becks" with the description "Deutschland" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Baltika Klassitscheskoye" with the description "Russland" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Belhaven St. Andrews Ale" with the description "Großbritannien" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And I am logged in
    When I go to the start page
      And I follow "Products"
      And I fill in "search" with "Be"
    Then I should see "Becks"
      And I should see "Belhaven St. Andrews Ale"
      But I should not see "Baltika Klassitscheskoye"