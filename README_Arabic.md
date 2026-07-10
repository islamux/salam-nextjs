# خواطر – حول الدين والحياة 🌿

[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: GPL v3](https://img.shields.io/badge/License-GNU%20GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub](https://img.shields.io/badge/GitHub-Islamux-black?logo=github)](https://github.com/islamux)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green?logo=pwa)](#)

> **خواطر – حول الدين والحياة**  
> تأملات فكرية وروحية مستوحاة من القيم الإسلامية، في قالب عصري مبني على Next.js وTypeScript،  
> مع دعم كامل للغة العربية، والعمل دون اتصال، وتجربة مستخدم متكاملة.

---

## 📖 نظرة عامة

هذا المشروع نُقل بالكامل من **Flutter** إلى **Next.js** باستخدام **TypeScript**،  
وفق خطة ترحيل منظمة من سبع مراحل، ليصبح تطبيق ويب حديث، سريع، ومفتوح المصدر.

---

## ✅ المراحل المنجزة (1 → 7)

### المرحلة 1 – إعداد المشروع
- ✅ استخدام Next.js 14+ مع App Router  
- ✅ TypeScript بوضع strict  
- ✅ Tailwind CSS 4.x  
- ✅ ESLint + Prettier  
- ✅ إنشاء الهيكل العام  

### المرحلة 2 – نقل البيانات
- ✅ تعريف أنواع TypeScript لبيانات خواطر  
- ✅ إعداد طبقة جلب البيانات (SSG)  
- ✅ دعم الخطوط العربية والاتجاه RTL  
- ✅ مكوّن عرض النصوص `ContentRenderer`  
- ✅ تحميل البيانات من 29 ملف Dart (704 نصوص)  

### المرحلة 3 – واجهة المستخدم
- ✅ نظام سمات (فاتح/داكن)  
- ✅ أزرار تحكم بحجم الخط  
- ✅ البحث الفوري  
- ✅ المشاركة عبر Web Share API  
- ✅ تنقل بين الفصول + مؤشر تقدم  
- ✅ صفحة رئيسية بتصميم شبكي أنيق  

### المرحلة 4 – الأداء
- ✅ توليد صفحات ثابتة (SSG + ISR)  
- ✅ تقسيم الحزم وتحميل ديناميكي  
- ✅ شاشات تحميل محسّنة  
- ✅ تحسين الصور وتحليل الأداء  

### المرحلة 5 – المزايا المتقدمة
- ✅ بحث نصي شامل  
- ✅ نظام علامات مرجعية (Bookmarks)  
- ✅ دعم PWA والعمل دون اتصال  
- ✅ صفحة مخصصة لانقطاع الإنترنت  

### المرحلة 6 – SEO وإتاحة الوصول
- ✅ بيانات وصفية ديناميكية  
- ✅ بنية بيانات منظمة (JSON-LD)  
- ✅ Sitemap و Robots.txt  
- ✅ توافق مع معايير WCAG 2.1 AA  
- ✅ توثيق الإتاحة الكاملة  

### المرحلة 7 – الاختبارات والنشر
- ✅ اختبارات وحدة (Vitest)  
- ✅ اختبارات شاملة (Playwright)  
- ✅ CI/CD عبر GitHub Actions  
- ✅ جاهزية كاملة للنشر على Vercel  

---

## 🚀 البدء

### تثبيت الاعتمادات
```bash
pnpm install
```

### تشغيل الخادم المحلي
```bash
pnpm dev
```

> ثم افتح [http://localhost:3000](http://localhost:3000)

---

## 📁 بنية المشروع

```bash
src/
├── app/
│   ├── (routes)/
│   │   ├── home/             # الصفحة الرئيسية – قائمة الفصول
│   │   └── khwater/[id]/     # صفحات الفصول الديناميكية
│   ├── globals.css           # الأنماط العامة مع دعم العربية
│   ├── layout.tsx            # التصميم الجذري مع دعم RTL
│   └── page.tsx              # إعادة التوجيه الأساسية
├── components/
│   ├── khwater/
│   │   └── ContentRenderer.tsx
│   ├── shared/
│   └── ui/
└── lib/
    ├── data/
    │   ├── khwater-service.ts
    │   └── khwater-data.json
    ├── types/
    │   └── khwater.ts
    └── utils/
        ├── parser.ts
        ├── i18n.ts
        └── migrate-data.ts
```

---

## 🎯 المزايا الرئيسية

| المجال | المزايا |
|:--------|:---------|
| **البيانات** | جلب ثابت (SSG) – وصول آمن – بحث فوري |
| **اللغة العربية** | دعم كامل RTL + خطوط Amiri و Noto Sans Arabic |
| **الواجهة** | تحكم بالحجم، بحث فوري، مشاركة، تنقّل بين الفصول |
| **التقنيات** | Next.js، TypeScript، Tailwind CSS، PWA |
| **الإنتاج** | CI/CD، اختبارات، نشر جاهز على Vercel |

---

## 🕌 الهدف من المشروع
مشروع **خواطر – حول الدين والحياة** يسعى لتقديم محتوى عربي راقٍ  
يُعيد إحياء التأملات الإسلامية بروح تقنية معاصرة،  
بواجهة جميلة وسهلة الاستخدام، يمكن تصفحها حتى دون اتصال بالإنترنت.

---

## 📚 التوثيق والدروس
- 🧩 [TESTING_TUTORIAL.md] – دليل شامل لتعلم الاختبار من الصفر  
- 🧹 [CLEANUP_PLAN.md] – خطة تنظيف وتحسين الكود  
- ⚡ [PERFORMANCE.md] – تحسين الأداء  
- 🚀 [DEPLOYMENT.md] – دليل النشر على Vercel  

---

## 🤝 المساهمة

نرحب بجميع المساهمات والمراجعات البنّاءة لتطوير المشروع أو توسيع محتواه.  
للتواصل أو المشاركة في التطوير:

📧 **البريد الإلكتروني:** [fathi733@gmail.com](mailto:fathi733@gmail.com)  
🌐 **GitHub:** [github.com/islamux](https://github.com/islamux)

---

## 📄 الرخصة

هذا المشروع مرخّص تحت رخصة  
**GNU General Public License v3.0 (GPLv3)**  
يمكنك استخدامه أو تعديله بحرية مع الالتزام بشروط الرخصة.  

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

---

