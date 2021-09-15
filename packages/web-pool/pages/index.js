import Link from 'next/link'

function Home() {
  return (
    <>
      <div className="mx-auto w-96 py-28">
        <div className="space-x-4">
          <Link href="/pool">Pool</Link>
          <Link href="/farm">Farm</Link>
        </div>
      </div>
    </>
  );
}

export default Home;
