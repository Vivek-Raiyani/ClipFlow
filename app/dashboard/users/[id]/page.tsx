const UserDetails = async ({ params } : {params : Promise<{ id : string }>}) => {
    console.log("I am a server component!")
    const { id } = await params;
    return (
        <main>
            <div className="text-5xl underline">This is a users {id}</div>
        </main>
    )
}

export default UserDetails    

// page params