/* =========================================================
ADM KATLEN ARIANE
ADMIN.JS
========================================================= */

/* =========================================================
ELEMENTOS
========================================================= */

const form = document.getElementById("admin-form");

const resetButton =
document.getElementById("reset-button");

const saveMessage =
document.getElementById("save-message");

/* =========================================================
SALVAR
========================================================= */

form.addEventListener("submit", function (event) {

```
event.preventDefault();

/*
 * Nesta primeira versão,
 * os dados ainda não são enviados
 * para o Cloudflare Worker.
 *
 * A próxima etapa irá conectar
 * este formulário à API.
 */

const formData =
    new FormData(form);

const data =
    Object.fromEntries(formData.entries());

console.log(
    "Configurações:",
    data
);


saveMessage.textContent =
    "Configurações preparadas. A conexão com o servidor será adicionada na próxima etapa.";
```

});

/* =========================================================
LIMPAR
========================================================= */

resetButton.addEventListener("click", function () {

```
const confirmed =
    window.confirm(
        "Deseja limpar todos os campos?"
    );

if (!confirmed) {
    return;
}

form.reset();

saveMessage.textContent =
    "Campos limpos.";
```

});

/* =========================================================
INICIALIZAÇÃO
========================================================= */

console.log(
"ADM Katlen Ariane carregado."
);
