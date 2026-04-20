import Link from "next/link"

const Users = () => {
    console.log("I am a server component!")

    return (
        <main>
            <div className="text-5xl underline">This is a users page</div>

            <ul>
                <li><Link href="/dashboard/users/1">user 1</Link></li>
                <li><Link href="/dashboard/users/2">user 2</Link></li>
                
            </ul>
        </main>
    )
}

export default Users    