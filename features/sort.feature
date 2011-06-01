Feature: Sort
  In order to easily find the category or product I am looking for
  As a user
  I want to sort categories and products
  
  Scenario: sort categories
    Given a category "Kaffees" with the description "HH"
      And a category "Tees" with the description "GG"
      And a category "Biere" with the description "FF"
      And a category "Weine" with the description "EE"
      And a category "Cognacs" with the description "DD"
      And a category "Portweine" with the description "CC"
      And a category "Grappas" with the description "BB"
      And a category "Sherries" with the description "AA"
      And I am logged in
    When I go to the start page
      And I follow "Categories"
      And I follow "Name"
    Then I should see "Biere" before "Kaffees"
      And I should see "Grappas" before "Kaffees"
      But I should not see "Sherries"
      And I should not see "Tees"
      And I should not see "Weine"
    When I follow "Description"
    Then I should see "Sherries" before "Grappas"
      And I should see "Portweine" before "Cognacs"
      But I should not see "Biere"
      And I should not see "Tees"
      And I should not see "Kaffees"
  
  @wip
  Scenario: reverse sort categories
    Given a category "Kaffees" with the description "HH"
      And a category "Tees" with the description "GG"
      And a category "Biere" with the description "FF"
      And a category "Weine" with the description "EE"
      And a category "Cognacs" with the description "DD"
      And a category "Portweine" with the description "CC"
      And a category "Grappas" with the description "BB"
      And a category "Sherries" with the description "AA"
      And I am logged in
    When I go to the start page
      And I follow "Categories"
    When I follow "Description"
      And I follow "Description"
    Then I should see "Kaffees" before "Tees"
      And I should see "Biere" before "Weine"
      But I should not see "Portweine"
      And I should not see "Grappas"
      And I should not see "Sherries"
  
  Scenario: keep sorting categories even when switching to the next page
    Given a category "Kaffees" with the description "HH"
      And a category "Tees" with the description "GG"
      And a category "Biere" with the description "FF"
        And a category "Weine" with the description "EE"
        And a category "Cognacs" with the description "DD"
        And a category "Portweine" with the description "CC"
        And a category "Grappas" with the description "BB"
        And a category "Sherries" with the description "AA"
      And a category "Vodkas" with the description "II"
      And a category "Whiskeys" with the description "JJ"
      And a category "Obstler" with the description "KK"      
      And I am logged in
    When I go to the start page
      And I follow "Categories"
      And I follow "Description"
    Then I should see "Sherries" before "Grappas"
      And I should see "Portweine" before "Cognacs"
    When I follow "2"
    Then I should see "Biere" before "Tees"
      And I should see "Kaffees" before "Vodkas"
  
  Scenario: sort products by name and description
    Given a category "Biere" with the description "Getraenke"
      And a product "Becks" with the description "Deutschland" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Anchor Steam Beer" with the description "U.S.A." and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Baltika Klassitscheskoye" with the description "Russland" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Belhaven St. Andrews Ale" with the description "Großbritannien" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Olvi" with the description "Finnland" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Bud Super Strong" with the description "Tschechien" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And I am logged in
    When I go to the start page
      And I follow "Products"
      And I follow "Name"
    Then I should see "Anchor Steam Beer" before "Baltika Klassitscheskoye"
      And I should not see "Olvi"
    When I follow "Description"
    Then I should see "Becks" before "Baltika Klassitscheskoye"
      And I should not see "Anchor Steam Beer"
  
  Scenario: sort products by price
    Given a category "Biere" with the description "Getraenke"
      And a product "Becks" with the description "Deutschland" and the price "1.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Anchor Steam Beer" with the description "U.S.A." and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Baltika Klassitscheskoye" with the description "Russland" and the price "3.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Belhaven St. Andrews Ale" with the description "Großbritannien" and the price "4.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Olvi" with the description "Finnland" and the price "5.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Bud Super Strong" with the description "Tschechien" and the price "6.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And I am logged in
    When I go to the start page
      And I follow "Products"
      And I follow "Price"
    Then I should see "Becks" before "Anchor Steam Beer"
      And I should see "Baltika Klassitscheskoye" before "Belhaven St. Andrews Ale"
      And I should see "Olvi"
      But I should not see "Bud Super Strong"
  
  Scenario: sort products by valid to
    Given a category "Biere" with the description "Getraenke"
      And a product "Becks" with the description "Deutschland" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Anchor Steam Beer" with the description "U.S.A." and the price "2.00€" that is valid to "05/20/2013" and belongs to the category "Biere"
      And a product "Baltika Klassitscheskoye" with the description "Russland" and the price "2.00€" that is valid to "05/22/2013" and belongs to the category "Biere"
      And a product "Belhaven St. Andrews Ale" with the description "Großbritannien" and the price "2.00€" that is valid to "12/22/2010" and belongs to the category "Biere"
      And a product "Olvi" with the description "Finnland" and the price "2.00€" that is valid to "12/20/2018" and belongs to the category "Biere"
      And a product "Bud Super Strong" with the description "Tschechien" and the price "2.00€" that is valid to "12/20/2010" and belongs to the category "Biere"
      And I am logged in
    When I go to the start page
      And I follow "Products"
      And I follow "Valid To"
    Then I should see "Bud Super Strong" before "Belhaven St. Andrews Ale"
      And I should see "Becks" before "Anchor Steam Beer"
      And I should see "Anchor Steam Beer" before "Baltika Klassitscheskoye"
      But I should not see "Olvi"
  
  Scenario: sort products by category
    Given a category "BB" with the description "BB"
      And a category "AA" with the description "AA"
      And a category "CC" with the description "CC"
      And a category "DD" with the description "DD"
      And a category "EE" with the description "EE"
      And a category "FF" with the description "FF"
      And a product "11" with the description "11" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "FF"
      And a product "22" with the description "22" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "BB"
      And a product "33" with the description "33" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "DD"
      And a product "44" with the description "44" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "CC"
      And a product "55" with the description "55" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "AA"
      And a product "66" with the description "66" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "EE"
      And I am logged in
    When I go to the start page
      And I follow "Products"
      And I follow "Category"
    Then I should see "55" before "22"
      And I should see "44" before "33"
      And I should see "33" before "66"
      But I should not see "11"
  
  Scenario: sort categories offline
    Given a category "Kaffees" with the description "HH"
      And a category "Tees" with the description "GG"
      And a category "Biere" with the description "FF"
      And a category "Weine" with the description "EE"
      And a category "Cognacs" with the description "DD"
      And a category "Portweine" with the description "CC"
      And a category "Grappas" with the description "BB"
      And a category "Sherries" with the description "AA"
      And I am logged in
    When I go to the start page
      And I follow "Categories"
      And I wait for 3s
      And I get disconnected from the internet
      And I follow "Name"
    Then I should see "Biere" before "Kaffees"
      And I should see "Grappas" before "Kaffees"
      But I should not see "Sherries"
      And I should not see "Tees"
      And I should not see "Weine"
    When I follow "Description"
    Then I should see "Sherries" before "Grappas"
      And I should see "Portweine" before "Cognacs"
      But I should not see "Biere"
      And I should not see "Tees"
      And I should not see "Kaffees"
  
  Scenario: sort products by name and description offline
    Given a category "Biere" with the description "Getraenke"
      And a product "Becks" with the description "Deutschland" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Anchor Steam Beer" with the description "U.S.A." and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Baltika Klassitscheskoye" with the description "Russland" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Belhaven St. Andrews Ale" with the description "Großbritannien" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Olvi" with the description "Finnland" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Bud Super Strong" with the description "Tschechien" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And I am logged in
    When I go to the start page
      And I follow "Products"
      And I wait for 3s
      And I get disconnected from the internet
      And I follow "Name"
    Then I should see "Anchor Steam Beer" before "Baltika Klassitscheskoye"
      And I should not see "Olvi"
    When I follow "Description"
    Then I should see "Becks" before "Baltika Klassitscheskoye"
      And I should not see "Anchor Steam Beer"
  
  Scenario: sort products by price offline
    Given a category "Biere" with the description "Getraenke"
      And a product "Becks" with the description "Deutschland" and the price "1.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Anchor Steam Beer" with the description "U.S.A." and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Baltika Klassitscheskoye" with the description "Russland" and the price "3.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Belhaven St. Andrews Ale" with the description "Großbritannien" and the price "4.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Olvi" with the description "Finnland" and the price "5.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Bud Super Strong" with the description "Tschechien" and the price "6.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And I am logged in
    When I go to the start page
      And I follow "Products"
      And I wait for 3s
      And I get disconnected from the internet
      And I follow "Price"
    Then I should see "Becks" before "Anchor Steam Beer"
      And I should see "Baltika Klassitscheskoye" before "Belhaven St. Andrews Ale"
      And I should see "Olvi"
      But I should not see "Bud Super Strong"
  
  Scenario: sort products by valid to
    Given a category "Biere" with the description "Getraenke"
      And a product "Becks" with the description "Deutschland" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "Biere"
      And a product "Anchor Steam Beer" with the description "U.S.A." and the price "2.00€" that is valid to "05/20/2013" and belongs to the category "Biere"
      And a product "Baltika Klassitscheskoye" with the description "Russland" and the price "2.00€" that is valid to "05/22/2013" and belongs to the category "Biere"
      And a product "Belhaven St. Andrews Ale" with the description "Großbritannien" and the price "2.00€" that is valid to "12/22/2010" and belongs to the category "Biere"
      And a product "Olvi" with the description "Finnland" and the price "2.00€" that is valid to "12/20/2018" and belongs to the category "Biere"
      And a product "Bud Super Strong" with the description "Tschechien" and the price "2.00€" that is valid to "12/20/2010" and belongs to the category "Biere"
      And I am logged in
    When I go to the start page
      And I follow "Products"
      And I wait for 3s
      And I get disconnected from the internet
      And I follow "Valid To"
    Then I should see "Bud Super Strong" before "Belhaven St. Andrews Ale"
      And I should see "Becks" before "Anchor Steam Beer"
      And I should see "Anchor Steam Beer" before "Baltika Klassitscheskoye"
      But I should not see "Olvi"
  
  Scenario: sort products by category offline
    Given a category "BB" with the description "BB"
      And a category "AA" with the description "AA"
      And a category "CC" with the description "CC"
      And a category "DD" with the description "DD"
      And a category "EE" with the description "EE"
      And a category "FF" with the description "FF"
      And a product "11" with the description "11" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "FF"
      And a product "22" with the description "22" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "BB"
      And a product "33" with the description "33" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "DD"
      And a product "44" with the description "44" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "CC"
      And a product "55" with the description "55" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "AA"
      And a product "66" with the description "66" and the price "2.00€" that is valid to "12/20/2012" and belongs to the category "EE"
      And I am logged in
    When I go to the start page
      And I follow "Products"
      And I wait for 3s
      And I get disconnected from the internet
      And I follow "Category"
    Then I should see "55" before "22"
      And I should see "44" before "33"
      And I should see "33" before "66"
      But I should not see "11"