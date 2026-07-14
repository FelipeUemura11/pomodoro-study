import styles from "./DefaultButton.module.css";

type DefaultButtonProps = {
    icon: React.ReactNode;
    color?: "green" | "red";
} & React.ComponentProps<"button">;

export function DefaultButton({
    icon,
    color = "green",
    // Sem isto o padrão do HTML é "submit", e todo botão dentro de um form
    // recarregaria a página ao ser clicado.
    type = "button",
    ...props
}: DefaultButtonProps) {
    return (
        <button
            type={type}
            className={`${styles.button} ${styles[color]}`}
            {...props}
        >
            {icon}
        </button>
    );
}
