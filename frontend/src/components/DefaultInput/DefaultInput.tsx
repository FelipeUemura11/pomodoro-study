import styles from "./DefaultInput.module.css";

type DefaultInputProps = {
    id: string;
    labelText: string;
} & React.ComponentProps<"input">;

export function DefaultInput({
    id,
    labelText,
    type,
    ...rest
}: DefaultInputProps) {
    return (
        <div className={styles.task}>
            <label className={styles.label} htmlFor={id}>
                {labelText}
            </label>
            <input className={styles.input} id={id} type={type} {...rest} />
        </div>
    );
}
