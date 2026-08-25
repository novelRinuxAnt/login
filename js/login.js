/* =========================================================
   NOVEL READER
   LOGIN SYSTEM
   ========================================================= */


/* ---------------------------------------------------------
   CONFIGURATION
   --------------------------------------------------------- */

const LOGIN_CONFIG = {

    /*
     * false = mode demo
     * true  = menggunakan API
     */
    useApi: false,

    /*
     * Nanti bisa diganti dengan endpoint backend.
     */
    apiUrl: "https://novelrinuxant.github.io/login/",

    /*
     * Halaman tujuan setelah login berhasil.
     */
    redirectUrl: "https://github.com/novelRinuxAnt/reader/",

    /*
     * Waktu simulasi login demo.
     */
    demoDelay: 700

};


/* ---------------------------------------------------------
   ELEMENTS
   --------------------------------------------------------- */

const loginForm =
    document.getElementById("loginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const rememberInput =
    document.getElementById("remember");

const togglePassword =
    document.getElementById("togglePassword");

const eyeIcon =
    document.getElementById("eyeIcon");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const loginLoading =
    document.getElementById("loginLoading");

const loginMessage =
    document.getElementById("loginMessage");

const forgotPassword =
    document.getElementById("forgotPassword");

const registerLink =
    document.getElementById("registerLink");

const yearElement =
    document.getElementById("year");


/* ---------------------------------------------------------
   YEAR
   --------------------------------------------------------- */

yearElement.textContent =
    new Date().getFullYear();


/* ---------------------------------------------------------
   SHOW / HIDE PASSWORD
   --------------------------------------------------------- */

togglePassword.addEventListener("click", function () {

    const isPassword =
        passwordInput.type === "password";


    passwordInput.type =
        isPassword ? "text" : "password";


    eyeIcon.textContent =
        isPassword ? "🙈" : "👁";


    togglePassword.setAttribute(
        "aria-label",
        isPassword
            ? "Sembunyikan password"
            : "Tampilkan password"
    );

});


/* ---------------------------------------------------------
   MESSAGE
   --------------------------------------------------------- */

function showMessage(message, type) {

    loginMessage.textContent = message;

    loginMessage.className =
        "login-message show " + type;

}


function clearMessage() {

    loginMessage.textContent = "";

    loginMessage.className =
        "login-message";

}


/* ---------------------------------------------------------
   LOADING
   --------------------------------------------------------- */

function setLoading(isLoading) {

    loginButton.disabled = isLoading;

    loginButtonText.hidden = isLoading;

    loginLoading.hidden = !isLoading;

}


/* ---------------------------------------------------------
   VALIDATION
   --------------------------------------------------------- */

function validateForm() {

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    if (!username) {

        showMessage(
            "Username atau email wajib diisi.",
            "error"
        );

        usernameInput.focus();

        return false;
    }


    if (!password) {

        showMessage(
            "Password wajib diisi.",
            "error"
        );

        passwordInput.focus();

        return false;
    }


    if (password.length < 6) {

        showMessage(
            "Password minimal 6 karakter.",
            "error"
        );

        passwordInput.focus();

        return false;
    }


    return true;
}


/* ---------------------------------------------------------
   DEMO LOGIN
   --------------------------------------------------------- */

async function demoLogin(username, password) {

    await new Promise(function (resolve) {

        setTimeout(
            resolve,
            LOGIN_CONFIG.demoDelay
        );

    });


    /*
     * Akun demo.
     *
     * JANGAN digunakan untuk sistem produksi.
     */

    const demoUser = {
        username: "demo",
        password: "123456"
    };


    if (
        username !== demoUser.username ||
        password !== demoUser.password
    ) {

        return {
            success: false,
            message:
                "Username atau password salah."
        };

    }


    return {

        success: true,

        user: {
            username: "demo",
            name: "Pengguna Demo"
        }

    };

}


/* ---------------------------------------------------------
   API LOGIN
   --------------------------------------------------------- */

async function apiLogin(username, password) {

    const response =
        await fetch(
            LOGIN_CONFIG.apiUrl,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    username: username,

                    password: password

                })
            }
        );


    if (!response.ok) {

        throw new Error(
            "Server login gagal."
        );

    }


    return await response.json();

}


/* ---------------------------------------------------------
   SAVE SESSION
   --------------------------------------------------------- */

function saveSession(user, remember) {

    const session = {

        loggedIn: true,

        user: user,

        loginTime:
            new Date().toISOString()

    };


    const storage =
        remember
            ? localStorage
            : sessionStorage;


    storage.setItem(
        "novelReaderSession",
        JSON.stringify(session)
    );


    /*
     * Jika sebelumnya ada session di storage lain,
     * hapus supaya tidak terjadi konflik.
     */

    const otherStorage =
        remember
            ? sessionStorage
            : localStorage;


    otherStorage.removeItem(
        "novelReaderSession"
    );

}


/* ---------------------------------------------------------
   LOGIN
   --------------------------------------------------------- */

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        clearMessage();


        if (!validateForm()) {
            return;
        }


        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;

        const remember =
            rememberInput.checked;


        setLoading(true);


        try {

            let result;


            if (LOGIN_CONFIG.useApi) {

                result =
                    await apiLogin(
                        username,
                        password
                    );

            } else {

                result =
                    await demoLogin(
                        username,
                        password
                    );

            }


            if (!result.success) {

                showMessage(
                    result.message ||
                    "Login gagal.",
                    "error"
                );

                return;
            }


            saveSession(
                result.user,
                remember
            );


            showMessage(
                "Login berhasil. Mengalihkan...",
                "success"
            );


            setTimeout(function () {

                window.location.href =
                    LOGIN_CONFIG.redirectUrl;

            }, 500);


        } catch (error) {

            console.error(error);

            showMessage(
                "Terjadi kesalahan saat menghubungi server.",
                "error"
            );

        } finally {

            setLoading(false);

        }

    }
);


/* ---------------------------------------------------------
   FORGOT PASSWORD
   --------------------------------------------------------- */

forgotPassword.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showMessage(
            "Fitur lupa password akan tersedia setelah sistem akun terhubung ke backend.",
            "error"
        );

    }
);


/* ---------------------------------------------------------
   REGISTER
   --------------------------------------------------------- */

registerLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showMessage(
            "Halaman pendaftaran akan dibuat pada modul berikutnya.",
            "error"
        );

    }
);


/* ---------------------------------------------------------
   CHECK EXISTING SESSION
   --------------------------------------------------------- */

function checkExistingSession() {

    const localSession =
        localStorage.getItem(
            "novelReaderSession"
        );

    const sessionSession =
        sessionStorage.getItem(
            "novelReaderSession"
        );


    const session =
        localSession || sessionSession;


    if (!session) {
        return;
    }


    try {

        const data =
            JSON.parse(session);


        if (data.loggedIn) {

            /*
             * Untuk sementara tidak otomatis redirect.
             * Ini memudahkan pengujian halaman login.
             */

            console.log(
                "Session ditemukan:",
                data
            );

        }

    } catch (error) {

        console.error(
            "Session tidak valid.",
            error
        );

    }

}


checkExistingSession();
