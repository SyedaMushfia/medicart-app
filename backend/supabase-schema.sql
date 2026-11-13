-- Run in the Supabase SQL Editor for a new, empty project.
-- The Node.js backend is the only application client and uses the secret key.

create extension if not exists pgcrypto;

create table public.medicines (
  id text primary key,
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  category_id text not null,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  image_url text not null default '',
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text not null unique,
  customer_name text not null,
  customer_email text not null,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  order_date timestamptz not null default now(),
  expected_delivery_time timestamptz not null
);

create index orders_lookup_idx
  on public.orders (order_reference, customer_email);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  medicine_id text not null references public.medicines(id) on delete restrict,
  medicine_name text not null,
  image_url text not null default '',
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  subtotal numeric(10, 2) not null check (subtotal >= 0)
);

alter table public.medicines enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

grant select on public.medicines, public.orders, public.order_items to service_role;

create or replace function public.place_order(
  p_customer_name text,
  p_customer_email text,
  p_order_reference text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_order_date timestamptz := clock_timestamp();
  v_item record;
  v_medicine public.medicines%rowtype;
  v_order_items jsonb := '[]'::jsonb;
  v_subtotal numeric(10, 2) := 0;
  v_distinct_items integer;
  v_item_count integer;
begin
  if length(trim(p_customer_name)) < 2 or length(p_customer_name) > 120 then
    raise exception 'INVALID_CUSTOMER_NAME';
  end if;
  if length(p_customer_email) > 254 or p_customer_email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'INVALID_CUSTOMER_EMAIL';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'INVALID_ORDER_ITEMS';
  end if;
  if jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 50 then
    raise exception 'INVALID_ORDER_ITEMS';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_items) as requested(medicine_id text, quantity integer)
    where requested.medicine_id is null
      or trim(requested.medicine_id) = ''
      or requested.quantity is null
      or requested.quantity < 1
  ) then
    raise exception 'INVALID_ORDER_ITEMS';
  end if;

  select count(*), count(distinct requested.medicine_id)
  into v_item_count, v_distinct_items
  from jsonb_to_recordset(p_items) as requested(medicine_id text, quantity integer);
  if v_item_count <> v_distinct_items then
    raise exception 'DUPLICATE_ORDER_ITEMS';
  end if;

  for v_item in
    select requested.medicine_id, requested.quantity
    from jsonb_to_recordset(p_items) as requested(medicine_id text, quantity integer)
    order by requested.medicine_id
  loop
    select *
    into v_medicine
    from public.medicines
    where id = v_item.medicine_id
    for update;

    if not found then
      raise exception 'PRODUCT_NOT_FOUND';
    end if;
    if v_medicine.stock_quantity < v_item.quantity then
      raise exception 'INSUFFICIENT_STOCK';
    end if;

    v_subtotal := v_subtotal + (v_medicine.price * v_item.quantity);
    v_order_items := v_order_items || jsonb_build_array(jsonb_build_object(
      'medicine_id', v_medicine.id,
      'medicine_name', v_medicine.name,
      'image_url', v_medicine.image_url,
      'quantity', v_item.quantity,
      'unit_price', v_medicine.price,
      'subtotal', round(v_medicine.price * v_item.quantity, 2)
    ));
  end loop;

  insert into public.orders (
    id,
    order_reference,
    customer_name,
    customer_email,
    total_amount,
    order_date,
    expected_delivery_time
  ) values (
    v_order_id,
    upper(trim(p_order_reference)),
    trim(p_customer_name),
    lower(trim(p_customer_email)),
    v_subtotal,
    v_order_date,
    v_order_date + interval '1 hour'
  );

  for v_item in select value from jsonb_array_elements(v_order_items)
  loop
    update public.medicines
    set stock_quantity = stock_quantity - (v_item.value->>'quantity')::integer
    where id = v_item.value->>'medicine_id';

    insert into public.order_items (
      order_id,
      medicine_id,
      medicine_name,
      image_url,
      quantity,
      unit_price,
      subtotal
    ) values (
      v_order_id,
      v_item.value->>'medicine_id',
      v_item.value->>'medicine_name',
      coalesce(v_item.value->>'image_url', ''),
      (v_item.value->>'quantity')::integer,
      (v_item.value->>'unit_price')::numeric,
      (v_item.value->>'subtotal')::numeric
    );
  end loop;

  return jsonb_build_object(
    'id', v_order_id,
    'order_reference', upper(trim(p_order_reference)),
    'customer_name', trim(p_customer_name),
    'customer_email', lower(trim(p_customer_email)),
    'total_amount', v_subtotal,
    'order_date', v_order_date,
    'expected_delivery_time', v_order_date + interval '1 hour',
    'items', (
      select coalesce(jsonb_agg(to_jsonb(order_items) - 'order_id'), '[]'::jsonb)
      from public.order_items
      where order_id = v_order_id
    )
  );
end;
$$;

revoke all on function public.place_order(text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.place_order(text, text, text, jsonb) to service_role;
