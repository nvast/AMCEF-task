import "./footer.css"

export default function Footer(){

    const year = new Date().getFullYear()
    
    return (
        <div id="footer">
            <p>&copy;&nbsp;{year} Bruno Szabó.</p>
        </div>
    )
}