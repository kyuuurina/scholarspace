/* eslint-disable @typescript-eslint/restrict-template-expressions */
import NextHead from "next/head";

type Props = {
  title?: string;
};

const getTitle = (title?: string) => {
  if (title) {
    return `${title} - ${process.env.NEXT_PUBLIC_APP_NAME}`;
  }

  return process.env.NEXT_PUBLIC_APP_NAME;
};

export const Head: React.FC<Props> = ({ title }) => (
  <NextHead>
    <title>{getTitle(title)}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta property="og:title" content={process.env.NEXT_PUBLIC_APP_NAME} />
    <meta
      property="og:description"
      content="Keep track of your collaborations with other researchers."
    />
    <meta property="og:site_name" content={process.env.NEXT_PUBLIC_APP_NAME} />
    <meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL} />
    <meta property="og:type" content="website" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_US" />
    <link rel="icon" href="/scholarspace-logo.ico" />
  </NextHead>
);
