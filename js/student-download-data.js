(function() {

  fetch( 
    'data/2023_SLV.json', {
      method: "GET",
      mode: "same-origin",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "error",
      referrerPolicy: "strict-origin-when-cross-origin" 
    } 
  ).then(response => response.json()).then(jsonObj => {

    sessionStorage.setItem( 'data', JSON.stringify(jsonObj) );

  });

})();