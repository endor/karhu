module Authentication
  def authentication_header(user, password)
    sha = Digest::SHA2.hexdigest(user + password)
    %Q{user="#{user}", token="#{sha}"}
  end
  
  def authorized?
    received_credentials = request.env['HTTP_X_KARHU_AUTHENTICATION']

    user, password = credentials
    token = Digest::SHA2.hexdigest(user + password)

    "user=\"#{user}\", token=\"#{token}\"" == received_credentials
  end
end