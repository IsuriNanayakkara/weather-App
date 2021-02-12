
    
 
    function readFile()
    {
        var cityarr;
        const data = require('./cities.json');
        var myarr = JSON.parse(data);
    
     for(var i=0;i<myarr.length;i++)
     {
         cityarr = push(myarr[i].CityCode);
     }
       return cityarr;
    }
    function createString(cityarr)
    {
        var stringCodes;
        for(var i=0;i<cityarr.length;i++)
        {
            if(i == 0)
            {
                stringCodes = cityarr[i];
            }
            else
            {
                stringCodes = ','+cityarr[i] ;
            }
        }
    }
   
    function getDetails(stringCodes)
    {
        var output;
        var appid = '795b90162de06be2288a1534c158d03c';
        var link =  'http://api.openweathermap.org/data/2.5/group?id=' + stringCodes + '8&appid=' + appid;
       
        fetch(link)
        .then(res => res.json())
        .then((data => output = data)
       
        ).catch(err => console.error(err));

        return output;
    }


   