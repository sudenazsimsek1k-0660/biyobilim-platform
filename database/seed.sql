-- ============================================================
-- BİYOBİLİM — Örnek Geliştirme Verisi (yalnızca development ortamı için)
-- Üretim (production) veritabanında ÇALIŞTIRMAYIN.
-- ============================================================

insert into public.events (slug, title, category, description, location, event_date, event_time, capacity, status)
values
  ('alan-calismasi-kiyi-ekosistemleri', 'Alan Çalışması: Kıyı Ekosistemleri', 'Doğa Yürüyüşü',
   'Sinop kıyı şeridinde bir günlük saha çalışmasıyla kıyı ekosistemlerini gözlemleyeceğiz.',
   'Sinop Kıyı Şeridi', '2026-08-14', '09:00', 30, 'published'),
  ('soylesi-genomik-cagda-evrim', 'Söyleşi: Genomik Çağda Evrim', 'Bilim Söyleşisi',
   'Genom dizileme teknolojilerinin evrim biyolojisi araştırmalarını nasıl dönüştürdüğü üzerine bir söyleşi.',
   'Fen Fakültesi, Amfi 2', '2026-08-22', '18:00', 120, 'published');

insert into public.scientists (slug, full_name, field, category, short_bio, is_featured, featured_month, status)
values
  ('elif-karasu', 'Dr. Elif Karasu', 'Deniz Biyolojisi', 'Ekoloji',
   'Ege kıyılarında mercan ağartması ve deniz suyu ısınmasının etkilerini araştırıyor.',
   true, '2026-07-01', 'published');

insert into public.board_members (full_name, position, short_bio, display_order)
values
  ('Ayşe Yıldız', 'Başkan', 'Ekoloji ve saha araştırmaları üzerine çalışıyor.', 1),
  ('Mert Kaya', 'Başkan Yardımcısı', 'Moleküler biyoloji ve genetik alanında araştırmacı.', 2);
