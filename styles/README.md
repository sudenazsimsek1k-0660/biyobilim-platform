# styles/

Bu proje Tailwind-first bir yaklaşım kullanır: tüm tasarım token'ları
(`renkler`, `tipografi`, `spacing`, `border-radius`, `animasyonlar`)
**`tailwind.config.ts`** içinde, global temel stiller ve imza motifi
sınıfları ise **`app/globals.css`** içinde tanımlıdır.

Bu klasör, Tailwind ile ifade edilemeyen özel durumlar için ayrılmıştır
(ör. üçüncü parti bir kütüphanenin CSS dosyasını override etmek gerekirse).
Şu an için boş olması beklenen bir durumdur.
