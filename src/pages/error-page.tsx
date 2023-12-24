import React from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: string | undefined; // Define the error prop as an Error object
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => (
  <div className="flex h-screen flex-col items-center justify-center space-y-4">
    <h1 className="text-4xl font-bold">Sorry, there was an error</h1>
    <p>{error}</p>
    <Link href="/" className="text-purple-accent-1">Go back to Home page.</Link>
  </div>
);

export default ErrorPage;
