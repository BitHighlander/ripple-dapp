import {
  React,
  useEffect,
  useState,
} from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Grid,
  theme,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import { KeepKeySdk } from '@keepkey/keepkey-sdk'
const pioneerApi = require("@pioneer-platform/pioneer-client")
const xrpl = require("xrpl")

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
  //State vars
  const [address, setAddress] = useState('')
  const [version, setVersion] = useState('')
  const [xpub, setXpub] = useState('')
  const [balance, setBalance] = useState('0.000')
  const [sequence, setSequence] = useState('0')
  const [ledgerIndexCurrent, setLedgerIndexCurrent] = useState('')
  const [amount, setAmount] = useState('0.00000000')
  const [toAddress, setToAddress] = useState('')
  const [txid, setTxid] = useState(null)
  const [signedTx, setSignedTx] = useState(null)
  const [keepkeyConnected, setKeepKeyConnected] = useState(false)
  const [keepkeyError, setKeepKeyError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  //onStart
  let onStart = async function(){
    try{
      let pioneer = new pioneerApi(configPioneer.spec,configPioneer)
      pioneer = await pioneer.init()
      let globals = await  pioneer.Health()
      console.log("globals: ",globals.data)
      // setVersion(globals.data.version)

      //init
      let sdk
      try{
        sdk = await KeepKeySdk.create(configKeepKey)
        localStorage.setItem("apiKey",configKeepKey.apiKey);
        console.log("config: ",configKeepKey.apiKey)
      }catch(e){
        setKeepKeyError('Bridge is offline!')
      }

      //Unsigned TX
      let addressInfo = {
        addressNList: [ 2147483692, 2147483792, 2147483648, 0, 0 ],
        coin: 'Bitcoin',
        scriptType: 'p2wpkh',
        showDisplay: false
      }

      //rippleGetAddress
      let address = await sdk.address.xrpGetAddress({address_n: addressInfo.addressNList})
      address = address.address
      console.log("address: ", address)
      setAddress(address)

      let client = new xrpl.Client("wss://xrplcluster.com/")
      await client.connect()
      console.log("checkpoint2")

      const ledgerIndexCurrent = await client.getLedgerIndex()
      console.log("ledgerIndexCurrent: ",ledgerIndexCurrent)
      setLedgerIndexCurrent(ledgerIndexCurrent)
      console.log("checkpoint3")
      const response = await client.request({
        "command": "account_info",
        "account": address,
        "ledger_index": "validated"
      })
      console.log("checkpoint4")
      console.log(response.result.account_data)
      let balance = response.result.account_data.Balance
      let sequence = response.result.account_data.Sequence


      console.log("sequence: ", sequence)
      //set balance
      setBalance(balance / 1000000)
      setSequence(sequence)
      setIsLoading(false)
    }catch(e){
      console.error(e)
    }
  }

  // onStart()
  useEffect(() => {
    onStart()
  }, []) //once on startup

  // let onSend = async function(){
  //   try{
  //
  //     let pioneer = new pioneerApi(configPioneer.spec,configPioneer)
  //     pioneer = await pioneer.init()
  //
  //     //init
  //     let sdk = await KeepKeySdk.create(configKeepKey)
  //     localStorage.setItem("apiKey",configKeepKey.apiKey);
  //     console.log("config: ",configKeepKey.apiKey)
  //
  //
  //   }catch(e){
  //     console.error("Error on send!",e)
  //   }
  // }
  //
  // let onBroadcast = async function(){
  //   let tag = " | onBroadcast | "
  //   try{
  //     console.log("onBroadcast: ",onBroadcast)
  //     let pioneer = new pioneerApi(configPioneer.spec,configPioneer)
  //     pioneer = await pioneer.init()
  //
  //     //broadcast TX
  //     let broadcastBodyTransfer = {
  //       network:"DASH",
  //       serialized:signedTx,
  //       txid:"unknown",
  //       invocationId:"unknown"
  //     }
  //     let resultBroadcastTransfer = await pioneer.Broadcast(null,broadcastBodyTransfer)
  //     resultBroadcastTransfer = resultBroadcastTransfer.data
  //     console.log("resultBroadcastTransfer: ",resultBroadcastTransfer)
  //     // resultBroadcastTransfer = resultBroadcastTransfer.data
  //     if(resultBroadcastTransfer.error){
  //       setError(resultBroadcastTransfer.error)
  //     }
  //     if(resultBroadcastTransfer.txid){
  //       setTxid(resultBroadcastTransfer.txid)
  //     }
  //   }catch(e){
  //     console.error(tag,e)
  //   }
  // }

  const handleInputChangeAmount = (e) => {
    const inputValue = e.target.value;
    setAmount(inputValue);
  };

  const handleInputChangeAddress = (e) => {
    const inputValue = e.target.value;
    setToAddress(inputValue);
  };

  return (
    <ChakraProvider theme={theme}>
      {/*<Modal isOpen={isOpen} onClose={onClose}>*/}
      {/*  <ModalOverlay />*/}
      {/*  <ModalContent>*/}
      {/*    <ModalHeader>Sending Dash</ModalHeader>*/}
      {/*    <ModalCloseButton />*/}
      {/*    <ModalBody>*/}
      {/*      <div>*/}
      {/*        amount: <input type="text"*/}
      {/*                       name="amount"*/}
      {/*                       value={amount}*/}
      {/*                       onChange={handleInputChangeAmount}/>*/}
      {/*      </div>*/}
      {/*      <br/>*/}
      {/*      <div>*/}
      {/*        address: <input type="text"*/}
      {/*                        name="address"*/}
      {/*                        value={toAddress}*/}
      {/*                        placeholder="XwNbd46qdmbVWLdXievBhBMW7JYy8WiE7n"*/}
      {/*                        onChange={handleInputChangeAddress}*/}
      {/*      />*/}
      {/*      </div>*/}
      {/*      <br/>*/}
      {/*      {error ? <div>error: {error}</div> : <div></div>}*/}
      {/*      {txid ? <div>txid: <a href={'https://blockchair.com/dash/transaction/?'+txid}>{txid}</a></div> : <div></div>}*/}
      {/*      {txid ? <div></div> : <div>*/}
      {/*        {signedTx ? <div>signedTx: {signedTx}</div> : <div></div>}*/}
      {/*      </div>}*/}

      {/*    </ModalBody>*/}

      {/*    <ModalFooter>*/}
      {/*      {!signedTx ? <div>*/}
      {/*        <Button colorScheme='green' mr={3} onClick={onSend}>*/}
      {/*          Send*/}
      {/*        </Button>*/}
      {/*      </div> : <div></div>}*/}
      {/*      {!txid ? <div>*/}
      {/*        {signedTx ? <div>*/}
      {/*          <Button colorScheme='green' mr={3} onClick={onBroadcast}>*/}
      {/*            broadcast*/}
      {/*          </Button>*/}
      {/*        </div> : <div></div>}*/}
      {/*      </div> : <div></div>}*/}
      {/*      <Button colorScheme='blue' mr={3} onClick={onClose}>*/}
      {/*        exit*/}
      {/*      </Button>*/}
      {/*    </ModalFooter>*/}
      {/*  </ModalContent>*/}
      {/*</Modal>*/}
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            {keepkeyError ? <div>KeepKey not online! <a href='https://www.keepkey.com/'>Download KeepKey Desktop.</a></div> : <div></div>}
            {keepkeyConnected ? <div>loading KeepKey....</div> : <div></div>}
            {isLoading ? <div>loading...</div> : <div>
              <Logo h="40vmin" pointerEvents="none" />
              <Text>
                address: {address}
              </Text>
              <Text>
                balance: {balance}
              </Text>
              {/*<Button onClick={onOpen}>Send Dash</Button>*/}
            </div>}
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
