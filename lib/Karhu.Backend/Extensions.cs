using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;

namespace Extensions
{
    static class ByteArrayExtensions
    {
        public static string ToString(this byte[] bytes, string format)
        {
            string hexString = null;
            if (format.Substring(0, 1).ToUpper() != "X")
                throw new FormatException(String.Format("{0} is not a valid format string.", format));
            string formatString = "{0:" + format + "}";
            foreach (var value in bytes)
                hexString += String.Format(formatString, value);
            return hexString;
        }

        public static DateTime ToDateTime(this string datetime)
        {
            CultureInfo[] cultures = {
                                         CultureInfo.CreateSpecificCulture("en-US"),
                                         CultureInfo.CreateSpecificCulture("de-DE")
                                     };
            foreach (var culture in cultures)
            {
                DateTime value;
                if (DateTime.TryParse(datetime, culture, DateTimeStyles.None, out value))
                {
                    return value;
                }
            }

            throw new ApplicationException("can't convert");
        }
    }
}
