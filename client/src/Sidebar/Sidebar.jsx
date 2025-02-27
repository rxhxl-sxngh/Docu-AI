
function Sidebar() {
    return(
        <div>
        <nav class="h-screen w-64 fixed bg-white border-r border-neutral-200/30 hidden lg:block">
        <p>DocuAI</p>
          <ul>
            <li><p>Queue</p></li>
            <li><p>Start</p></li>
            <li><p>Results</p></li>
            <li><p>Upload</p></li>
            <li><p>Analytics</p></li>
          </ul>
        </nav>
      </div>
    )
}

export default Sidebar