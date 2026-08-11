const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const categories = [
  { slug: 'fabrics', name_tr: 'Kumaşlar', name_en: 'Fabrics', name_ar: 'الأقمشة' },
  { slug: 'yarn', name_tr: 'İplik', name_en: 'Yarn', name_ar: 'الغزول' },
  { slug: 'curtains', name_tr: 'Perdelik Kumaş', name_en: 'Curtain Fabrics', name_ar: 'أقمشة الستائر' },
]

const products = [
  {
    categorySlug: 'fabrics',
    name_tr: 'Pamuklu Twill Kumaş',
    name_en: 'Cotton Twill Fabric',
    name_ar: 'قماش قطني تويل',
    desc_tr:
      'Yüzde yüz pamuk, twill dokuma. Ham ve boyalı seçenekler mevcuttur. Gömlek, iş elbisesi ve pantolon üretimi için idealdir. Metre başına toptan fiyattır; 500 metre altı siparişlerde fiyat değişebilir.',
    desc_en:
      '100% cotton, twill weave. Available in greige and dyed finishes. Ideal for shirts, workwear and trousers. Wholesale price per metre; below 500 metres pricing may vary.',
    desc_ar:
      'قطن ١٠٠٪ بنسيج التويل. متوفر بخامات خام ومصبغة. مثالي لإنتاج القمصان وملابس العمل والسراويل. السعر بالجملة للمتر؛ قد يختلف السعر لأقل من ٥٠٠ متر.',
    price: 3.25,
    min_order: 500,
    images: ['/uploads/seed/fabric-cotton-twill.svg'],
    is_active: true,
  },
  {
    categorySlug: 'fabrics',
    name_tr: 'Keten-Pamuk Karışımlı Kumaş',
    name_en: 'Linen Blend Fabric',
    name_ar: 'قماش مزيج الكتان',
    desc_tr:
      'Keten-pamuk karışımı (55/45), yumuşak dokulu. Yazlık giysi, ev tekstili ve aksesuar üretiminde kullanılır. Boyalı ve doğal tonlarda stokludur.',
    desc_en:
      'Linen-cotton blend (55/45) with a soft hand feel. Used for summer garments, home textiles and accessories. Stocked in dyed and natural shades.',
    desc_ar:
      'مزيج كتان وقطن (٥٥/٤٥) بملمس ناعم. يُستخدم في الملابس الصيفية ومفروشات المنزل والإكسسوارات. متوفر بألوان مصبوغة وطبيعية.',
    price: 5.8,
    min_order: 300,
    images: ['/uploads/seed/fabric-linen-blend.svg'],
    is_active: true,
  },
  {
    categorySlug: 'fabrics',
    name_tr: 'Kadife Kumaş',
    name_en: 'Velvet Fabric',
    name_ar: 'قماش مخمل',
    desc_tr:
      'Yüksek gramajlı kadife kumaş; döşemelik ve perdelik olarak kullanılır. Renk gamı geniştir, numune talep ediniz.',
    desc_en:
      'Heavy-weight velvet for upholstery and drapery. Wide colour range — please request swatches.',
    desc_ar:
      'قماش مخمل عالي الوزن للمفروشات والستائر. تشكيلة ألوان واسعة — يرجى طلب العينات.',
    price: 7.5,
    min_order: 200,
    images: ['/uploads/seed/fabric-velvet.svg'],
    is_active: true,
  },
  {
    categorySlug: 'yarn',
    name_tr: 'Akrilik İplik',
    name_en: 'Acrylic Yarn',
    name_ar: 'غزل أكريليك',
    desc_tr:
      'Yüzde yüz akrilik iplik, taranmış. Kazak ve triko üretimi için uygundur. Kg başına toptan fiyat.',
    desc_en: '100% acrylic yarn, combed. Suitable for knitwear and sweaters. Wholesale price per kg.',
    desc_ar: 'غزل أكريليك ١٠٠٪ ممشط. مناسب لإنتاج الكنزات والتريكو. السعر بالجملة للكيلوغرام.',
    price: 2.9,
    min_order: 100,
    images: ['/uploads/seed/yarn-acrylic.svg'],
    is_active: true,
  },
  {
    categorySlug: 'yarn',
    name_tr: 'Penye Pamuk İplik',
    name_en: 'Combed Cotton Yarn',
    name_ar: 'غزل قطن ممشط',
    desc_tr:
      'Penye pamuk iplik, Ne 20–30 aralığında. Yüksek mukavemet, düşük tüylülük. Triko ve dokuma için uygundur.',
    desc_en:
      'Combed cotton yarn, Ne 20–30. High strength, low pilling. Suitable for knitting and weaving.',
    desc_ar: 'غزل قطن ممشط بدرجة Ne ٢٠-٣٠. قوة عالية وتعرّج منخفض. مناسب للحياكة والنسيج.',
    price: 3.1,
    min_order: 120,
    images: ['/uploads/seed/yarn-cotton.svg'],
    is_active: true,
  },
  {
    categorySlug: 'curtains',
    name_tr: 'Jakarlı Perdelik Kumaş',
    name_en: 'Jacquard Curtain Fabric',
    name_ar: 'قماش ستائر جاكار',
    desc_tr:
      'Jakarlı perdelik kumaş, iplik boyalı. Güneşe karşı dayanıklıdır, ışığı yumuşak süzer. Rulo ve metre bazında tedarik.',
    desc_en:
      'Jacquard-woven curtain fabric, yarn-dyed. Sun-resistant with soft light filtering. Supplied by roll or metre.',
    desc_ar:
      'قماش ستائر منسوج بالجاكار مصبوغ بالخيوط. مقاوم للشمس ويفلتر الضوء بلطف. يُورد باللفة أو بالمتر.',
    price: 8.2,
    min_order: 100,
    images: ['/uploads/seed/curtain-jacquard.svg'],
    is_active: true,
  },
]

const banners = [
  {
    image_url: '/uploads/seed/banner-weave.svg',
    title_tr: 'Toptan Kumaş & İplik',
    title_en: 'Wholesale Fabrics & Yarns',
    title_ar: 'أقمشة وغزول بالجملة',
    is_active: true,
  },
  {
    image_url: '/uploads/seed/banner-weave.svg',
    title_tr: 'Mevsimlik Koleksiyon 2026',
    title_en: 'Seasonal Collection 2026',
    title_ar: 'تشكيلة الموسم ٢٠٢٦',
    is_active: true,
  },
]

const pages = [
  {
    slug: 'about',
    content_tr:
      'Atlas Tekstil, İstanbul merkezli bir aile şirketidir. 25 yılı aşkın süredir Avrupa, Orta Doğu ve Kuzey Afrika\'daki üretici ve toptancılara kumaş ve iplik sağlıyoruz.\n\nVizyonumuz: tutarlı kalite, dürüst fiyat ve güvenilir teslimat talep eden üreticilerin en güvenilir toptan tekstil ortağı olmak.\n\nMisyonumuz: Değirmenlerle doğrudan çalışarak derin stok ve adil fiyatlar sunmak. Tek rulodan tam konteynere her sipariş aynı özenle kontrol edilir, paketlenir ve sevk edilir.',
    content_en:
      'Atlas Textile is a family-run company based in Istanbul, Turkey. For more than 25 years we have supplied fabric and yarn to manufacturers and wholesalers across Europe, the Middle East and North Africa.\n\nOur vision: to be the most trusted wholesale textile partner for producers who demand consistent quality, honest pricing and reliable delivery.\n\nOur mission: we work directly with mills to keep stock deep and prices fair. Every order — from a single roll to a full container — is inspected, packed and dispatched with the same care.',
    content_ar:
      'أطلس تكستايل شركة عائلية مقرها إسطنبول، تركيا. منذ أكثر من ٢٥ عامًا ونحن نزوّد المصنّعين وتجار الجملة في أوروبا والشرق الأوسط وشمال إفريقيا بالأقمشة والغزول.\n\nرؤيتنا: أن نكون شريك النسيج بالجملة الأكثر موثوقية للمصنّعين الذين يطلبون جودة ثابتة وأسعارًا صادقة وتسليمًا موثوقًا.\n\nرسالتنا: نعمل مباشرة مع المصانع لنحافظ على مخزون عميق وأسعار عادلة. كل طلب — من لفة واحدة إلى حاوية كاملة — يُفحص ويُعبّأ ويُشحن بنفس العناية.',
  },
  {
    slug: 'contact',
    content_tr:
      'Satış Ofisi ve Depo: Kuyumcukent San. Sitesi, Merter, İstanbul\nÇalışma saatleri: Pazartesi – Cumartesi, 09:00 – 18:00 (TSİ)\nİhracat satış: export@atlastextile.com\nNumune ve stok listesi için WhatsApp üzerinden ulaşabilirsiniz.',
    content_en:
      'Sales Office & Warehouse: Kuyumcukent San. Sitesi, Merter, Istanbul, Türkiye\nWorking hours: Monday – Saturday, 09:00 – 18:00 (TRT)\nExport sales: export@atlastextile.com\nFor swatches and stock lists, reach us on WhatsApp.',
    content_ar:
      'مكتب المبيعات والمستودع: كويومجوكينت الصناعية، مرتر، إسطنبول، تركيا\nساعات العمل: الإثنين – السبت، ٠٩:٠٠ – ١٨:٠٠ (بتوقيت تركيا)\nمبيعات التصدير: export@atlastextile.com\nللعيّنات وقوائم المخزون تواصلوا معنا عبر واتساب.',
  },
  {
    slug: 'privacy',
    content_tr:
      'Kişisel verileriniz yalnızca sorularınızı yanıtlamak ve sipariş sürecinizi yürütmek için kullanılır.\n\nBilgileriniz üçüncü taraflarla paylaşılmaz. Talebiniz üzerine kayıtlarınızı silebiliriz.\n\nİletişim formundaki bilgiler güvenli kanallar üzerinden iletilir.',
    content_en:
      'Your personal data is used only to answer your enquiries and process your orders.\n\nYour information is never shared with third parties. We will delete your records on request.\n\nContact-form data is transmitted over secure channels.',
    content_ar:
      'تُستخدم بياناتك الشخصية فقط للرد على استفساراتك ومعالجة طلباتك.\n\nلا نشارك معلوماتك مع أي طرف ثالث أبدًا. يمكننا حذف سجلاتك عند الطلب.\n\nتُرسل بيانات نموذج التواصل عبر قنوات آمنة.',
  },
  {
    slug: 'terms',
    content_tr:
      'Toptan satış şartlarımız: Tüm fiyatlar USD olup teyitli siparişinize özeldir.\n\nMinimum sipariş tutarı ürün bazında belirtilmiştir. Ödeme koşulları sipariş onayında bildirilir.\n\nRenk ve gramaj farkları için numune talep edilmesi önerilir. Şikayetler sevkiyat tarihinden itibaren 15 gün içinde bildirilmelidir.',
    content_en:
      'Our wholesale terms: all prices are in USD and quoted against your confirmed order.\n\nMinimum order quantities are listed per product. Payment terms are stated on order confirmation.\n\nWe recommend requesting swatches to confirm colour and weight. Claims must be reported within 15 days of shipment.',
    content_ar:
      'شروط البيع بالجملة: جميع الأسعار بالدولار الأمريكي وتُحتسب على طلبك المؤكد.\n\nتُذكر الكميات الدنيا للطلب لكل منتج. تُوضّح شروط الدفع عند تأكيد الطلب.\n\nننصح بطلب العينات لتأكيد اللون والوزن. يجب الإبلاغ عن الملاحظات خلال ١٥ يومًا من الشحن.',
  },
]

async function main() {
  const catIds = {}
  for (const c of categories) {
    const cat = await prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c })
    catIds[c.slug] = cat.id
  }
  console.log(`✓ ${categories.length} categories`)

  for (const p of products) {
    const { categorySlug, ...data } = p
    data.categoryId = catIds[categorySlug]
    data.images = JSON.stringify(data.images)
    const existing = await prisma.product.findFirst({ where: { name_en: data.name_en } })
    if (existing) await prisma.product.update({ where: { id: existing.id }, data })
    else await prisma.product.create({ data })
  }
  console.log(`✓ ${products.length} products`)

  await prisma.banner.deleteMany()
  await prisma.banner.createMany({ data: banners })
  console.log(`✓ ${banners.length} banners`)

  for (const pg of pages) {
    await prisma.page.upsert({ where: { slug: pg.slug }, update: pg, create: pg })
  }
  console.log(`✓ ${pages.length} pages`)

  const email = 'admin@site.com'
  const password = bcrypt.hashSync('admin123', 10)
  await prisma.admin.upsert({ where: { email }, update: { password }, create: { email, password } })
  console.log('✓ admin user (admin@site.com / admin123)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
