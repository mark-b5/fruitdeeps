import Head from "next/head";
import Image from "next/image";

import AttackerSwitcher from "../components/AttackerSwitcher.js";
import Defender from "../components/Defender.js";
import CalcOutputWrapper from "../components/CalcOutputWrapper.js";

import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "../reducers/reducer.js";

export default function Index() {
    const store = createStore(
        reducer
    );

    return (
        <>
            <Head>
                <title>fruitdeeps</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
                <meta name="description" content="OSRS DPS calculator and combinatorics solver" />
                <meta name="keywords" content="osrs,dps,dps calculator,calculator,runescape" />
                <meta name="msapplication-TileColor" content="#33333" />
                <meta name="msapplication-TileImage" content="/assets/strawberry thing.svg" />
                <meta property="og:image" content="/assets/strawberry thing.svg" />
                <meta property="og:title" content="Fruitdeeps" />
                <meta property="og:description" content="Fruitdeeps is a precise and user friendly DPS calculator" />
                <meta property="og:type" content="website" />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:image" content="/assets/strawberry thing.svg" />
                <meta name="robots" content="index, follow" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="language" content="English" />
                <meta name="revisit-after" content="30 days" />
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <link rel="icon" type="image/svg+xml" href="/assets/strawberry thing.svg" />
                <link rel="apple-touch-icon" href="/assets/strawberry thing.svg" />
                <link rel="shortcut icon" href="/assets/strawberry thing.svg" />
            </Head>
            <header id="page-header">
                <div className="width-control header-flex">
                    <h1 className='page-title'>
                        <Image
                            src="/assets/strawberry thing.svg"
                            width={32} // Adjust width as needed
                            height={32} // Adjust height as needed
                            alt="fruitdeeps"
                        />
                        {" "}fruitdeeps{" "}
                    </h1>
                    <a href='https://discord.gg/YexDtAkXMQ' target="_blank" rel="noopener noreferrer" className='page-subtitle'>
                        <Image
                            src="/assets/svg/discord.svg"
                            width={32} // Adjust width as needed
                            height={32} // Adjust height as needed
                            alt="Discord"
                        />
                    </a>
                </div>
            </header>
            <div className="width-control dps">
                <div className="flex-container-vertical body-color-container">
                    <div className="flex-container top-level">
                        <div className="flex-child main-section flex-container-vertical">
                            <Provider store={store}><AttackerSwitcher /></Provider>
                        </div>
                        <div className="flex-child main-section flex-container-vertical">
                            <h2 className="flex-valign">
                                <Image
                                    className="large-icon"
                                    src="/assets/svg/defence_icon.svg"
                                    width={32} // Adjust width as needed
                                    height={32} // Adjust height as needed
                                    alt="Defence"
                                />
                                <span className="space-left">Defender</span>
                            </h2>
                            <Provider store={store}><Defender /></Provider>
                        </div>
                    </div>
                    <div className="main-section top-border-red flex-container-vertical">
                        <Provider store={store}><CalcOutputWrapper /></Provider>
                    </div>
                </div>
            </div>
        </>
    );
}
