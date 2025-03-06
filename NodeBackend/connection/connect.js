import {MongoClient, ServerApiVersion } from 'mongodb'

async function ConnectToMongoDb(uri){
    const client = new MongoClient(uri,{
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          }
    })

    try{
        await client.connect()
        await client.db("admin").command({ping:1})
        console.log("Connected to PrepData Database")
        return client;

    }
    catch(error){
        console.error(error)
        throw error
    }
    finally{
        await client.close()
    }

}
export default ConnectToMongoDb