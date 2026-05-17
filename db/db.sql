create table generations (
  id               uuid primary key default gen_random_uuid(),
  whatsapp_id      text not null,
  suit_analysis    jsonb,
  user_caption     text,
  gemma_prompt     text,
  output_image_url text,
  created_at       timestamptz default now()
);