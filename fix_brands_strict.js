import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function main() {
  const desiredBrands = [
    { name: 'AVITEL', slug: 'avitel' },
    { name: 'HIKVISION', slug: 'hikvision' },
    { name: 'TP-LINK', slug: 'tp-link' },
    { name: 'EZVIZ', slug: 'ezviz' },
    { name: 'DAHUA', slug: 'dahua' },
    { name: 'UNIVIEW', slug: 'uniview' },
    { name: 'TVT', slug: 'tvt' },
    { name: 'UNIFI', slug: 'unifi' },
    { name: 'CISCO', slug: 'cisco' }
  ];

  const { data: brands, error: fetchErr } = await supabase.from('brands').select('*');
  if (fetchErr) return console.error('Fetch error:', fetchErr);

  // 1. Unlink products from brands we want to delete
  const desiredNames = desiredBrands.map(b => b.name.toLowerCase());
  const brandsToDelete = brands.filter(b => !desiredNames.includes(b.name.toLowerCase()));
  
  if (brandsToDelete.length > 0) {
    console.log('Unlinking products from extra brands:', brandsToDelete.map(b => b.name));
    for (const b of brandsToDelete) {
      const { error: unlinkErr } = await supabase.from('products').update({ brand_id: null }).eq('brand_id', b.id);
      if (unlinkErr) console.error('Error unlinking products for', b.name, unlinkErr);
    }

    console.log('Deleting extra brands...');
    for (const b of brandsToDelete) {
      const { error: delErr } = await supabase.from('brands').delete().eq('id', b.id);
      if (delErr) console.error('Error deleting', b.name, delErr);
      else console.log('Deleted:', b.name);
    }
  }

  // 2. Add or update desired brands
  for (const db of desiredBrands) {
    const existing = brands.find(b => b.name.toLowerCase() === db.name.toLowerCase());
    if (existing) {
      // update name strictly to uppercase if requested
      const { error: upErr } = await supabase.from('brands').update({ name: db.name }).eq('id', existing.id);
      if (upErr) console.error('Error updating', db.name, upErr);
    } else {
      console.log('Adding missing brand:', db.name);
      const { error: insErr } = await supabase.from('brands').insert({
        name: db.name,
        slug: db.slug,
        is_active: true,
        sort_order: 0
      });
      if (insErr) console.error('Error inserting', db.name, insErr);
      else console.log('Inserted:', db.name);
    }
  }

  const { data: finalBrands } = await supabase.from('brands').select('*');
  console.log('Final DB brands:', finalBrands?.map(b => b.name));
}
main();
