import './detailskeleton.css';

export default function Moviedetail() {

  return (
    <div>
        <div>
            <div className='nav-logo'>
                <h1 className='title'>FlimFair</h1>
            </div>
      <div className='movie-details'>

        <div className='detail-body'>
        
            <div className='detail-header1'>
                <div className='movdet-verposter skeleton'></div>
                <div className='detail-header-txt1 skeleton'>
                  
                </div>
              </div>
          <h1 className='det-text flimfair-users trailer' >Watch the Trailer now🎬</h1>
          <div className='ytvid skeleton'></div>

        </div>

        <div className='review1'>
          <form>
            <h1 style={{fontSize:"2.5rem", margin: "2.5rem 0 2rem 0"}}>Share Your Thoughts</h1>
                <div className='reviews skeleton'>

                </div>
          </form>
        </div>

        </div>
        </div>

    </div>
  )
}
