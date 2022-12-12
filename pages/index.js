import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {useRouter} from 'next/router';

export default function Home() {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Simple chat app for my portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.chatcontainer}>
          <h1 className={styles.heading}>CHAT+</h1>
          <div className={styles.buttons}>
            <button className={styles.button} onClick={() => router.push('/signup')}>Sign Up</button>
            <button className={styles.button} onClick={() => router.push('/login')}>Login</button>
          </div>
        </div>
      </main>
    </div>
  )
}
