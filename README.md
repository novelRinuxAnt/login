# Novel Reader — Login

Halaman login untuk website Novel Reader.

Repository:

https://github.com/novelRinuxAnt/login


## Struktur

login/
│
├── index.html
├── README.md
│
├── css/
│   └── login.css
│
├── js/
│   └── login.js
│
└── assets/
    └── logo.svg


## Menjalankan

Repository dapat dijalankan menggunakan GitHub Pages.

Buka:

index.html


## Akun Demo

Untuk pengujian awal:

Username:

demo

Password:

123456


## Mode Demo

Secara default sistem menggunakan mode demo.

Konfigurasi berada di:

js/login.js


const LOGIN_CONFIG = {
    useApi: false,
    ...
};


## Mode API

Setelah backend tersedia, ubah:

useApi: false

menjadi:

useApi: true


Kemudian ubah:

apiUrl:

menjadi endpoint API login.


Contoh:

const LOGIN_CONFIG = {

    useApi: true,

    apiUrl: "https://domain-anda.com/api/login",

    redirectUrl: "../"

};


## Session

Session sementara disimpan menggunakan:

localStorage

atau:

sessionStorage


Key:

novelReaderSession


## Catatan Keamanan

Jangan menyimpan:

- password pengguna
- password database
- API secret
- private key
- token rahasia

langsung di repository GitHub.


Sistem produksi harus menggunakan backend
untuk melakukan autentikasi.


## Pengembangan Berikutnya

Rencana pengembangan:

1. Register
2. Forgot Password
3. Backend Authentication
4. User Profile
5. Logout
6. Session Validation
7. Token Authentication
8. Database User
9. Google Login
10. Integrasi Novel Reader