const serverUrl = 'http://52.221.233.101:3000/';
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
                console.error(error);           
                return reject(error) ;         
            })
    })
}

