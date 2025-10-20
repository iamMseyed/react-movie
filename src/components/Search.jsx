export const Search = ({searchTerm, setSearchTerm}) =>{
    return (
        <>
            <div className="search">
                <div>
                    <img src="search.svg" alt="search" />
                    <input type="text"
                    placeholder="Search through tons of movies"
                    onChange={
                        (event)=> setSearchTerm(event.target.value)
                    }
                    />
                </div>
            </div>
        </>
    )
}
