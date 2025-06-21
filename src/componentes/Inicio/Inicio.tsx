import './Inicio.css'

function Inicio(){
    return(
        <>
        <div className="container">
            <h3>Faça sua consulta no info-dengue com seus exames <br />para haveriguar se você possa estar contaminado.</h3>
            <form action="">
                <div className="inputs">
                    <label>
                        Gênero:
                    </label>
                    <input type="text" />
                </div>
                <div className="inputs">
                    <label>
                        Idade:
                    </label>
                    <input type="text" />
                </div>
                <div className="inputs">
                    <label>
                        IgG:
                    </label>
                    <input type="text" />
                </div>
                <div className="inputs">
                    <label>
                        IgM:
                    </label>
                    <input type="text" />
                </div>
                <div className="inputs">
                    <label>
                        Área em que mora:
                    </label>
                    <input type="text" />
                </div>
                <div className="inputs">
                    <label>
                        Tipo de área em que mora:
                    </label>
                    <input type="text" />
                </div>
                <div className="inputs">
                    <label>
                        Tipo de casa em que mora:
                    </label>
                    <input type="text" />
                </div>
                <div className="botao">
                <button className=''>Consultar</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default Inicio