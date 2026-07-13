import { Cycles } from "../Cycles/Cycles";
import { DefaultInput } from "../DefaultInput/DefaultInput";

import "./Form.css";

export function Form() {
    return (
        <div className="container">
            <div className="content">
                <form className="form" action="">
                    <div className="formRow">
                        <DefaultInput
                            id="myId"
                            type="text"
                            labelText="Tarefa"
                            placeholder="Digite sua tarefa"
                        />
                    </div>
                    <div className="formRow">
                        <p>Lorem ipsum dolor sit amet.</p>
                    </div>
                    <div className="formRow">
                        <Cycles />
                    </div>
                    <div className="formRow">
                        <button>Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
