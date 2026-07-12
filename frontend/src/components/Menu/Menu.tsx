import { House, History, Settings, SunMoon } from "lucide-react";
import "./Menu.css";

export function Menu() {
    return (
        <div className="container">
            <div className="content">
                <nav className="menu">
                    <ul>
                        <a href="#home">
                            <li>
                                <House />
                            </li>
                        </a>
                        <a href="#history">
                            <li>
                                <History />
                            </li>
                        </a>
                        <a href="#configs">
                            <li>
                                <Settings />
                            </li>
                        </a>
                        <a href="#theme">
                            <li>
                                <SunMoon />
                            </li>
                        </a>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
