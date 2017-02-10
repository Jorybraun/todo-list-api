## TodoList Api 

This uses express and mongoose, so you should have mongodb running. 
You will also have to create a config.js in the root of the project, 
and then insert the following. 

` module.exports = { `
`  secret: 'SECRET_GOES_HERE' `
` } `  


### Getting installed locally
` $ npm install `

### Start Server
`$ node index.js`

### Running Tests
`$ npm run tests `


### TODO: FIX THIS.
#### - the tests are currently failing because the passport is authenicating routes
#### fix this by adding a token to the test before each call

