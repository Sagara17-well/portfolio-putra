// Semua teks portofolio ada di sini, dalam dua bahasa: { id, en }.
// Ubah isi di file ini, bukan di komponen.

export type L = { id: string; en: string };
export const l = (id: string, en: string): L => ({ id, en });

export const profile = {
  name: ["Putra Baadi", "Zaelani"],
  city: "Bandung, Jawa Barat",
  campus: "Universitas Teknologi Bandung",
  email: "putrabaadi17@gmail.com",
  siteUrl: "", // isi alamat situsmu setelah deploy, mis. "https://namamu.vercel.app" (dipakai sitemap, security.txt, dan gambar pratinjau)
  // Isi bila ada. Tombol hanya muncul kalau terisi.
  github: "https://github.com/Sagara17-well",
  linkedin: "https://id.linkedin.com/in/putra-baa-di-zaelani-21457230b",
  // Isi salah satu: username atau tautan penuh (https://...). Yang kosong disembunyikan di situs publik.
  instagram: "baadizlniii_",
  tiktok: "saha_duka00",
  lead: l(
    "Saya membuat aplikasi web, lalu mencoba membobolnya sendiri. Dari situ saya belajar menulis kode yang lebih aman.",
    "I build web apps, then try to break them myself. That's how I learned to write safer code.",
  ),
  status: l("Mahasiswa UTB", "UTB student"),
  about: l(
    "Saya mahasiswa Teknik Informatika di Universitas Teknologi Bandung yang suka dua sisi dari satu aplikasi web: cara membangunnya dan cara celahnya muncul. Setiap fitur yang saya tulis, saya uji dengan satu pertanyaan: bagaimana ini bisa disalahgunakan? Kebiasaan itu membuat kode saya lebih hati-hati dan membuat saya paham cara kerja serangan yang sebenarnya.",
    "I'm an Informatics Engineering student at Universitas Teknologi Bandung who likes both sides of a web app: how to build it, and how its weaknesses appear. For every feature I write, I ask one question: how could this be abused? That habit makes my code more careful and helps me understand how real attacks work.",
  ),
};

export const education: { level: L; school: string; years: L; detail?: L; current?: boolean }[] = [
  { level: l("Sekolah Dasar", "Elementary School"), school: "SDN 270 Gentra Masekdas", years: l("2012 - 2018", "2012 - 2018") },
  { level: l("Sekolah Menengah Pertama", "Junior High School"), school: "SMPN 24 Bandung", years: l("2018 - 2021", "2018 - 2021") },
  { level: l("Sekolah Menengah Atas", "Senior High School"), school: "SMAN 18 Bandung", years: l("2021 - 2024", "2021 - 2024") },
  {
    level: l("Perguruan Tinggi", "University"),
    school: "Universitas Teknologi Bandung (UTB)",
    detail: l("Teknik Informatika", "Informatics Engineering"),
    years: l("2024 - sekarang", "2024 - present"),
    current: true,
  },
];

export const roles: L[] = [
  l("Web Developer", "Web Developer"),
  l("Penggemar Keamanan Siber", "Cybersecurity Enthusiast"),
  l("Mahasiswa Informatika", "Informatics Student"),
];

export const marquee = ["HTML", "CSS", "JavaScript", "TypeScript", "Next.js", "Tailwind", "PHP", "MySQL", "Linux", "Nmap", "Burp Suite", "OWASP"];

export const radar: { label: L; value: number }[] = [
  { label: l("Frontend", "Frontend"), value: 78 },
  { label: l("Backend", "Backend"), value: 58 },
  { label: l("Mobile", "Mobile"), value: 50 },
  { label: l("Jaringan", "Networking"), value: 55 },
  { label: l("Pentest web", "Web pentest"), value: 52 },
  { label: l("Linux", "Linux"), value: 66 },
];

export const stack: { group: L; items: string[] }[] = [
  { group: l("Web", "Web"), items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "PHP", "MySQL"] },
  { group: l("Keamanan", "Security"), items: ["OWASP Top 10", "SQL Injection", "XSS", "Burp Suite", "Nmap", "Wireshark", "Hashing & enkripsi"] },
  { group: l("Alat", "Tools"), items: ["Linux", "Kali Linux", "Git", "Laragon", "Kotlin", "SQLite"] },
];

export const experience = [
  {
    when: l("2024 - sekarang", "2024 - present"),
    title: l("Mahasiswa Teknik Informatika", "Computer Science Student"),
    org: "Universitas Teknologi Bandung",
    desc: l(
      "Mempelajari pemrograman mobile, OOP/OOAD, dan keamanan komputer, sambil mengerjakan proyek web dan aplikasi.",
      "Studying mobile programming, OOP/OOAD and computer security, while building web and app projects.",
    ),
  },
  {
    when: l("2024 - sekarang", "2024 - present"),
    title: l("Latihan keamanan mandiri", "Self-directed security practice"),
    org: l("Proyek pribadi", "Personal projects"),
    desc: l(
      "Membangun lab jaringan rumahan dan prototipe login, lalu menyerangnya sendiri dengan Nmap, Burp Suite, dan latihan OWASP Top 10.",
      "Building a home network lab and a login prototype, then attacking them myself with Nmap, Burp Suite and OWASP Top 10 exercises.",
    ),
  },
];

export type Cat = "web" | "security" | "mobile";

export type Project = {
  slug: string;
  title: string;
  status: L;
  cat: Cat;
  desc: L;
  tags: string[];
  /** Path gambar di /public, mis. "/project1.png". Kosongkan untuk memakai ilustrasi otomatis. */
  image?: string;
  code?: string;
  demo?: string; // URL demo atau anchor, mis. "#lab"
  demoLabel?: L;
  case?: boolean; // true = punya halaman studi kasus di /proyek/[slug]
};

export const projects: Project[] = [
  {
    slug: "sistem-login-aman",
    title: "Sistem Login Aman",
    status: l("Prototipe", "Prototype"),
    cat: "security",
    case: true,
    tags: ["PHP", "MySQL", "Keamanan"],
    desc: l(
      "Form login dengan hashing password, prepared statement, dan pembatasan percobaan masuk. Dibuat untuk memahami bagaimana brute force dan SQL injection dihentikan.",
      "A login form with password hashing, prepared statements and attempt limiting. Built to understand how brute force and SQL injection get stopped.",
    ),
  },
  {
    slug: "pemeriksa-header-keamanan",
    title: "Pemeriksa Header Keamanan",
    status: l("Dalam proses", "In progress"),
    cat: "security",
    tags: ["Next.js", "HTTP", "OWASP"],
    demo: "#lab",
    demoLabel: l("Coba versi mini", "Try the mini version"),
    desc: l(
      "Alat kecil yang membaca header HTTP sebuah situs, menandai header keamanan yang hilang, dan memberi saran perbaikan. Versi mini-nya bisa dicoba di bagian Lab.",
      "A small tool that reads a site's HTTP headers, flags missing security headers and suggests fixes. A mini version is in the Lab section.",
    ),
  },
  {
    slug: "lab-jaringan-rumahan",
    title: "Lab Jaringan Rumahan",
    status: l("Latihan", "Practice"),
    cat: "security",
    tags: ["Nmap", "Wireshark", "Linux"],
    desc: l(
      "Simulasi jaringan kecil untuk berlatih pemindaian port dan membaca lalu lintas paket.",
      "A small simulated network for practising port scanning and reading packet traffic.",
    ),
  },
  {
    slug: "aplikasi-musik-spotify-clone",
    title: "Aplikasi Musik (Spotify Clone)",
    status: l("Selesai", "Finished"),
    cat: "mobile",
    tags: ["Kotlin", "Room Database", "SQLite", "ExoPlayer"],
    desc: l(
      "Aplikasi pemutar musik Android berbasis Kotlin dan Room Database untuk manajemen playlist lokal, riwayat pemutaran, pemutaran latar belakang, dan kontrol audio ala Spotify.",
      "A Kotlin-based Android music player application using Room Database for local playlist management, playback history, background playback, and Spotify-like audio controls.",
    ),
  },
  {
    slug: "aplikasi-mobile-kuliah",
    title: "Aplikasi Mobile Kuliah",
    status: l("Tugas kuliah", "Coursework"),
    cat: "mobile",
    tags: ["Kotlin", "SQLite"],
    desc: l(
      "Aplikasi Android untuk mata kuliah pemrograman mobile, dengan penyimpanan data lokal.",
      "An Android app for a mobile programming course, with local data storage.",
    ),
  },
  {
    slug: "to-do-interaktif",
    title: "To-Do Interaktif",
    status: l("Latihan", "Practice"),
    cat: "web",
    tags: ["HTML", "CSS", "JavaScript"],
    desc: l(
      "Daftar tugas untuk mempelajari DOM, event, dan penyimpanan data di browser.",
      "A task list for learning the DOM, events and browser storage.",
    ),
  },
];

// Sertifikat: tambahkan objek baru, lalu simpan gambarnya di /public.
// Selama daftar ini kosong, bagian Sertifikat otomatis disembunyikan.

export type Cert = {
  title: string;
  by: string;
  year: string;
  image: string;
};

export const certs: Cert[] = [
  {
    title: "English Fundamentals",
    by: "Skill Pedia",
    year: "2026",
    image: "/inggris.png",
  },
  {
    title: "Belajar Pemrograman dengan Python",
    by: "Dicoding",
    year: "2026",
    image: "/sertifikat_course_86_5489429_040326205235_page-0001.jpg",
  },
  {
    title: "Belajar Machine Learning untuk Pemula",
    by: "Dicoding",
    year: "2026",
    image: "/sertifikat_course_184_5489429_210526021045_page-0001.jpg",
  },
  {
    title: "Belajar Manajemen Proyek",
    by: "Dicoding",
    year: "2026",
    image: "/sertifikat_course_570_5489429_210526150347_page-0001.jpg",
  },
  {
    title: "Memulai Pemrograman dengan Java",
    by: "Dicoding",
    year: "2026",
    image: "/1779307049991.jpg",
  },
  {
    title: "Belajar Dasar AI",
    by: "Dicoding",
    year: "2026",
    image: "/sertifikat_course_653_5489429_040326194054_page-0001.jpg",
  },
];

export const learning = [
  {
    topic: l("Keamanan aplikasi web", "Web application security"),
    note: l(
      "Menelusuri OWASP Top 10 satu per satu: pahami cara serangannya dulu, baru tulis penangkalnya.",
      "Working through the OWASP Top 10 one by one: understand the attack first, then write the defence.",
    ),
    tags: ["OWASP", "Burp Suite"],
  },
  {
    topic: l("Pemrograman mobile dengan Kotlin", "Mobile programming with Kotlin"),
    note: l(
      "Membangun aplikasi Android dengan penyimpanan lokal, sambil membiasakan diri menyimpan data dengan aman.",
      "Building Android apps with local storage, while getting used to storing data safely.",
    ),
    tags: ["Kotlin", "SQLite"],
  },
  {
    topic: l("Analisis OOP dan OOAD", "OOP and OOAD analysis"),
    note: l(
      "Belajar merancang sebelum menulis kode, supaya struktur aplikasi tidak menyulitkan pengamanannya nanti.",
      "Learning to design before coding, so an app's structure doesn't make it harder to secure later.",
    ),
    tags: ["OOP", "UML"],
  },
];

/** Studi kasus. Teks ini ditulis dari deskripsi proyek: cocokkan dengan implementasi aslimu. */
export const caseStudies: Record<
  string,
  {
    intro: L;
    problem: L;
    approach: L[];
    attacks: { name: L; how: L; fix: L }[];
    badSql: string;
    goodSql: string;
    outcome: L[];
    limits: L[];
  }
> = {
  "sistem-login-aman": {
    intro: l(
      "Satu form login kecil, dibangun dua kali: sekali dengan cara yang rentan, sekali dengan cara yang benar.",
      "One small login form, built twice: once the vulnerable way, once the right way.",
    ),
    problem: l(
      "Form login adalah pintu paling sering diserang di aplikasi web. Saya ingin tahu bukan hanya bahwa celahnya ada, tetapi persis di baris kode mana ia muncul dan bagaimana satu perubahan kecil menutupnya.",
      "A login form is the most attacked door in a web app. I wanted to know not just that the weaknesses exist, but exactly which line of code creates them and how one small change closes them.",
    ),
    approach: [
      l("Bangun versi rentan dengan query yang menyambung string langsung dari input pengguna.", "Build a vulnerable version whose query concatenates user input straight into the SQL string."),
      l("Serang versi itu sendiri dengan SQL injection dan tebakan password otomatis.", "Attack that version myself with SQL injection and automated password guessing."),
      l("Tulis ulang dengan hashing password, prepared statement, dan pembatasan percobaan masuk.", "Rewrite it with password hashing, prepared statements and login attempt limiting."),
      l("Ulangi serangan yang sama pada versi baru dan bandingkan hasilnya.", "Repeat the same attacks on the new version and compare the results."),
    ],
    attacks: [
      {
        name: l("SQL injection", "SQL injection"),
        how: l("Input seperti ' OR '1'='1 mengubah arti query sehingga kondisi login selalu benar.", "Input like ' OR '1'='1 changes the meaning of the query so the login condition is always true."),
        fix: l("Prepared statement memisahkan kode SQL dari data, jadi input hanya pernah dibaca sebagai data.", "Prepared statements separate SQL code from data, so input is only ever read as data."),
      },
      {
        name: l("Brute force", "Brute force"),
        how: l("Penyerang mencoba ribuan password umum terhadap satu akun tanpa dihentikan.", "An attacker tries thousands of common passwords against one account without being stopped."),
        fix: l("Pembatasan percobaan masuk memperlambat dan menghentikan tebakan beruntun.", "Attempt limiting slows down and stops repeated guessing."),
      },
      {
        name: l("Kebocoran basis data", "Database leak"),
        how: l("Jika tabel pengguna bocor, password polos langsung bisa dipakai di tempat lain.", "If the users table leaks, plain-text passwords can be reused elsewhere right away."),
        fix: l("Password disimpan sebagai hash dengan salt, sehingga yang bocor bukan password aslinya.", "Passwords are stored as salted hashes, so what leaks isn't the original password."),
      },
    ],
    badSql: `// Rentan: input pengguna menyatu dengan SQL
$sql = "SELECT * FROM users
        WHERE email = '$email'
        AND password = '$password'";
$result = $db->query($sql);`,
    goodSql: `// Aman: data dikirim terpisah dari SQL
$stmt = $db->prepare(
  "SELECT id, password_hash
     FROM users WHERE email = ?"
);
$stmt->bind_param("s", $email);
$stmt->execute();

// Bandingkan dengan hash, bukan teks polos
password_verify(
  $password, $row['password_hash']
);`,
    outcome: [
      l("Serangan SQL injection yang berhasil pada versi rentan tidak lagi berhasil pada versi baru.", "The SQL injection that worked on the vulnerable version no longer works on the new one."),
      l("Password tidak lagi tersimpan sebagai teks yang bisa dibaca.", "Passwords are no longer stored as readable text."),
      l("Saya jadi terbiasa membaca kode login dengan mata penyerang, bukan hanya mata pembuat.", "I got used to reading login code with an attacker's eyes, not just a builder's."),
    ],
    limits: [
      l("Belum ada autentikasi dua faktor.", "No two-factor authentication yet."),
      l("Pembatasan percobaan masuk belum diuji terhadap serangan yang terdistribusi.", "Attempt limiting hasn't been tested against distributed attacks."),
      l("Ini prototipe untuk belajar, belum siap dipakai di produksi.", "This is a learning prototype, not production-ready."),
    ],
  },
};

export const music = {
  // Tempel tautan playlist, album, atau lagu Spotify (open.spotify.com/...) agar pemutarnya tampil langsung di bagian Musik.
  // Contoh: "https://open.spotify.com/playlist/xxxxxxxx". Kosongkan jika tidak dipakai.
  spotify: "https://open.spotify.com/playlist/1fSoqAKAZaAizojmXkmDGw?si=2051823bf3de4349",
};

export const quotes: L[] = [
  l(
    "Ketidaktahuan bukanlah kelemahan, melainkan ruang bagi pikiran untuk terus bertumbuh.",
    "Not knowing is not a weakness, but room for the mind to keep growing.",
  ),
];