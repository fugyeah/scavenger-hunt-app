import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Scavenger Hunt!</h1>
      <p>Game instructions...</p>
      <Link href="/game">
        <a>Start the Game</a>
      </Link>
    </div>
  );
}
