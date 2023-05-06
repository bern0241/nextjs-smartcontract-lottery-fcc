// Have a function to enter the lottery

import React, { useState, useEffect } from 'react'
import { useWeb3Contract } from 'react-moralis';
import { abi, contractAddresses } from '@/constants';
import { useMoralis } from 'react-moralis';
import { ethers } from "ethers";
import { useNotification, Bell } from 'web3uikit';

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis(); // knows chainId from MoralisProvider! Original = HEX number
    const chainId = parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const [entranceFee, setEntranceFee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");

    const dispatch = useNotification();

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        const numPlayersFromCall = (await getNumberOfPlayers()).toString();
        const recentWinner = await getRecentWinner();
        setEntranceFee(entranceFeeFromCall);
        setNumPlayers(numPlayersFromCall);
        setRecentWinner(recentWinner);
    }

    useEffect(() => {
        if (isWeb3Enabled) { //RUNS FALSE FIRST
            updateUI();
        }
    }, [isWeb3Enabled]) // Put here, so when it DOES turn true, it will run true!



    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the networkId
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the networkId
        functionName: "getEntranceFee",
        params: {}
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the networkId
        functionName: "getNumberOfPlayers",
        params: {}
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the networkId
        functionName: "getRecentWinner",
        params: {}
    })



    const handleSuccess = async function (tx) { //property passed automatically (tx) FROM OnSuccess (await enterRaffle())
        await tx.wait(1); // This ACTUALLY waits for the transaction to complete!
        handleNewNotification(tx);
        updateUI();
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            // icon: "bell"
            icon: <Bell fontSize={20} />
        })
    }

    const recentWinnerFunc = async () => {
        const recentWinner = (await getRecentWinner()).toString();
        console.log(recentWinner);
    }

  return (
    <div className='p-5'>
      Hi from lottery entrance!
      {raffleAddress ? (
            <div>
                <button
                    disabled={isLoading || isFetching}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto ${(isLoading || isFetching) && `opacity-100`}`} 
                    onClick={async () => {
                    await enterRaffle({
                        onSuccess: handleSuccess,
                        onError: (error) => console.log(error), //ALWAYS ADD! If the runContractFunction breaks, you won't know!
                    });
                }}>
                    {isLoading || isFetching ? (
                        <div className='animate-spin spinner-border h-8 w-8 border-b-2 rounded-full'></div>
                    ) : (
                        <div>Enter Raffle</div>
                    )}
                </button>
                <div><b>Entrance Fee:</b> {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                <div><b>Number of Players:</b> {numPlayers} Players</div>
                <div><b>Recent Winner:</b> {recentWinner}</div>
            </div>
      ) : (
            <div>No Raffle Address Detected</div>
      )}
    </div>
  )
}
