import { ConnectButton } from "web3uikit";

export default function Header() {
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-semibold text-3xl">Decentralized Lottery</h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} /> {/* We are NOT trying to connect to a server */}
            </div>
        </div>
    )
}