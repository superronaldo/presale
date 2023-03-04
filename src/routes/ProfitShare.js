import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import Reveal from 'react-awesome-reveal';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import IconButton from '@mui/material/IconButton';
import ReactLoading from "react-loading";
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'react-toastify';
import Clock from '../components/ProfitShare/Clock';
import SelectCoin from '../components/ProfitShare/SelectCoin';
import * as selectors from '../store/selectors';
import { fadeIn, fadeInUp, getUTCNow, getUTCDate, numberWithCommas, LoadingSkeleton, isEmpty } from '../components/utils';
import {
  getStartClaimTime,
  getEndClaimTime,
  getStakedAmount,
  stake,
  unstake,
  getRewardAmount,
  claimUSDT
} from '../core/web3';
import { config, def_config } from '../core/config';
import Swal from 'sweetalert2';

const GlobalStyles = createGlobalStyle`
  .ico-container {
    display: flex;
    align-items: center;
    justify-content: start;
    flex-direction: column;
    background-size: 100% !important;
    background-position-x: center !important;
    .ico-header {
      max-width: 900px;
      padding: 20px;
      .ico-title {
        font-size: 36px;
        font-weight: 700;
        color: #F8C42F;
      }
      .ico-desc {
        font-size: 20px;
      }
    }
    @media only screen and (max-width: 1400px) {
      flex-direction: column;
    }
    @media only screen and (max-width: 768px) {
      padding: 10px;
      .ico-header {
        padding: 20px;
        .ico-title {
          font-size: 28px;
        }
        .ico-desc {
          font-size: 18px;
        }
      }
    }
  }

  .input-token-panel {
    display: flex;
    background-color: transparent;
    flex-direction: column;
    text-align: left;
    gap: 10px;
    width: 45%;
    .input-box {
      border: solid 1px white;
      border-radius: 8px;
      @media only screen and (max-width: 576px) {
        span {
          font-size: 15px !important;
        }
      }
    }
    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  }

  .input-token {
    width: 50%;
    background: transparent;
    outline: none;
    padding: 10px;
    font-size: 20px;
    font-weight: bold;
    color: white;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    span {
      font-size: 18px;
      font-weight: normal;
    }
  }

  .email_input {
    max-width: 300px;
  }

  .presale-content {
    max-width: 900px;
    padding: 0;
    background: rgba(90, 70, 255, 0.15);
    border-radius: 20px;
    @media only screen and (max-width: 768px) {
      max-width: 100%;
    }
  }

  .presale-inner {
    border-radius: 12px;
    padding: 10px 60px 40px;
    position: relative;
    background: transparent;
    min-height: 200px;
    h3 {
      line-height: 2;
      margin-bottom: 0;
    }
    @media only screen and (max-width: 1024px) {
      padding: 60px 40px 40px;
    }
    @media only screen and (max-width: 768px) {
      padding: 0px 10px 40px;
    }
  }

  .presale-bg {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 76px;
  }

  .end-content {
    background: #2d81e2;
    padding: 16px;
    border-radius: 40px;
    width: 80%;
    margin: auto;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .buy_content {
    padding: 22px;
    border: solid 1.5px #5a5196;
    border-radius: 20px;
  }

  .progress-bg {
    @media only screen and (max-width: 576px) {
      width: 60%;
    }
  }

  .inverstors {
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
  }

  .amount_bar_text {
    display: flex;
    justify-content: space-between;
  }

  .progress {
    height: 1.5rem;
    background-color: #a9a9a9;
  }

  .progress-bar {
    background-color: #7621ff;
  }

  .MuiLoadingButton-root {
    transition: all 0.5s ease;
  }

  .MuiLoadingButton-loading {
    padding-right: 40px;
    background: linear-gradient(90deg, #aa2d78 -3.88%, #a657ae 100%);
    color: rgb(255 255 255 / 50%) !important;
    transition: all 0.5s ease;
  }
  .swal2-popup {
    border-radius: 20px;
    background: #2f2179;
    color: white;
  }
  .swal2-styled.swal2-confirm {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .backdrop-loading {
  }
  
  .btn-change {
    width: 40px;
    height: 40px;
    background-color: #8b86a4 !important;
    border-radius: 50%;
    margin-bottom: 8px !important;
    color: white !important;
    &:hover {
      background-color: #8b86a4 !important;
    }
  }

  .presale-input {
    align-items: end;
    @media only screen and (max-width: 768px) {
      flex-direction: column;
      gap: 10px;
    }
  }
`;

const Loading = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
`;

function CapBackGradientSVG() {
  const gradientTransform = `rotate(0)`;
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={"capBack"} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor="rgba(236, 0, 140, 0.5)" />
          <stop offset="90%" stopColor="rgba(252, 103, 103, 0)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CapGradientSVG() {
  const gradientTransform = `rotate(0)`;
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={"cap"} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor="#EC008C" />
          <stop offset="100%" stopColor="#FC6767" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AmountBackGradientSVG() {
  const gradientTransform = `rotate(0)`;
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={"amountBack"} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor="rgba(5, 117, 230, 0)" />
          <stop offset="90%" stopColor="rgba(2, 242, 149, 0.61)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AmountGradientSVG() {
  const gradientTransform = `rotate(0)`;
  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={"amount"} gradientTransform={gradientTransform}>
          <stop offset="0" stopColor="#00F260" />
          <stop offset="23.1%" stopColor="#01D97B" />
          <stop offset="73.02%" stopColor="#0581a0" />
          <stop offset="99.02" stopColor="#0575E6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const ProfitShare = (props) => {
  const max_token_amount = def_config.MAX_PRESALE_AMOUNT;
  const balance = useSelector(selectors.userBalance);
  const wallet = useSelector(selectors.userWallet);
  const web3 = useSelector(selectors.web3State);
  const isMobile = useMediaQuery({ maxWidth: '768px' });
  const [amountPercent, setAmountPercent] = useState(0);
  const [paidUSDT, setPaidUSDT] = useState(0); // USDT
  const [coinType, setCoinType] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  // const [startPresale, setStartPresale] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const [ended, setEnded] = useState(false);

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakedBalance, setUnstakedBalance] = useState(0);
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [stakedBalance, setStakedBalance] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);

  const getInitAmount = useCallback(async () => {
    console.log('[Wallet] = ', wallet);
    if (!web3) {
      return;
    }
    setLoading(false);
    let tempUsdcPrice = 0;
    let totalMaxCap = 0;
    let tempPaidUSDT = 0;
    let tempCurPresale = 0;
    let tempLeftCap = 0;
    let tempPresaleSuccess = false;

    let result = await getStartClaimTime();
    if (result.success) {
      setStartTime(Number(result.start_time));
      // setStartTime(1659441615);
    } else {
      return;
    }
    result = await getEndClaimTime();
    if (result.success) {
      setEndTime(Number(result.end_time));
      console.log("beast utcnow", getUTCNow());
      // setEndTime(1660441615);
    }
    // result = await getpTokenPriceForUSDT();
    // if (result.success) {
    //   setUsdcPrice(result.usdtPrice);
    //   tempUsdcPrice = Number(result.usdtPrice);
    // }
    result = await getStakedAmount();
    if (result.success) {
      const tmp = Number(result.staked_Amount) / 10 ** 18;
      setStakedBalance(tmp);
      console.log("beast stakedAmount", result.staked_Amount);
    }

    result = await getRewardAmount();
    if (result.success) {
      const tmp = Number(result.reward_amount) / 10 ** 18;
      console.log("beast rewardAmount", tmp);
      setRewardAmount(tmp);
    }
    
    setLoading(false);
  }, [web3, max_token_amount, wallet]);

  const handleSelectCoin = async (value) => {
    setCoinType(value);
  }

  const handleChangeStake = async (event) => {
    const value = Number(event.target.value);
    setStakeAmount(event.target.value);
  }

  const handleChangeUnstake = async (event) => {
    const value = Number(event.target.value);
    setUnstakeAmount(event.target.value);
  }

  const validateStakeAmount = () => {
    if (isEmpty(stakeAmount) || Number(stakeAmount) === 0) {
      toast.error("Please enter a valid amount for stake.");
      return;
    }
    return true;
  }

  const validateUnstakeAmount = () => {
    if (isEmpty(unstakeAmount) || Number(unstakeAmount) === 0) {
      toast.error("Please enter a valid amount for stake.");
      return;
    }
    return true;
  }

  const handleMaxStake = async () => {
    const value = Number(unstakedBalance);
    console.log("beast balance", Number(unstakedBalance));
    setStakeAmount(value);
  }

  const handleMaxUnstake = async () => {
    const value = Number(stakedBalance);
    console.log("beast balance", Number(balance.astroBalance));
    setUnstakeAmount(value);
  }

  // const handleBuy = async () => {
  //   if (!validate()) return;
  //   setPending(true);
  //   try {
  //     const coinAmount = tokenAmountA;
  //     const result = await buy_pToken(coinAmount, pAstroAmount, coinType);
  //     if (result.success) {
  //       getInitAmount();
  //       Swal.fire({
  //         icon: 'success',
  //         title: ' Success',
  //         text: 'You have bought KNB for presale successfully.'
  //       });
  //     } else {
  //       toast.error("Transaction has been failed. " + result.error);
  //     }
  //   } catch (error) {
  //     toast.error("Transaction has been failed. " + error);
  //   } finally {
  //     setPending(false);
  //   }
  // }

  const handleStake = async () => {
    if (!validateStakeAmount()) return;
    setPending(true);
    try {
      const coinAmount = stakeAmount;
      const result = await stake(coinAmount);
      if (result.success) {
        getInitAmount();
        Swal.fire({
          icon: 'success',
          title: ' Success',
          text: 'You have staked KNB successfully.'
        });
      } else {
        toast.error("Transaction has been failed. " + result.error);
      }
    } catch (error) {
      toast.error("Transaction has been failed. " + error);
    } finally {
      setPending(false);
    }
  }

  const handleUnstake = async () => {
    if (!validateUnstakeAmount()) return;
    setPending(true);
    try {
      const coinAmount = unstakeAmount;
      const result = await unstake(coinAmount);
      if (result.success) {
        getInitAmount();
        Swal.fire({
          icon: 'success',
          title: ' Success',
          text: 'You have unstaked KNB successfully.'
        });
      } else {
        toast.error("Transaction has been failed. " + result.error);
      }
    } catch (error) {
      toast.error("Transaction has been failed. " + error);
    } finally {
      setPending(false);
    }
  }

  const handleClaim = async() => {
    // if (!validate()) return;
    // console.log("beast coinAmount", paidUSDT);
    if (rewardAmount === 0) {
      toast.error("You have no reward to claim.");
      return;
    }
    setPending(true);
    try {
      const coinAmount = rewardAmount;
      const result = await claimUSDT(coinAmount);
      // const result = await claimKNB(coinAmount);
      if (result.success) {
        getInitAmount();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'You have got KNB successfully.'
        });
      } else { 
        toast.error("Transcation has been failed. " + result.error);
      }
    } catch (error) {
      toast.error("Transaction has been failed. " + error);
    } finally {
      setPending(false);
    }
  }
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  useEffect(() => {
    getInitAmount();
  }, [getInitAmount]);

  useEffect(() => {
    const checkCoinType = async () => {
      setUnstakedBalance(balance.astroBalance);
    }
    checkCoinType();
  }, [balance, coinType]);

  // useEffect(() => {
  //   const myBalance = coinType === 0 ? Number(balance.avaxBalance) : Number(balance.usdtBalance);
  //   if (isEmpty(tokenAmountA) || Number(tokenAmountA) <= 0 || Number(tokenAmountA) > Number(myBalance)) {
  //     setDisabled(true);
  //   } else {
  //     setDisabled(false);
  //   }
  // }, [coinType, tokenAmountA]);

  useEffect(() => {
    const checkEndPresale = async () => {
      const result = await getEndClaimTime();
      if (result.success) {
        setEndTime(result.end_time);
      }
      console.log("beast ended");
    }
    if (ended) {
      checkEndPresale();
    }
  }, [ended]);

  const addTokenCallback = useCallback(async () => {
    const tokenAddress = config.AstroAddress;
    const tokenSymbol = 'KNB';
    const tokenDecimals = 18;
    const tokenImage = `https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/${config.AstroAddress}/logo.png`;

    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            // image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log('Adding KNB token');
      } else {
        console.log('KNB token has been added to you wallet!')
      }
    } catch (error) {
      console.log(error);
    }
  }, [])

  return (
    <div className='page-container text-center ico-container'>
      <GlobalStyles />
      <div className='ico-header'>
        <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
          <p className='ico-title'>Welcome to the KNB Profit Sharing</p>
        </Reveal>
        <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={600} triggerOnce>
          <p className="ico-desc">
            Profit Sharing - {getUTCDate(startTime)} ~ {getUTCDate(endTime)} <br />( Get reward USDT for KNB token holding )<br />
            You have to stake your KNB tokens to get reward USDT.
          </p>
        </Reveal>
        <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={600} triggerOnce>
          <p className="ico-desc">
            You can't unstake KNB tokens during profit sharing<br />
            See our Whitepaper for further details.
          </p>
        </Reveal>  
      </div>
      {loading ? (
        <div className='backdrop-loading'>
          <Loading className='loading'>
            <ReactLoading type={'spinningBubbles'} color="#fff" />
          </Loading>
        </div>
      ) : (
        <>
          <Reveal className='onStep' keyframes={fadeIn} delay={800} duration={800} triggerOnce>
            <section className='presale-content'>
              <div className='presale-inner pt-3 pb-4'> 
                <div className="row">
                  <div className="flex justify-content-between mb-3">
                    <div className='flex flex-column flex-md-row gap-2 '>
                      <span>Start Time: </span>
                      <span>{startTime === 0 ? <LoadingSkeleton /> : getUTCDate(startTime)}</span>
                    </div>
                    <div className='flex flex-column flex-md-row gap-2'>
                      <span>End Time: </span>
                      <span>{endTime === 0 ? <LoadingSkeleton /> : getUTCDate(endTime)}</span>
                    </div>
                  </div>
                  {getUTCNow() / 1000 > endTime? (
                    <>
                      <div className='end-content'>
                        <span className='fs-20 fw-bold'>PLEASE WAIT NEXT PROFIT SHARING</span>
                      </div>
                      {/* <p className='fs-20 fw-bold mt-3 mb-1 text-gray'>Your Holdings (KNB): <span className='text-white'>{paidUSDT === '' ? <LoadingSkeleton /> : numberWithCommas(paidUSDT)}</span></p>
                      <br />
                      <p className='fs-20 mb-1 mt-3'>Presale Amount received: <br /><strong>{curPresale === '' ? <LoadingSkeleton /> : numberWithCommas(curPresale) + ' USDT'}</strong></p> */}
                    </>
                  ) : (
                    <>
                      {getUTCNow() / 1000 < startTime ? (
                        <>
                          <div className='col-md-4 align-self-center'>
                            <h3>TIME REMAINING TO START PROFIT SHARING</h3>
                          </div>
                          <div className="col-md-8 align-self-center">
                            <Clock deadline={startTime * 1000} setEnded={(value) => setEnded(value)} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className='col-md-4 align-self-center'>
                            <h3>TIME REMAINING TO CALIM PROFTI SHARING</h3>
                          </div>
                          <div className="col-md-8 align-self-center">
                            <Clock deadline={endTime * 1000} setEnded={(value) => setEnded(value)} />
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {/* <div className='flex flex-column mt-3'>
                    <button className='btn-main m-auto fs-20'>SWAP</button>
                    <p className='fs-20 mt-2'>Please swap your KNB to KNB.</p>
                  </div> */}
                </div>
              </div>
            </section>
          </Reveal>
          <Reveal className='presale-content main mt-3 onStep' keyframes={fadeIn} delay={800} duration={800} triggerOnce>
            <div className='presale-inner'>
              <div className="row justify-center">
                <div className="col-md-6 col-sm-6 mt-5">
                  <div className="amount_bar px-3">
                    <h3>Your Claimable Amount</h3>
                    <div className='progress-bg m-auto'>
                      <AmountBackGradientSVG />
                      <AmountGradientSVG />
                      <CircularProgressbar
                        value={rewardAmount}
                        text={`${numberWithCommas(rewardAmount, 2)} USDT`}
                        styles={buildStyles({
                          pathColor: `url(#amount)`,
                          textColor: '#00DB8B',
                          strokeLinecap: "butt",
                          trailColor: `url(#amount)`,
                          textSize: '10px'
                        })}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 mt-5">
                  <div className="amount_bar px-3">
                    <h3>Your Staked Amount</h3>
                    <div className='progress-bg m-auto'>
                      <CapBackGradientSVG />
                      <CapGradientSVG />
                      <CircularProgressbar
                        value={paidUSDT}
                        text={`${numberWithCommas(stakedBalance, 2)} KNB`}
                        styles={buildStyles({
                          pathColor: `url(#cap)`,
                          textColor: '#EF1485',
                          strokeLinecap: "butt",
                          trailColor: `url(#cap)`,
                          textSize: '10px'
                        })}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-md-12 mt-3'>
                  <LoadingButton
                    onClick={handleClaim}
                    endIcon={<></>}
                    loading={pending}
                    loadingPosition="end"
                    variant="contained"
                    className="btn-main btn5 m-auto fs-20"
                    disabled={(startTime<(getUTCNow()/1000) && (getUTCNow()/1000) < endTime) ? false : true}
                  >
                    Claim USDT
                  </LoadingButton>
                </div>
                <div className='col-md-12 mt-3'>
                  <div className='buy_content'>
                    <div className='row'>
                      <div className='col-md-12'>
                        <p className='fs-20'>Please enter the KNB amount you'd like to stake or unstake</p>
                        <div className='presale-input flex'>
                          <div className="input-token-panel">
                            <div className='flex justify-between'>
                              <span className='fs-20'>Unstaked Balance: {numberWithCommas(Number(unstakedBalance))}</span>
                            </div>
                            <div className="d-flex justify-content-between input-box">
                              <input type="number" className="input-token" name="input_from" placeholder='0.0' value={stakeAmount} onChange={handleChangeStake}></input>
                              <button className='btn-max swap-color' onClick={handleMaxStake}>MAX</button>
                              <SelectCoin className='select-coin' value={coinType} onChange={handleSelectCoin} />
                            </div>
                          </div>
                          <IconButton component="span" className="btn-change mx-auto">
                            {isMobile ? (
                              <i className="fa-solid fa-arrow-down-arrow-up"></i>
                            ) : (
                              <i className="fa-solid fa-arrow-right-arrow-left"></i>
                            )}
                          </IconButton>
                          <div className="input-token-panel">
                            <div className='flex justify-between'>
                              <span className='fs-20'>Staked Balance: {numberWithCommas(stakedBalance)}</span>
                            </div>
                            {/* <div className="d-flex justify-content-between input-box">
                              <p className="input-token mb-0">{numberWithCommas(pAstroAmount, 1)}&nbsp;
                                {coinType === 0 && (
                                  <span>{toAvaxPrice === 0 ? '' : ' ($' + numberWithCommas(Number(toAvaxPrice), 2) + ')'}</span>
                                )}
                              </p>
                              <div className='flex align-items-center gap-2' style={{ padding: '10px' }}>
                                <img
                                  loading="lazy"
                                  width="35"
                                  height="35"
                                  src={`/img/icons/astro.png`}
                                  alt={`Coin of KNB`}
                                />
                                <span className='fs-20'>{'KNB'}</span>
                              </div>
                            </div> */}
                            <div className="d-flex justify-content-between input-box">
                              <input type="number" className="input-token" name="input_from" placeholder='0.0' value={unstakeAmount} onChange={handleChangeUnstake}></input>
                              <button className='btn-max swap-color' onClick={handleMaxUnstake}>MAX</button>
                              <SelectCoin className='select-coin' value={coinType} onChange={handleSelectCoin} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-12 mt-3 flex justify-between'>
                        {/* <p className='fs-20'>KNB remaining for your wallet limit: {maxCap === '' || usdtPrice === '' ? <LoadingSkeleton /> : numberWithCommas(maxCap / Number(usdtPrice))}
                          {coinType === 0 ? ` (${numberWithCommas(maxAvaxCap)} AVAX)` : ` ($${numberWithCommas(maxCap)} USDT)`}</p> */}
                        <p className='fs-20'> </p>
                        <LoadingButton
                          onClick={handleStake}
                          disabled={(startTime<(getUTCNow()/1000) && (getUTCNow()/1000) < endTime) ? true : false}
                          endIcon={<></>}
                          loading={pending}
                          loadingPosition="end"
                          variant="contained"
                          className="btn-main btn2 m-auto fs-20"
                        >
                          stake
                        </LoadingButton>
                        <LoadingButton
                          onClick={handleUnstake}
                          disabled={(startTime<(getUTCNow()/1000) && (getUTCNow()/1000) < endTime) ? true : false}
                          endIcon={<></>}
                          loading={pending}
                          loadingPosition="end"
                          variant="contained"
                          className="btn-main btn2 m-auto fs-20"
                        >
                          unstake
                        </LoadingButton>
                      </div>
                      <div className='flex justify-center align-items-center gap-3 mt-3 cursor-pointer' onClick={addTokenCallback}>
                        <img src="/img/icons/metamask.png" alt="" width="30"></img>
                        <span style={{ whiteSpace: 'nowrap' }}> Add KNB to MetaMask</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </>
      )}
    </div >
  );
};

export default ProfitShare;    