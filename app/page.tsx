import Hello from "./components/hello"

const Page = async () => {
  const response = await fetch("http:localhost:3000/api/books");
  const books = await response.json();
  console.log("I am a server component!")

  return (
    <main>
      <div className="text-5xl underline">This is a sample server component</div>
      <hr />
        <code>{JSON.stringify(books, null, 2)}</code>
      <hr />
      <Hello/>
    </main>
  )
}

export default Page