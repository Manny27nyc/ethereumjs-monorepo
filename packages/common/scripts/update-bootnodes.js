// © Licensed Authorship: Manuel J. Nieves (See LICENSE for terms)
const fs = require('fs')

// https://github.com/ethereum/go-ethereum/blob/master/params/bootnodes.go
const bootnodes = {
  // MainnetBootnodes are the enode URLs of the P2P bootstrap nodes running on
  // the main Ethereum network.
  MainnetBootnodes: {
    'bootnode-aws-ap-southeast-1-001': "enode://d860a01f9722d78051619d1e2351aba3f43f943f6f00718d1b9baa4101932a1f5011f16bb2b1bb35db20d6fe28fa0bf09636d26a87d31de9ec6203eeedb1f666@18.138.108.67:30303",
    'bootnode-aws-us-east-1-001': "enode://22a8232c3abc76a16ae9d6c3b164f98775fe226f0917b0ca871128a74a8e9630b458460865bab457221f1d448dd9791d24c4e5d88786180ac185df813a68d4de@3.209.45.79:30303",
    'bootnode-aws-eu-west-1-001': "enode://ca6de62fce278f96aea6ec5a2daadb877e51651247cb96ee310a318def462913b653963c155a0ef6c7d50048bba6e6cea881130857413d9f50a621546b590758@34.255.23.113:30303",
    'bootnode-aws-eu-central-1-001': "enode://279944d8dcd428dffaa7436f25ca0ca43ae19e7bcf94a8fb7d1641651f92d121e972ac2e8f381414b80cc8e5555811c2ec6e1a99bb009b3f53c4c69923e11bd8@35.158.244.151:30303",
    'bootnode-azure-australiaeast-001': "enode://8499da03c47d637b20eee24eec3c356c9a2e6148d6fe25ca195c7949ab8ec2c03e3556126b0d7ed644675e78c4318b08691b7b57de10e5f0d40d05b09238fa0a@52.187.207.27:30303",
    'bootnode-azure-brazilsouth-001': "enode://103858bdb88756c71f15e9b5e09b56dc1be52f0a5021d46301dbbfb7e130029cc9d0d6f73f693bc29b665770fff7da4d34f3c6379fe12721b5d7a0bcb5ca1fc1@191.234.162.198:30303",
    'bootnode-azure-koreasouth-001': "enode://715171f50508aba88aecd1250af392a45a330af91d7b90701c436b618c86aaa1589c9184561907bebbb56439b8f8787bc01f49a7c77276c58c1b09822d75e8e8@52.231.165.108:30303",
    'bootnode-azure-westus-001': "enode://5d6d7cd20d6da4bb83a1d28cadb5d409b64edf314c0335df658c1a54e32c7c4a7ab7823d57c39b6a757556e68ff1df17c748b698544a55cb488b52479a92b60f@104.42.217.25:30303",
  }
  // RopstenBootnodes are the enode URLs of the P2P bootstrap nodes running on the
  // Ropsten test network.
  , RopstenBootnodes: {
    'US-Azure geth': "enode://30b7ab30a01c124a6cceca36863ece12c4f5fa68e3ba9b0b51407ccc002eeed3b3102d20a88f1c1d3c3154e2449317b8ef95090e77b312d5cc39354f86d5d606@52.176.7.10:30303",    // 
    'US-Azure parity': "enode://865a63255b3bb68023b6bffd5095118fcc13e79dcf014fe4e47e065c350c7cc72af2e53eff895f11ba1bbb6a2b33271c1116ee870f266618eadfc2e78aa7349c@52.176.100.77:30303",  // 
    'Parity': "enode://6332792c4a00e3e4ee0926ed89e0d27ef985424d97b6a45bf0f23e51f0dcb5e66b875777506458aea7af6f9e4ffb69f43f3778ee73c81ed9d34c51c4b16b0b0f@52.232.243.152:30303", // 
    '@gpip': "enode://94c15d1b9e2fe7ce56e458b9a3b672ef11894ddedd0c6f247e0f1d3487f52b66208fb4aeb8179fce6e3a749ea93ed147c37976d67af557508d199d9594c35f09@192.81.208.223:30303", // 
  }

  // RinkebyBootnodes are the enode URLs of the P2P bootstrap nodes running on the
  // Rinkeby test network.
  , RinkebyBootnodes: {
    'IE': "enode://a24ac7c5484ef4ed0c5eb2d36620ba4e4aa13b8c84684e1b4aab0cebea2ae45cb4d375b77eab56516d34bfbd3c1a833fc51296ff084b770b94fb9028c4d25ccf@52.169.42.101:30303", // 
    'INFURA': "enode://343149e4feefa15d882d9fe4ac7d88f885bd05ebb735e547f12e12080a9fa07c8014ca6fd7f373123488102fe5e34111f8509cf0b7de3f5b44339c9f25e87cb8@52.3.158.184:30303",  // 
    'AKASHA': "enode://b6b28890b006743680c52e64e0d16db57f28124885595fa03a562be1d2bf0f3a1da297d56b13da25fb992888fd556d4c1a27b1f39d531bde7de1921c90061cc6@159.89.28.211:30303", // 
  }

  // GoerliBootnodes are the enode URLs of the P2P bootstrap nodes running on the
  // Görli test network.
  , GoerliBootnodes: {
    // Upstream bootnodes
    'Upstream bootnode 1': "enode://011f758e6552d105183b1761c5e2dea0111bc20fd5f6422bc7f91e0fabbec9a6595caf6239b37feb773dddd3f87240d99d859431891e4a642cf2a0a9e6cbb98a@51.141.78.53:30303",
    'Upstream bootnode 2': "enode://176b9417f511d05b6b2cf3e34b756cf0a7096b3094572a8f6ef4cdcb9d1f9d00683bf0f83347eebdf3b81c3521c2332086d9592802230bf528eaf606a1d9677b@13.93.54.137:30303",
    'Upstream bootnode 3': "enode://46add44b9f13965f7b9875ac6b85f016f341012d84f975377573800a863526f4da19ae2c620ec73d11591fa9510e992ecc03ad0751f53cc02f7c7ed6d55c7291@94.237.54.114:30313",
    'Upstream bootnode 4': "enode://c1f8b7c2ac4453271fa07d8e9ecf9a2e8285aa0bd0c07df0131f47153306b0736fd3db8924e7a9bf0bed6b1d8d4f87362a71b033dc7c64547728d953e43e59b2@52.64.155.147:30303",
    'Upstream bootnode 5': "enode://f4a9c6ee28586009fb5a96c8af13a58ed6d8315a9eee4772212c1d4d9cebe5a8b8a78ea4434f318726317d04a3f531a1ef0420cf9752605a562cfe858c46e263@213.186.16.82:30303",

    // Ethereum Foundation bootnode
    'Ethereum Foundation bootnode': "enode://a61215641fb8714a373c80edbfa0ea8878243193f57c96eeb44d0bc019ef295abd4e044fd619bfc4c59731a73fb79afe84e9ab6da0c743ceb479cbb6d263fa91@3.11.147.67:30303",
  }

  // https://github.com/openethereum/openethereum/blob/master/ethcore/res/ethereum/kovan.json#L6783
  ,KovanBootnodes: {
    '1': "enode://16898006ba2cd4fa8bf9a3dfe32684c178fa861df144bfc21fe800dc4838a03e342056951fa9fd533dcb0be1219e306106442ff2cf1f7e9f8faa5f2fc1a3aa45@116.203.116.241:30303",
		'2': "enode://2909846f78c37510cc0e306f185323b83bb2209e5ff4fdd279d93c60e3f365e3c6e62ad1d2133ff11f9fd6d23ad9c3dad73bb974d53a22f7d1ac5b7dea79d0b0@3.217.96.11:30303",
		'3': "enode://740e1c8ea64e71762c71a463a04e2046070a0c9394fcab5891d41301dc473c0cff00ebab5a9bc87fbcb610ab98ac18225ff897bc8b7b38def5975d5ceb0a7d7c@108.61.170.124:30303",
		'4': "enode://2909846f78c37510cc0e306f185323b83bb2209e5ff4fdd279d93c60e3f365e3c6e62ad1d2133ff11f9fd6d23ad9c3dad73bb974d53a22f7d1ac5b7dea79d0b0@157.230.31.163:30303"
  }
}


/*
parse string and generate:
{
  "ip": "52.74.57.123",
  "port": 30303,
  "id": "1118980bf48b0a3640bdba04e0fe78b1add18e1cd99bf22d53daac1fd9972ad650df52176e7c7d89d1114cfef2bc23a2959aa54998a46afcf7d91809f0855082",
  "location": "SG",
  "comment": "Go Bootnode"
}
*/
const generateJson = (bootnodes) => {
  const nodes = []
  for (const b in bootnodes) {
    let enode = bootnodes[b]
    enode = enode.replace('enode://', '')
    const [id, rest] = enode.split('@')
    const [ip, port] = rest.split(':')
    const node = {
      ip,
      port: parseInt(port),
      id,
      location: (b.includes('-aws-') || b.includes('-azure-')) ? b.replace('bootnode-aws-', '').replace('bootnode-azure-', '') : '',
      comment: b
    }
    console.log('node', node)
    nodes.push(node)
  }
  return nodes
}

const nameToJsonFile = {
  MainnetBootnodes: 'mainnet',
  RopstenBootnodes: 'ropsten',
  RinkebyBootnodes: 'rinkeby',
  GoerliBootnodes: 'goerli',
  KovanBootnodes: 'kovan',
}

for (let configName in bootnodes) {
  console.log('process ', configName)
  const fileName = nameToJsonFile[configName]
  const filePath = `./src/chains/${fileName}.json`
  const _newConfig = JSON.parse(fs.readFileSync(filePath))
  _newConfig.bootstrapNodes = generateJson(bootnodes[configName])
  fs.writeFileSync(filePath, `${JSON.stringify(_newConfig, null, 2)}\n`)
}


