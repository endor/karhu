require 'date'

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

  def sort(array, sort_by)
    if sort_by == 'category'
      file = ROOT + "/features/fixtures/categories.json"
      categories = File.exists?(file) ? JSON.parse(File.read(file)) : []  
    end
    
    array.sort_by do |object|
      if sort_by == 'valid_to'
        Date.parse(object['valid_to'])
      elsif sort_by == 'category'
        category = categories.find{|c| c['id'] == object['category_id']}
        category['name']
      else
        object[sort_by]
      end
    end
  end
  
  def paginate(array, page, per_page)
    paginated_results = array.paginate(:page => page, :per_page => per_page)
    {
      :current_page => paginated_results.current_page,
      :total_pages => paginated_results.total_pages,
      :total_entries => paginated_results.total_entries,
      :per_page => (per_page || 30),
      :values => paginated_results.to_a
    }
  end
end