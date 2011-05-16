Feature: Change password
  In order to enhance security
  As a stakeholder
  I want customers to change their password
  
  Scenario: change password
    Given a user "joe@doe.com" with password "s3cr3t"
    When I go to the start page
      And I log in as "joe@doe.com/s3cr3t"
      And I follow "Your Account"
      And I follow "Change Password"
      And I fill in "s3cr3t" for "Old Password"
      And I fill in "secret" for "New Password"
      And I fill in "secret" for "Confirm Password"
      And I press "Change Password"
    Then I should see "Password Changed"
      And the api should have received a password update for "joe@doe.com" with the old password "s3cr3t" and the new password "secret"
  
    Scenario: update fails
      Given a user "joe@doe.com" with password "s3cr3t"
      When I go to the start page
        And I log in as "joe@doe.com/s3cr3t"
        And I follow "Your Account"
        And I follow "Change Password"
        And I fill in "s4cr3t" for "Old Password"
        And I fill in "secret" for "New Password"
        And I fill in "secreet" for "Confirm Password"
        And I press "Change Password"
      Then I should see "is invalid"
        And I should see "does not match password"
        And the api should not have received a password update for "joe@doe.com"
    
    
    