let auth0 = null;
const fetchAuthConfig = () => fetch("/auth_config.json");

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
  
    auth0 = await createAuth0Client({
      domain: config.domain,
      client_id: config.clientId
    });
  };

  window.onload = async () => {
    await configureClient();

    updateUI();

    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
      // show the gated content
      return;
    }
  
    // NEW - check for the code and state parameters
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
  
      // Process the login state
      await auth0.handleRedirectCallback();
      
      updateUI();
  
      // Use replaceState to redirect the user away and remove the querystring parameters
      window.history.replaceState({}, document.title, "/");
    }
  }

  const updateUI = async () => {
    const isAuthenticated = await auth0.isAuthenticated();
  
    

    if (isAuthenticated) {

        document.getElementById("btn-logout").classList.remove("hidden");
        document.getElementById("indexH2Id").classList.add("hidden");
        document.getElementById("gated-content").classList.remove("hidden");
        generateWheatherData();
        document.getElementById(
          "ipt-access-token"
        ).innerHTML = await auth0.getTokenSilently();
        

        document.getElementById("ipt-user-profile").textContent = JSON.stringify(
          await auth0.getUser()
        );

    
      } else {
        document.getElementById("indexH2Id").classList.remove("hidden");
        document.getElementById("gated-content").classList.add("hidden");
      }
  };


  const login = async () => {
    await auth0.loginWithRedirect({
      redirect_uri: window.location.origin
    });
  };
  const logout = () => {
    auth0.logout({
      returnTo: window.location.origin
    });
  };

 function generateWheatherData() {
    console.log("Hiiii"); 
    $.getJSON("../cities.json", function (data) {
        console.log(data.List); 
        var myarr = data.List;
        var citycodes;
        for (var i = 0; i < myarr.length; i++) {

            if (i == 0) {
                citycodes = myarr[i].CityCode;
            } else {
                citycodes += "," + myarr[i].CityCode;
            }


        }
        getDetails(citycodes);



    }).fail(function () {
        console.log("An error has occurred.");
    });
}


function getDetails(stringCodes) {
    var output;
    var appid = '795b90162de06be2288a1534c158d03c';
    var link = 'http://api.openweathermap.org/data/2.5/group?id=' + stringCodes + '&units=metric&appid=' + appid;
    console.log(link);

    fetch(link)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            //   console.log(response.json());
            return response.json();
        })
        .then(json => {
            console.log(json.list);
            populateTable(json.list);


        })
        .catch(function () {
            this.dataError = true;
        })
    //  console.log(data.List);
    // return data.List;
}

function populateTable(items) {
    console.log(items);
    const table = document.getElementById("testBody");

    items.forEach(item => {
        console.log(item.id);
        let row = table.insertRow();
        let Id = row.insertCell(0);
        Id.innerHTML = item.id;
        let name = row.insertCell(1);
        name.innerHTML = item.name;

        let temp = row.insertCell(2);
        temp.innerHTML = item.main.temp + "°C";
        let weather_description = row.insertCell(3);
        weather_description.innerHTML = item.weather[0].description;
    });
}