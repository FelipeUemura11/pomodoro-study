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
                        <p>Ciclos.</p>
                        <p>0 0 0 0 0 0 0</p>
                    </div>
                    <div className="formRow">
                        <button>Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
