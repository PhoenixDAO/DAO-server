let jwt = require('jsonwebtoken')
   // key will come from env
   let key = 'hello'


export const encryptData = async (data) => {
    let ecryptedData 
    try{
        console.log('Request abc   ', data)
        ecryptedData = jwt.sign(data.toJSON(), key)
         console.log('Encrypted data     ',ecryptedData)
         return ecryptedData
     
    } catch(err){
        console.log('Error in encrypt data', err)
    }
   }

export const  decryptData = async (data: any) => {
    try{
        console.log('Decrypt data running', data.encrypt.value)
        const bearer = data.encrypt.value.split(' ');
        console.log('Bearer', bearer)
        const token = bearer[0];
        const decryptData = jwt.verify(token, key);
        // let decryptedData = await jwt.decode(data, key)
        console.log(decryptData)
        return decryptData

    }catch(err){
        console.log('Error', err)
        throw err
    }
}
