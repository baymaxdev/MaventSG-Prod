const serverUrl = 'http://54.179.160.81:3000/';
export default function request(apiName, option){
    let myRequest = new Request(serverUrl + apiName, option);
    return new Promise((resolve, reject) => {
        fetch(myRequest)
            .then((response) => {
                return response.json();
                //  else{
                //      return reject(response) ;
                //  }
            })

            .then((response) => {
                return resolve(response);
            })

            .catch((error) => {
                return reject(error);
            })
    })
}

