const emailRequiredError = document.getElementById("email-required-error");
const emailInvalidError = document.getElementById("email-invalid-error");
const passwordRequiredError = document.getElementById("password-required-error");

function onChangeEmail() {
    const email = document.getElementById("email").value.trim();
    emailRequiredError.style.display = email ? "none" : "block";
    emailInvalidError.style.display = email && validateEmail(email) ? "none" : email ? "block" : "none";
}

function onChangePassword() {
    const password = document.getElementById("password").value.trim();
    passwordRequiredError.style.display = password ? "none" : "block";
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function cadastro() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    onChangeEmail();
    onChangePassword();

    if (!email || !validateEmail(email)) return;
    if (!password) return;

    try {
        const auth = firebase.auth();
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

        alert("Usuário cadastrado com sucesso!");
        console.log("Usuário:", userCredential.user);

        window.location.href = "../pagina-inicial/pagina-inicial.html";
    } catch (error) {
        console.error("Erro ao registrar:", error.message);
        alert("Erro ao registrar: " + error.message);
    }
}
