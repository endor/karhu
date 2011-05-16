module NavigationHelpers
  def path_to(page_name)
    case page_name
    when /start page/
      "/"
    when /checkout page/
      '#/checkout'
    when /thank you page/
      '#/checkout/thank_you'
    when /restaurants page/
      '#/restaurants'
    else
      raise "Can't find mapping from \"#{page_name}\" to a path."
    end
  end
end

World(NavigationHelpers)