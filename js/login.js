
/* =========================================================
   NOVEL READER
   LOGIN SYSTEM
   VERSION 1.0
   Google Apps Script Authentication
   ========================================================= */


/* ---------------------------------------------------------
   CONFIGURATION
   --------------------------------------------------------- */

const LOGIN_CONFIG = {

    /*
     * Google Apps Script Web App
     */
    apiUrl:
        "https://script.google.com/macros/s/AKfycbyWqoJO_4qoYfFxNshOdd-jtIBfahASiaTmwD7POE56bCu0fBlnKdDpTuwwQPjUq6gOZg/exec",

    /*
     * Halaman Reader setelah login berhasil.
     */
    redirectUrl:
        "https://novelrinuxant.github.io/reader/",

    /*
     * Delay kecil agar loading terlihat.
     */
    redirectDelay: 500

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

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* ---------------------------------------------------------
   SHOW / HIDE PASSWORD
   --------------------------------------------------------- */

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        function () {

            const isPassword =
                passwordInput.type === "password";


            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";


            if (eyeIcon) {

                eyeIcon.textContent =
                    isPassword
                        ? "🙈"
                        : "👁";

            }


            togglePassword.setAttribute(
                "aria-label",
                isPassword
                    ? "Sembunyikan password"
                    : "Tampilkan password"
            );

        }
    );

}


/* ---------------------------------------------------------
   MESSAGE
   --------------------------------------------------------- */

function showMessage(message, type) {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        message;


    loginMessage.className =
        "login-message show " + type;

}


function clearMessage() {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        "";


    loginMessage.className =
        "login-message";

}


/* ---------------------------------------------------------
   LOADING
   --------------------------------------------------------- */

function setLoading(isLoading) {

    if (loginButton) {

        loginButton.disabled =
            isLoading;

    }


    if (loginButtonText) {

        loginButtonText.hidden =
            isLoading;

    }


    if (loginLoading) {

        loginLoading.hidden =
            !isLoading;

    }

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
            "Username wajib diisi.",
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
   API LOGIN
   --------------------------------------------------------- */

/*
 * Google Apps Script menggunakan:
 *
 * GET
 * ?username=...
 * &password=...
 *
 * Contoh:
 *
 * /exec?username=085722207569&password=TPLBK12345
 *
 */

async function apiLogin(username, password) {

    const url =
        new URL(
            LOGIN_CONFIG.apiUrl
        );


    /*
     * Username dan password dimasukkan
     * sebagai query parameter.
     */
    url.searchParams.set(
        "username",
        username
    );


    url.searchParams.set(
        "password",
        password
    );


    /*
     * Request ke Google Apps Script.
     */
    const response =
        await fetch(
            url.toString(),
            {
                method: "GET",
                cache: "no-store"
            }
        );


    /*
     * Periksa HTTP response.
     */
    if (!response.ok) {

        throw new Error(
            "Server login gagal. HTTP " +
            response.status
        );

    }


    /*
     * Ambil JSON.
     */
    const result =
        await response.json();


    /*
     * Pastikan response berbentuk object.
     */
    if (
        !result ||
        typeof result !== "object"
    ) {

        throw new Error(
            "Response server tidak valid."
        );

    }


    return result;

}


/* ---------------------------------------------------------
   SAVE SESSION
   --------------------------------------------------------- */

function saveSession(result, remember) {

    const session = {

        loggedIn: true,

        username:
            result.username || "",

        total:
            Number(result.total || 0),

        files:
            Array.isArray(result.files)
                ? result.files
                : [],

        loginTime:
            new Date().toISOString()

    };


    /*
     * Storage utama
     */

    const storage =
        remember
            ? localStorage
            : sessionStorage;


    /*
     * Simpan session.
     */

    storage.setItem(
        "novelReaderSession",
        JSON.stringify(session)
    );


    /*
     * Simpan juga sebagai
     * novelReaderData.
     *
     * Ini untuk kompatibilitas
     * dengan Reader.
     */

    storage.setItem(
        "novelReaderData",
        JSON.stringify(session)
    );


    /*
     * Bersihkan storage lainnya.
     */

    const otherStorage =
        remember
            ? sessionStorage
            : localStorage;


    otherStorage.removeItem(
        "novelReaderSession"
    );

    otherStorage.removeItem(
        "novelReaderData"
    );

}

/* ---------------------------------------------------------
   GET CURRENT SESSION
   --------------------------------------------------------- */

function getStoredSession() {

    const localSession =
        localStorage.getItem(
            "novelReaderSession"
        );


    const sessionSession =
        sessionStorage.getItem(
            "novelReaderSession"
        );


    const session =
        localSession ||
        sessionSession;


    if (!session) {

        return null;

    }


    try {

        return JSON.parse(session);

    } catch (error) {

        console.error(
            "Session tidak valid:",
            error
        );


        localStorage.removeItem(
            "novelReaderSession"
        );


        sessionStorage.removeItem(
            "novelReaderSession"
        );


        return null;

    }

}


/* ---------------------------------------------------------
   LOGIN
   --------------------------------------------------------- */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            clearMessage();


            /*
             * Validasi form.
             */

            if (!validateForm()) {

                return;

            }


            const username =
                usernameInput.value.trim();

            const password =
                passwordInput.value;

            const remember =
                rememberInput
                    ? rememberInput.checked
                    : false;


            /*
             * Aktifkan loading.
             */

            setLoading(true);


            try {

                /*
                 * Login ke Google Apps Script.
                 */

                const result =
                    await apiLogin(
                        username,
                        password
                    );


                console.log(
                    "Response login:",
                    result
                );


                /*
                 * Periksa hasil login.
                 */

                if (!result.success) {

                    showMessage(
                        result.message ||
                        "Username atau password salah.",
                        "error"
                    );

                    return;

                }


                /*
                 * Pastikan data files tersedia.
                 */

                if (
                    !Array.isArray(
                        result.files
                    )
                ) {

                    showMessage(
                        "Login berhasil, tetapi daftar WebP tidak ditemukan.",
                        "error"
                    );

                    return;

                }


                /*
                 * Simpan session.
                 */

                saveSession(
                    result,
                    remember
                );


                /*
                 * Tampilkan pesan berhasil.
                 */

                showMessage(
                    "Login berhasil. Membuka Reader...",
                    "success"
                );


                /*
                 * Redirect ke Reader.
                 */

                setTimeout(
                    function () {

                        window.location.href =
                            LOGIN_CONFIG.redirectUrl;

                    },
                    LOGIN_CONFIG.redirectDelay
                );


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                showMessage(
                    "Tidak dapat menghubungi server login. Silakan coba lagi.",
                    "error"
                );


            } finally {

                setLoading(false);

            }

        }
    );

}


/* ---------------------------------------------------------
   FORGOT PASSWORD
   --------------------------------------------------------- */

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            showMessage(
                "Fitur lupa password belum tersedia.",
                "error"
            );

        }
    );

}


/* ---------------------------------------------------------
   REGISTER
   --------------------------------------------------------- */

if (registerLink) {

    registerLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            showMessage(
                "Pendaftaran akun belum tersedia pada versi 1.0.",
                "error"
            );

        }
    );

}


/* ---------------------------------------------------------
   CHECK EXISTING SESSION
   --------------------------------------------------------- */

function checkExistingSession() {

    const session =
        getStoredSession();


    if (!session) {

        return;

    }


    /*
     * Jangan otomatis redirect.
     *
     * Ini tetap memungkinkan pengguna
     * melihat halaman login.
     */

    if (
        session.loggedIn &&
        Array.isArray(session.files)
    ) {

        console.log(
            "Session Novel Reader ditemukan:",
            {
                username:
                    session.username,

                total:
                    session.total,

                files:
                    session.files.length
            }
        );

    }

}


/* ---------------------------------------------------------
   INITIALIZE
   --------------------------------------------------------- */

checkExistingSession();
