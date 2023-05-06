import '@/styles/globals.css'
import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from 'web3uikit';

export default function App({ Component, pageProps }) {
  return (
    //initializeOnMount = Optionality to Hook into a server to add more features to our website - dont need additional functionality
    <MoralisProvider initializeOnMount={false} > {/* KNOWS THE CHAIN ID WERE ON! */}
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  )
}
