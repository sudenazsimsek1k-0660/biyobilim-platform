-- ============================================================
-- BİYOBİLİM — Supabase Storage Bucket Kurulumu
-- Supabase SQL Editor'de schema.sql'den SONRA çalıştırın.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('images',            'images',            true,  5242880,  array['image/png','image/jpeg','image/webp','image/svg+xml']),
  ('biologos-pdfs',      'biologos-pdfs',      true,  52428800, array['application/pdf']),
  ('podcast-covers',     'podcast-covers',     true,  5242880,  array['image/png','image/jpeg','image/webp']),
  ('podcast-audio',      'podcast-audio',      true,  209715200,array['audio/mpeg','audio/wav','audio/mp4']),
  ('gallery',            'gallery',            true,  10485760, array['image/png','image/jpeg','image/webp','video/mp4']),
  ('profile-photos',     'profile-photos',     true,  2097152,  array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;

-- Herkes yayınlanmış (public) bucket içeriğini okuyabilir.
create policy "Herkes görsellere erişebilir" on storage.objects
  for select using (bucket_id in ('images','biologos-pdfs','podcast-covers','podcast-audio','gallery','profile-photos'));

-- Yalnızca adminler dosya yükleyebilir/silebilir (profil fotoğrafı hariç — kullanıcı kendi fotoğrafını yükler).
create policy "Adminler içerik dosyası yükler" on storage.objects
  for insert with check (
    bucket_id in ('images','biologos-pdfs','podcast-covers','podcast-audio','gallery')
    and public.is_admin()
  );
create policy "Adminler içerik dosyası siler" on storage.objects
  for delete using (
    bucket_id in ('images','biologos-pdfs','podcast-covers','podcast-audio','gallery')
    and public.is_admin()
  );

create policy "Kullanıcı kendi profil fotoğrafını yükler" on storage.objects
  for insert with check (
    bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "Kullanıcı kendi profil fotoğrafını siler" on storage.objects
  for delete using (
    bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]
  );
