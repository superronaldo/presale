var presale_abi = require("./ABI/PresaleFactory.json");
// var pAstro_abi = require("./ABI/pAstro.json");
var Astro_abi = require('./ABI/Astro.json')
// var Avax_abi = require("./ABI/Avax.json");
var usdc_abi = require("./ABI/USDC.json");
var profitshare_abi = require("./ABI/ProfitShare.json");
// var avaxAstro_abi = require("./ABI/avaxAstro.json");
// var joerouter_abi = require("./ABI/joerouter_abi.json");
// var dashboard_abi = require("./ABI/dashboard.json");

export const config = {
    chainId: 56, //Fuji testnet : 43113, mainnet : 43114.  bsctestnet : 97, Rikeby: 4
    // mainNetUrl: 'https://api.avax.network/ext/bc/C/rpc',
    mainNetUrl: 'https://bsc-dataseed1.ninicoin.io',
    // mainNetUrl: 'https://rinkeby.infura.io/v3/',
    // pAstroAddress: '0xb181b06A1E4BFE577E5aA913530C23d35158a6eD',
    // pAstroAbi: pAstro_abi,
    PresaleFactoryAddress : "0xABF8d15b7eFfee1a8e6f51397082d62b08eF0912", // Avalanche
    PresaleFactoryAbi : presale_abi,
    ProfitShareAddress: "0xc139D6223040a3435a1112A96f5666ba57F02DDa",
    ProfitShareAbi: profitshare_abi,
    // AvaxAddress: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', // Avalanche
    // AvaxAbi: Avax_abi,
    AstroAddress: '0x3Fa2b39471Af5d82bd7107a995FEE4C580ad723C', // Avalanche - 0x9d77cceEBDA1De9A6E8517B4b057c1c2F89C8444
    AstroAbi: Astro_abi,
    USDCAddress: '0x55d398326f99059fF775485246999027B3197955', // Avalanche
    USDCAbi: usdc_abi,    
    // JoeRouterAddress: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
    // JoeRouterAbi : joerouter_abi,
    // JoeFactoryAddress: '0x9ad6c38be94206ca50bb0d90783181662f0cfa10',    
    // avaxAstroPair: "0x7de9d08b1281455aC2D2C6f30ad3B1C9e954b608", // <- AVAX:ASTRO Avalanche - Test USDC:ASTRO 0xfd9eA09A1F205ba6e147096181F7Fb71528c6451
    // avaxAstroAbi: avaxAstro_abi,
    // dashboardAddress: '0x8683a4c24f09d550ab60C725260Ba5a4319aD853',
    // dashboardAbi: dashboard_abi,
    INFURA_ID: 'e6943dcb5b0f495eb96a1c34e0d1493e'
}

export const def_config = {
    REBASE_RATE: 0.0003944,
    DPR: 0.0191,
    APY: 1000.0337,
    SWAP_FEE: 0.053,
    AUTO_SLIPPAGE: 1,
    DAILY_CLAIM: 1,
    BUY_FEE: 0.15,
    SELL_FEE: 0.3,
    DEF_PRICE: 0.01,
    ASTRO_DIGIT: 2,
    MAX_PRESALE_AMOUNT: 3000000
}