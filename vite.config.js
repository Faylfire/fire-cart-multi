import {defineConfig, loadEnv} from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env.VITE_FIREBASE_URL': JSON.stringify(env.VITE_FIREBASE_URL)
    },
  };
});