Feature: Session
  In order to protect the data
  As a site owner
  I want users to log in
  
  Scenario: log in
    When I go to the start page
    Then I should not see "Add Product"
    When I fill in "User" with "user"
      And I fill in "Password" with "wrongpassword"
      And I press "Log in"
    Then I should see "Invalid user/password combination"
    When I fill in "Password" with "password"
      And I press "Log in"
    Then I should see "Add Product"
  

  # Scenario: log out
  # 
  # 