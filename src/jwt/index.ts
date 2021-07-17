let jwt = require('jsonwebtoken')
   // key will come from env
   let key = 'hello'

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

const testDecryptData = async (data: any) => {
    const bearer = data.split(' ');
    console.log('Bearer ', bearer)
    const token = bearer[1];
    console.log('Token', token)
    const decryptData = jwt.verify(token, key);
    // let decryptedData = await jwt.decode(data, key)
    console.log(decryptData)
    return decryptData
}

// decryptData('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJIZWxsbyIsImxhc3ROYW1lIjoiV29ybGQiLCJuYW1lIjoiOSIsImNvdW50cnkiOiJBbmd1aWxsYSIsImVtYWlsIjoiaGVsbG93b3JsZEB4b3JkLmNvbSIsImRlc2NyaXB0aW9uIjoiOSIsImdpdGh1YkxpbmsiOiJnaXRodWIuY29tL2EiLCJidWRnZXQiOiI5IiwicHVycG9zZSI6IjkiLCJpbXBvcnRhbmNlIjoiOSIsImV4cGVyaWVuY2VkWWVhciI6IjkiLCJkdXJhdGlvbiI6IjkiLCJjb2xsYXRlcmFsIjoiMTAiLCJyZXdhcmQiOiIxIiwibnVtaW9BZGRyZXNzIjoiMHg3M0E5QjA0OUY4OTI1NTEzREUyRDBiNzJCNjFmZjQxN0Q3Q0Q2NzEyIiwidHhIYXNoIjoiMHg5M0Q3MzFlMTAuMzk1MDUzMTk3OTM0MTcwMjYweDkzRDczMWUxMC45MjI0MDIyOTA0OTgxMTI4OTc0ZTJCNTY4NkIyODJEYWJGNGVjNTQ3MWVERDg2RDkwLjk5Mzc1MTU4MTQ3OTAzODMiLCJtaWxlc3RvbmUiOlt7InRhc2siOiI5IiwiZGVzY3JpcHRpb24iOiI5IiwiZXN0aW1hdGVkRGF5cyI6IjkiLCJudW1iZXJPZkRldmVsb3BlcnMiOiI5IiwibWlsZXN0b25lQ29zdCI6IjkifV0sInVzZXJQcm9mZXNzaW9uIjoiUHJvamVjdCBNYW5hZ2VyIiwiaWF0IjoxNjI2NTAyNzgwfQ.Ebx3bqSIQ-gRSTLk6ftvTLwzQrb0zWir9ZgCKRuREAU')
// testDecryptData('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJIZWxsbyIsImxhc3ROYW1lIjoiV29ybGQiLCJuYW1lIjoiOSIsImNvdW50cnkiOiJBbmd1aWxsYSIsImVtYWlsIjoiaGVsbG93b3JsZEB4b3JkLmNvbSIsImRlc2NyaXB0aW9uIjoiOSIsImdpdGh1YkxpbmsiOiJnaXRodWIuY29tL2EiLCJidWRnZXQiOiI5IiwicHVycG9zZSI6IjkiLCJpbXBvcnRhbmNlIjoiOSIsImV4cGVyaWVuY2VkWWVhciI6IjkiLCJkdXJhdGlvbiI6IjkiLCJjb2xsYXRlcmFsIjoiMTAiLCJyZXdhcmQiOiIxIiwibnVtaW9BZGRyZXNzIjoiMHg3M0E5QjA0OUY4OTI1NTEzREUyRDBiNzJCNjFmZjQxN0Q3Q0Q2NzEyIiwidHhIYXNoIjoiMHg5M0Q3MzFlMTAuMzk1MDUzMTk3OTM0MTcwMjYweDkzRDczMWUxMC45MjI0MDIyOTA0OTgxMTI4OTc0ZTJCNTY4NkIyODJEYWJGNGVjNTQ3MWVERDg2RDkwLjk5Mzc1MTU4MTQ3OTAzODMiLCJtaWxlc3RvbmUiOlt7InRhc2siOiI5IiwiZGVzY3JpcHRpb24iOiI5IiwiZXN0aW1hdGVkRGF5cyI6IjkiLCJudW1iZXJPZkRldmVsb3BlcnMiOiI5IiwibWlsZXN0b25lQ29zdCI6IjkifV0sInVzZXJQcm9mZXNzaW9uIjoiUHJvamVjdCBNYW5hZ2VyIiwiaWF0IjoxNjI2NTAyNzgwfQ.Ebx3bqSIQ-gRSTLk6ftvTLwzQrb0zWir9ZgCKRuREAU')
