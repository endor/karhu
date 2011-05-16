module Authentication
  def authentication_header(email, password, path)
    sha_password = Digest::SHA2.hexdigest(password)
    sha = Digest::SHA2.hexdigest(sha_password + email + path)
    %Q{username="#{email}", response="#{sha}", version="1"}
  end
end