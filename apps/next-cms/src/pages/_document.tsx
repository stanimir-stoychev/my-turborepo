import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body className="selection:bg-secondary/80 selection:text-primary/80">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
