# Hackathon’26

GDG on Campus Erzincan Binali Yıldırım Üniversitesi'nin düzenlediği Hackathon’26 hackathonunun tanıtım sitesi.

## Bilgileri güncellemek

Sitedeki değişken bilgilerin hepsi `js/data.js` dosyasında:

- `formUrl`: Google Form linki. Eklenince başvuru butonu otomatik aktifleşir.
- `emails`, `phones`, `instagram`: İletişim bilgileri. Birden fazla e-posta ve numara eklenebilir, numaraya `name` yazılırsa altında kimin numarası olduğu görünür. Boş bırakılan görünmez.
- `applyDeadline`: Son başvuru anı, `"2026-11-30T23:59:00+03:00"` biçiminde. Ana sayfadaki sayaç bu ana kadar sayar.
- `jury`: Jüri üyeleri. Fotoğrafı `assets/` klasörüne koyup `photo: "assets/isim.jpg"` yaz.
- `sponsors`: Sponsorlar. Logoyu `assets/` klasörüne koyup `logo: "assets/logo.png"` yaz.
- `schedule`, `faq`: Program ve sık sorulan sorular.

Her metnin `tr` ve `en` olmak üzere iki sürümü var. Bir metni değiştirirken ikisini de güncelle.

## Bilgisayarda açmak

`index.html` dosyasına çift tıklaman yeterli. Animasyon kütüphaneleri internetten yüklendiği için bağlantı gerekiyor.

## Yayınlamak (GitHub Pages)

1. Bu klasörü bir GitHub deposuna yükle.
2. Depoda Settings > Pages bölümünde kaynak olarak `main` dalını ve `/ (root)` klasörünü seç.
3. Domain bağlamak için aynı sayfadaki Custom domain alanına domaini yaz. Ardından domaini aldığın yerde GitHub'ın gösterdiği DNS kayıtlarını ekle.
