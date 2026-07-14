import { Cycles } from "../Cycles/Cycles";
import { DefaultButton } from "../DefaultButton/DefaultButton";
import { DefaultInput } from "../DefaultInput/DefaultInput";

import styles from "./Form.module.css";

export function Form() {
    return (
        <div className="container">
            <div className="content">
                <form className={styles.form} action="">
                    <div className={styles.formRow}>
                        <DefaultInput
                            id="myId"
                            type="text"
                            labelText="Tarefa"
                            placeholder="Digite sua tarefa"
                        />
                    </div>
                    <div className={styles.formRow}>
                        <p>Lorem ipsum dolor sit amet.</p>
                    </div>
                    <div className={styles.formRow}>
                        <Cycles />
                    </div>
                    <div className={styles.formRow}>
                        <DefaultButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
