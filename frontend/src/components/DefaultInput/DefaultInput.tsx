import "./DefautlInput.css"

type DefaultInputProps = {
    id: string;
    labelText: string;
} & React.ComponentProps<'input'>;

export function DefaultInput({ id, labelText, type, ...rest }: DefaultInputProps) {
    return (
        <div className="task">
            <label htmlFor={id}>{labelText}</label>
            <input id="myId" type={type} {...rest}/>
        </div>
    );
}
