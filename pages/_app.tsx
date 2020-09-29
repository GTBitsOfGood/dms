import React from "react";
import App from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import createNonprofitMuiTheme from "utils/theme";
import { Nonprofit } from "utils/types";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import config from "config";

/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
const stripePromise = loadStripe(config.stripe.publishable_key!);

export default class MyApp extends App {
  componentDidMount(): void {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    jssStyles?.parentElement?.removeChild(jssStyles);
  }

  render(): JSX.Element {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
    const { Component, pageProps } = this.props;

    return (
      <Elements stripe={stripePromise}>
        <Head>
          <title>Donation Marketplace Solution</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider
          theme={createNonprofitMuiTheme(
            "nonprofit" in pageProps
              ? /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
                (pageProps.nonprofit as Nonprofit)
              : undefined
          )}
        >
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </Elements>
    );
  }
}
