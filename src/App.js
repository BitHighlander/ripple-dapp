import React from 'react';
import { useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import { KeepKeySdk } from '@keepkey/keepkey-sdk'
const pioneerApi = require("@pioneer-platform/pioneer-client")

let spec = 'http://localhost:1646/spec/swagger.json'
let configKeepKey = {
  pairingInfo:{
    name: process.env['REACT_SERVICE_NAME'] || 'SAMPLE NAME',
    imageUrl: process.env['REACT_SERVICE_IMAGE_URL'] || 'https://assets.coincap.io/assets/icons/bitcoin@2x.png',
    basePath:spec
  }
}
const configPioneer = {
  queryKey:'sdk:test-tutorial-medium',
  username:"sample-dapp",
  spec:"https://pioneers.dev/spec/swagger.json"
  // spec:"http://localhost:9001/spec/swagger.json"
}


function App() {
  let [version, setVersion] = React.useState("");

  //onStart
  let onStart = async function(){
    try{
      let pioneer = new pioneerApi(configPioneer.spec,configPioneer)
      pioneer = await pioneer.init()
      let globals = await  pioneer.Health()
      console.log("globals: ",globals.data)
      setVersion(globals.data.version)
    }catch(e){
      console.error(e)
    }
  }

  // onStart()
  useEffect(() => {
    onStart()
  }, []) //once on startup

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Logo h="40vmin" pointerEvents="none" />
            <Text>
              Edit <Code fontSize="xl">src/App.js</Code> and save to reload.
            </Text>
            <Link
              color="teal.500"
              href="https://chakra-ui.com"
              fontSize="2xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn Chakra
            </Link>
            <Link
              color="green.500"
              href="https://pioneers.dev/docs"
              fontSize="2xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Pioneers.dev's API version({version})
            </Link>
            <Link
              color="green.500"
              href="http://keepkey.com"
              fontSize="2xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get KeepKey Desktop
            </Link>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
