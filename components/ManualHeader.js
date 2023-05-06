import { useMoralis } from 'react-moralis';

import React, { useEffect } from 'react'

export default function ManualHeader() {

  // Hooks can work with states (rerendering when changed)
  const { enableWeb3, isWeb3Enabled, account, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis(); //enableWeb3 = function
  // dont use isWeb3Enabled

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
        if (window.localStorage.getItem("connected")) {
           enableWeb3();
        }
    }
  }, [isWeb3Enabled]) //refresh this will be false everytime

  // no dependency array: run anytime something re-renders
  // CAREFUL with this!! Because then you can get circular renders
  // runs twice because of strict mode
  // blank dependency array, run once on load
  // dependencies in the array, run anytime something in there changes

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
        console.log(`Account changed to ${account}`);
        if (account == null) { //They disconnected!
            window.localStorage.removeItem("connected");
            deactivateWeb3(); //Sets isWeb3Enabled = false
            console.log("Null account found");
        }
    });
  }, [])

  return (
    <div>
      {account ? (
        // <div>Connected to {account}</div>
        <div>Connected to {account.slice(0,6)}...{account.slice(account.length - 4)}</div> //38
      ) : (
        <button disabled={isWeb3EnableLoading} 
          onClick={async () => {
            await enableWeb3();
            if (typeof window !== "undefined") { // if window exists!
                window.localStorage.setItem("connected", "injected");
            }
        }}>Connect</button>
      )}
    </div>
  )
}

// I'm going to show you the hard way first
// Then the easy way
