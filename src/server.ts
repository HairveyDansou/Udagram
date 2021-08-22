import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // FilterImage endpoint
  app.get('/filteredimage', async (req, res) => {
    // get the image_url parameter from the query
    let { image_url } = req.query;
    // parameter validation
    if(!image_url){
      res.status(400).send("image_url parameter is required");
    }

    try{
      // image filtering processing
      const filteredImage = await filterImageFromURL(image_url);
      // sending the resulting file in the response
      res.status(200).sendFile(filteredImage, () => {
        // deleting any files on the server
        deleteLocalFiles([filteredImage]);
      });
    }
    catch(error){
      // sending error to client in case image filtering processing failed
      res.status(422).send("Error processing media url");
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();