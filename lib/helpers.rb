module Helpers
  def cast_values_to_correct_types(params)
    new_params = {}
    params.each do |key, value|
      if key.match(/\_id/) || key == 'id'
        new_params[key] = value.to_i
      else
        new_params[key] = value
      end
    end
    new_params    
  end
  
  def fixtures_path
    File.join(ROOT, "features", "fixtures")
  end
end