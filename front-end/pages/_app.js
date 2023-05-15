import Head from 'next/head';

import 'styles/globals.css';
import { Nav, Alert } from 'components';

export default App;

function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Bankroll App</title>

                {/* bootstrap css */}
                <link href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
            </Head>

            <div className="app-container bg-light">
                <Nav />
                <Alert />
                <div className="container pt-4 pb-4">
                    <Component {...pageProps} />
                </div>
            </div>

            {/* credits */}
            <div className="text-center mt-4 bg-light">
                <p>
                    <a href="https://justinsj.com" target="_top">justinsj.com</a>
                </p>
            </div>
        </>
    );
}
