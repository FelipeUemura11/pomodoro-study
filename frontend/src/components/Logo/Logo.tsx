import logo from "../../assets/logo.png";
import "./Logo.css";

export function Logo() {
    return (
        <div className="container">
            <div className="content">
                <div className="image">
                    <a href="#">
                        <img src={logo} alt="Logo" />
                    </a>
                </div>
            </div>
        </div>
    );
}
