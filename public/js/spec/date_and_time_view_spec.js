describe 'DateAndTimeView'
  before_each  
    old_month = Date.prototype.getMonth
    old_date = Date.prototype.getDate
  end

  after_each
    Date.prototype.getMonth = old_month
    Date.prototype.getDate = old_date
  end


  describe 'dates'
    it 'should add the next four days as dates'
      Date.prototype.getMonth = function() { return 09 }
      Date.prototype.getDate = function() { return 02 }
      DateAndTimeView().dates.should.eql([{date: 'Today (10/02)'}, {date: '10/03'}, {date: '10/04'}, {date: '10/05'}])
    end
  end
  
  describe 'times'
    it 'should add all half hours as times'
      DateAndTimeView().times.length.should.equal(24)
      DateAndTimeView().times[1].time.should.equal('01:30')
    end
  end
end