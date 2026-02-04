import "@/styles/globals.css";

import AuthProvider from "@/context/AuthContext";
import { EmotionProvider } from "@/context/EmotionContext";
export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <EmotionProvider>
        <Component {...pageProps} />
      </EmotionProvider>
    </AuthProvider>
  );
}
