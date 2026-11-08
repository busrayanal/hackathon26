// Sitedeki tüm değişken içerik bu dosyada. Bir bilgi değiştiğinde sadece burayı düzenlemen yeterli.

window.HACKATECH = {
  // Google Form linki. Boş kalırsa başvuru butonu "Başvurular Yakında Açılıyor" olarak görünür.
  formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfhD2MSrQCk5y3_ICuEDqJbJkACjeuwLft-frZSd4_iX5sNQw/viewform",

  // İletişim. Boş bırakılanlar sitede görünmez.
  emails: ["gdscerzincan@gmail.com", "zehrakeskinn211@gmail.com", "efechdr12526@gmail.com"],
  phones: [
    { number: "0505 469 0611", name: "Sedanur Cihangir" },
    { number: "0507 759 9402", name: "Zehra Keskin" },
    { number: "0534 024 1711", name: "Muhammed Efe Çuhadar" }
  ],
  instagram: "gdgoncampusebyu", // kullanıcı adı, @ olmadan

  // Geri sayımın hedefi
  eventStart: "2026-12-14T09:00:00+03:00",

  // Son başvuru anı. Ana sayfadaki sayaç bu ana kadar sayar, sonra etkinliğe kalan süreye geçer.
  // Boş kalırsa "yaklaşık bir hafta önce" yazar ve sayaç doğrudan etkinliğe sayar.
  applyDeadline: "2026-12-07T23:59:00+03:00",

  about: {
    tr: "Hackathon’26, fikirlerini gerçeğe dönüştürmek isteyen gençler için bir üretim maratonu. Burada ne bildiğin değil, *kısa* *sürede* *ne* *üretebildiğin* önemli. Takımını topla, *sınırlarını* *zorla* ve ortaya koyduğun işi *jürinin* *karşısına* çıkar.",
    en: "Hackathon’26 is a building marathon for young people who want to turn ideas into something real. What matters here is not what you know, but *what* *you* *can* *build* *in* *a* *short* *time.* Gather your team, *push* *your* *limits* and take your work *in* *front* *of* *the* *jury.*"
  },

  // Etkinlik akışı. Saat eklemek istersen bir maddeye time: "09:00" yaz.
  schedule: [
    {
      label: { tr: "1. Gün", en: "Day 1" },
      badge: { tr: "12 saatlik geliştirme", en: "12 hours of building" },
      title: { tr: "Hackathon Günü", en: "Hack Day" },
      date: { tr: "14 Aralık 2026 · Pazartesi", en: "December 14, 2026 · Monday" },
      venue: "Milli Teknoloji Atölyesi",
      items: [
        { visual: "unlock", title: { tr: "Açılış", en: "Opening" }, desc: { tr: "Gizli tema açıklanır.", en: "The secret theme is revealed." } },
        { visual: "code", time: "10.00–22.00", title: { tr: "Proje geliştirme", en: "Building" }, desc: { tr: "Takımlar projelerini hayata geçirir.", en: "Teams bring their projects to life." } }
      ]
    },
    {
      label: { tr: "2. Gün", en: "Day 2" },
      badge: { tr: "Final ve ödüller", en: "Finals & awards" },
      title: { tr: "Final Günü", en: "Demo Day" },
      date: { tr: "15 Aralık 2026 · Salı", en: "December 15, 2026 · Tuesday" },
      venue: "Erdoğan Büyükkasap Kongre Merkezi",
      items: [
        { visual: "pitch", title: { tr: "Sunumlar", en: "Presentations" }, desc: { tr: "Her takım projesini jüriye sunar.", en: "Each team presents to the jury." } },
        { visual: "judge", title: { tr: "Değerlendirme", en: "Judging" }, desc: { tr: "Jüri projeleri değerlendirir.", en: "The jury evaluates the projects." } },
        { visual: "trophy", title: { tr: "Ödül töreni", en: "Award ceremony" }, desc: { tr: "Kazananlar açıklanır.", en: "The winners are announced." } }
      ]
    }
  ],

  // Jüri. Fotoğrafı assets/jury klasörüne koyup photo alanına yolunu yaz.
  // Henüz belli olmayanlar için {} bırak, "Yakında açıklanacak" kartı görünür.
  jury: [
    {
      title: "Prof. Dr.",
      name: "Ahmet Baran",
      role: { tr: "Bilgisayar Mühendisliği Bölüm Başkanı", en: "Head of Computer Engineering" },
      org: "Erzincan Binali Yıldırım Üniversitesi",
      bio: {
        tr: "Yapay zeka, makine öğrenmesi ve sinir ağları üzerine çalışan akademisyen.",
        en: "Academic working on artificial intelligence, machine learning and neural networks."
      },
      tags: [
        { tr: "Yapay Zeka", en: "Artificial Intelligence" },
        { tr: "Örüntü Tanıma", en: "Pattern Recognition" },
        { tr: "Sinir Ağları", en: "Neural Networks" },
        { tr: "Bulanık Sistemler", en: "Fuzzy Systems" }
      ],
      photo: "assets/jury/ahmet-baran.jpg"
    },
    {
      name: "Murat Yücedağ",
      role: { tr: "Yazılım Mühendisi · Eğitmen · Yazar", en: "Software Engineer · Instructor · Author" },
      org: "",
      bio: {
        tr: "2014'ten bu yana YouTube ve Udemy'de 1000'den fazla yazılım eğitim videosu yayımladı. \"Bir Yazılımcının Yol Haritası\" kitabının yazarı.",
        en: "Has published 1,000+ software training videos on YouTube and Udemy since 2014. Author of \"Bir Yazılımcının Yol Haritası\" (A Developer's Roadmap)."
      },
      tags: [
        { tr: "1000+ Eğitim Videosu", en: "1,000+ Tutorials" },
        { tr: "C# · .NET", en: "C# · .NET" },
        { tr: "SQL", en: "SQL" }
      ],
      photo: "assets/jury/murat-yucedag.jpg",
      // Fotoğrafta yüzün konumu (yatay% dikey%) ve yakınlaştırma oranı
      photoFocus: "51% 41%",
      photoZoom: 2.4
    },
    {},
    {},
    {}
  ],

  // Sponsorlar. Logo eklemek için logo: "assets/logo.png" yaz, yoksa ismi yazı olarak gösterilir.
  sponsors: [
    { name: "Red Bull", tier: { tr: "Sponsor", en: "Sponsor" }, logo: "", url: "" },
    { name: "Özdiyar", tier: { tr: "Sponsor", en: "Sponsor" }, logo: "", url: "" }
  ],

  // Ana sayfanın altındaki kayan logo şeridi
  partners: [
    { name: "Google Developer Groups on Campus EBYÜ", role: { tr: "Düzenleyen", en: "Organizer" }, logo: "assets/logos/gdg.png" },
    { name: "Erzincan Binali Yıldırım Üniversitesi", role: { tr: "Üniversite", en: "University" }, logo: "assets/logos/ebyu.png" },
    { name: "EBYÜ Mühendislik-Mimarlık Fakültesi", role: { tr: "Fakülte", en: "Faculty" }, logo: "assets/logos/ebyu-muhendislik.png" },
    { name: "Milli Teknoloji Atölyeleri", role: { tr: "Ev sahibi", en: "Host venue" }, logo: "assets/logos/mta.png" }
  ],

  faq: [
    {
      q: { tr: "Kimler katılabilir?", en: "Who can join?" },
      a: { tr: "Hangi şehirden olursan ol, üniversite öğrencisiysen katılabilirsin. Başvurular takım olarak yapılır.", en: "Any university student can join, whichever city you are from. Applications are made as a team." }
    },
    {
      q: { tr: "Katılım ücretli mi?", en: "Is there a fee?" },
      a: { tr: "Hayır, Hackathon’26’ya katılım tamamen ücretsizdir.", en: "No, joining Hackathon’26 is completely free." }
    },
    {
      q: { tr: "Hazır API ve yapay zeka araçları kullanabilir miyim?", en: "Can I use ready-made APIs and AI tools?" },
      a: { tr: "Evet. Açık kaynak kodlar, kütüphaneler, hazır API'ler ve yapay zeka araçları serbest. Ama takımın projenin çalışma mantığına hâkim olmalı ve kullandığı her şeyi teslim dokümanında belirtmeli.", en: "Yes. Open-source code, libraries, ready-made APIs and AI tools are all allowed. Your team must understand how the project works and list everything it used in the submission document." }
    },
    {
      q: { tr: "Hazır veri seti kullanabilir miyim?", en: "Can I use existing datasets?" },
      a: { tr: "Evet. Kaggle gibi platformlardaki açık veri setlerini kullanabilirsin.", en: "Yes. You can use open datasets from platforms such as Kaggle." }
    },
    {
      q: { tr: "Yanımda ne getirmeliyim?", en: "What should I bring?" },
      a: { tr: "Dizüstü bilgisayarın ve şarj aletin yeterli. Yiyecek ve içecek bizden.", en: "Just your laptop and charger. Food and drinks are on us." }
    },
    {
      q: { tr: "Konaklama sağlanıyor mu?", en: "Is accommodation provided?" },
      a: { tr: "Şehir dışından gelenlere konaklama sağlanmıyor, ama KYK yurtları ve misafirhaneler için yönlendirme desteği veriyoruz.", en: "Accommodation is not provided for out-of-town participants, but we help with directions to KYK dormitories and guesthouses." }
    },
    {
      q: { tr: "Projeler nasıl değerlendirilecek?", en: "How are projects judged?" },
      a: { tr: "Projeler 15 Aralık'taki sunumların ardından jüri tarafından değerlendirilir; tüm takımlar aynı kriterlerle puanlanır. Sunum ve teslim kuralları Kılavuz bölümünde.", en: "The jury evaluates projects after the presentations on December 15; all teams are scored on the same criteria. Presentation and submission rules are in the Guide section." }
    }
  ]
};
