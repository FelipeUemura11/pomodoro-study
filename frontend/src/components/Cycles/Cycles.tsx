import "./Cycles.css";

export function Cycles() {
    return (
        <div className="cycles">
            <span>Ciclos:</span>
            <div className="cycles-dots">
                <span className={"cycle-dot work-time"}></span>
                <span className={"cycle-dot break-time"}></span>
                <span className={"cycle-dot work-time"}></span>
                <span className={"cycle-dot break-time"}></span>
                <span className={"cycle-dot work-time"}></span>
                <span className={"cycle-dot break-time"}></span>
                <span className={"cycle-dot work-time"}></span>
                <span className={"cycle-dot break-time"}></span>
                <span className={"cycle-dot long-work-time"}></span>
            </div>
        </div>
    );
}
