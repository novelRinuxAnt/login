/* =========================================================
   NOVEL RINU'XANT
   LOGIN SYSTEM
   VERSION 2.1 FINAL
   Google Apps Script Authentication
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const LOGIN_CONFIG = {

    /*
     * Google Apps Script Web App
     */
    apiUrl:
        "https://script.google.com/macros/s/AKfycbyJUFKi2cIQdlxtWQ6pYyHb6XhBfSgxKK6vjHRNNve0G6Lcyx9XQhJWLlBA3VbB3Q6tlQ/exec",

    /*
     * Reader
     */
    redirectUrl:
        "https://novelrinuxant.github.io/reader/",

    /*
     * Delay redirect
     */
    redirectDelay:
        500

};


/* =========================================================
   ELEMENTS
   ========================================================= */

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

const yearElement =
    document.getElementById("year");


/* =========================================================
   YEAR
   ========================================================= */

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   PASSWORD TOGGLE
   ========================================================= */

if (
    togglePassword &&
    passwordInput
) {

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


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(
    message,
    type
) {

    if (!loginMessage) {

        return;

    }


    loginMessage.textContent =
        message;


    loginMessage.className =
        "login-message show " +
        type;

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


/* =========================================================
   LOADING
   ========================================================= */

function setLoading(
    isLoading
) {

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


/* =========================================================
   VALIDATION
   ========================================================= */

function validateForm() {

    if (
        !usernameInput ||
        !passwordInput
    ) {

        return false;

    }


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


    if (
        password.length < 6
    ) {

        showMessage(
            "Password minimal 6 karakter.",
            "error"
        );


        passwordInput.focus();


        return false;

    }


    return true;

}


/* =========================================================
   API LOGIN
   ========================================================= */

async function apiLogin(
    username,
    password
) {

    const url =
        new URL(
            LOGIN_CONFIG.apiUrl
        );


    /*
     * Username
     */
    url.searchParams.set(
        "username",
        username
    );


    /*
     * Password
     */
    url.searchParams.set(
        "password",
        password
    );


    console.log(
        "Menghubungi API:",
        url.toString()
    );


    const response =
        await fetch(
            url.toString(),
            {
                method:
                    "GET",

                cache:
                    "no-store",

                redirect:
                    "follow"
            }
        );


    if (!response.ok) {

        throw new Error(
            "HTTP " +
            response.status
        );

    }


    const text =
        await response.text();


    console.log(
        "Raw API response:",
        text
    );


    let result;


    try {

        result =
            JSON.parse(
                text
            );

    } catch (error) {

        throw new Error(
            "Response API bukan JSON."
        );

    }


    if (
        !result ||
        typeof result !== "object"
    ) {

        throw new Error(
            "Response API tidak valid."
        );

    }


    return result;

}


/* =========================================================
   VALIDATE FILE DATA
   ========================================================= */

function validateFiles(
    files
) {

    if (
        !Array.isArray(files)
    ) {

        return false;

    }


    if (
        files.length === 0
    ) {

        return false;

    }


    /*
     * Periksa maksimal 3 file pertama
     */

    for (
        let i = 0;
        i < Math.min(
            files.length,
            3
        );
        i++
    ) {

        const file =
            files[i];


        if (!file) {

            return false;

        }


        if (!file.id) {

            console.error(
                "File tidak memiliki ID:",
                file
            );

            return false;

        }


        if (!file.name) {

            console.error(
                "File tidak memiliki nama:",
                file
            );

            return false;

        }


        if (!file.url) {

            console.error(
                "File tidak memiliki URL:",
                file
            );

            return false;

        }

    }


    return true;

}


/* =========================================================
   SAVE SESSION
   ========================================================= */

function saveSession(
    result,
    remember
) {

    const session = {

        loggedIn:
            true,

        username:
            result.username || "",

        total:
            Number(
                result.total || 0
            ),

        files:
            Array.isArray(
                result.files
            )
                ? result.files
                : [],

        loginTime:
            new Date().toISOString()

    };


    /*
     * Hapus session lama
     */

    localStorage.removeItem(
        "novelReaderSession"
    );


    sessionStorage.removeItem(
        "novelReaderSession"
    );


    /*
     * Tentukan storage
     */

    const storage =
        remember
            ? localStorage
            : sessionStorage;


    /*
     * Simpan session
     */

    storage.setItem(
        "novelReaderSession",
        JSON.stringify(
            session
        )
    );


    /*
     * DEBUG
     */

    console.log(
        "SESSION TERSIMPAN:",
        session
    );


    console.log(
        "Jumlah halaman:",
        session.files.length
    );


    if (
        session.files.length > 0
    ) {

        console.log(
            "URL page-0001:",
            session.files[0].url
        );

    }

}


/* =========================================================
   GET STORED SESSION
   ========================================================= */

function getStoredSession() {

    const localSession =
        localStorage.getItem(
            "novelReaderSession"
        );


    const sessionSession =
        sessionStorage.getItem(
            "novelReaderSession"
        );


    const saved =
        localSession ||
        sessionSession;


    if (!saved) {

        return null;

    }


    try {

        return JSON.parse(
            saved
        );

    } catch (error) {

        console.error(
            "Session rusak:",
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


/* =========================================================
   LOGIN PROCESS
   ========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            /*
             * Hentikan submit HTML biasa
             */
            event.preventDefault();


            /*
             * Bersihkan pesan lama
             */
            clearMessage();


            /*
             * Validasi
             */
            if (
                !validateForm()
            ) {

                /*
                 * Pastikan tombol normal
                 */
                setLoading(false);

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
             * =================================================
             * MULAI LOADING
             * =================================================
             *
             * Pada titik ini:
             *
             * Masuk
             *   ↓
             * Memproses...
             *
             */

            setLoading(true);


            try {

                /*
                 * =================================================
                 * PANGGIL GOOGLE APPS SCRIPT
                 * =================================================
                 */

                const result =
                    await apiLogin(
                        username,
                        password
                    );


                console.log(
                    "HASIL LOGIN:",
                    result
                );


                /*
                 * =================================================
                 * LOGIN GAGAL
                 * =================================================
                 */

                if (
                    result.success !== true
                ) {

                    showMessage(
                        result.message ||
                        "Username atau password salah.",
                        "error"
                    );


                    /*
                     * finally akan mengembalikan
                     * tombol menjadi "Masuk"
                     */

                    return;

                }


                /*
                 * =================================================
                 * PERIKSA FILE
                 * =================================================
                 */

                if (
                    !validateFiles(
                        result.files
                    )
                ) {

                    showMessage(
                        "Login berhasil, tetapi daftar WebP tidak valid.",
                        "error"
                    );


                    return;

                }


                /*
                 * =================================================
                 * SIMPAN SESSION
                 * =================================================
                 */

                saveSession(
                    result,
                    remember
                );


                /*
                 * =================================================
                 * LOGIN BERHASIL
                 * =================================================
                 */

                showMessage(
                    "Login berhasil. Membuka Reader...",
                    "success"
                );


                /*
                 * =================================================
                 * REDIRECT
                 * =================================================
                 */

                setTimeout(
                    function () {

                        window.location.replace(
                            LOGIN_CONFIG.redirectUrl
                        );

                    },
                    LOGIN_CONFIG.redirectDelay
                );


            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                showMessage(
                    "Tidak dapat menghubungi server login. Silakan coba lagi.",
                    "error"
                );


            } finally {

                /*
                 * =================================================
                 * KEMBALIKAN TOMBOL
                 * =================================================
                 *
                 * Jika login gagal:
                 *
                 * Memproses...
                 *       ↓
                 * Masuk
                 *
                 * Jika login berhasil:
                 * halaman akan redirect ke Reader.
                 *
                 */

                setLoading(false);

            }

        }
    );

}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

/*
 * JANGAN menggunakan event.preventDefault()
 * di sini.
 *
 * Link langsung membuka WhatsApp.
 */


/* =========================================================
   REGISTER
   ========================================================= */

/*
 * JANGAN menggunakan event.preventDefault()
 * di sini.
 *
 * Link langsung membuka WhatsApp.
 */


/* =========================================================
   CHECK EXISTING SESSION
   ========================================================= */

function checkExistingSession() {

    const session =
        getStoredSession();


    if (!session) {

        console.log(
            "Tidak ada session."
        );

        return;

    }


    if (
        session.loggedIn === true &&
        Array.isArray(
            session.files
        )
    ) {

        console.log(
            "Session ditemukan:",
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


/* =========================================================
   INITIALIZE
   ========================================================= */

checkExistingSession();
